// scripts/bridge-and-fund.mjs
// node scripts/bridge-and-fund.mjs \
//   --amount 100 \
//   --reservationId 6
// Optional: --createListing --name "Hacker House NYC" --location "New York" --rate 150 --maxGuests 6 --metadataURI ipfs://... --nights 2
// Optional: --createReservation (uses newly created listing if --createListing, otherwise needs --listingId)

import { ethers } from "ethers";

// ---------- CLI ARGS (tiny parser) ----------
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) {
      const key = cur.slice(2);
      const nxt = arr[i + 1];
      if (!nxt || nxt.startsWith("--")) acc.push([key, true]);
      else acc.push([key, nxt]);
    }
    return acc;
  }, [])
);

// ---------- ENV REQUIRED ----------
const {
  SEPOLIA_RPC_URL,
  ARB_SEPOLIA_RPC_URL,
  SEPOLIA_PK,                 // private key with Sepolia ETH & tPYUSD
  // Contracts:
  SEPOLIA_ROUTER,            // HypERC20Collateral proxy on Sepolia (router)
  TPYUSD_COLL,               // underlying PYUSD-like ERC20 on Sepolia (6 decimals)
  HYPYUSD_ARB,               // synthetic token on Arbitrum Sepolia
  HHP_ADDRESS,               // HackerHouseProtocol on Arbitrum Sepolia
} = process.env;

function must(name, v) {
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const ARBSEP_DOMAIN = 421614; // Arbitrum Sepolia domain id

// ---------- ABIs ----------
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function approve(address,uint256) returns (bool)",
];

const ROUTER_ABI = [
  "function transferRemote(uint32,bytes32,uint256) payable",
  // one of these will exist — we’ll try both:
  "function quoteGasPayment(uint32) view returns (uint256)",
  "function quoteGasPayment(uint32,uint256) view returns (uint256)",
  // sometimes exposed:
  "function interchainGasPaymaster() view returns (address)",
  "function igp() view returns (address)",
];

const HHP_ABI = [
  "function createListing(string,string,string,address,uint256,uint8,bytes32,string,bool) returns (uint256)",
  "function createReservation(tuple(uint256 listingId,uint64 startDate,uint64 endDate,uint256 nights,address[] payers,uint16[] bps), tuple(uint256 expiry,uint256 nonce,bytes sig)) returns (uint256)",
  "function reservations(uint256) view returns (uint256,address,uint64,uint64,uint256,uint256,bool)",
  "function fundReservation(uint256 reservationId, uint256 amount)",
];

// ---------- Providers & Signers ----------
const sepProvider = new ethers.JsonRpcProvider(must("SEPOLIA_RPC_URL", SEPOLIA_RPC_URL));
const arbProvider = new ethers.JsonRpcProvider(must("ARB_SEPOLIA_RPC_URL", ARB_SEPOLIA_RPC_URL));
const sepWallet   = new ethers.Wallet(must("SEPOLIA_PK", SEPOLIA_PK), sepProvider);
const arbWallet   = sepWallet.connect(arbProvider); // same key on both chains

// ---------- Contracts ----------
const routerSep = new ethers.Contract(must("SEPOLIA_ROUTER", SEPOLIA_ROUTER), ROUTER_ABI, sepWallet);
const tpyusd    = new ethers.Contract(must("TPYUSD_COLL", TPYUSD_COLL), ERC20_ABI, sepWallet);
const hyPyusd   = new ethers.Contract(must("HYPYUSD_ARB", HYPYUSD_ARB), ERC20_ABI, arbWallet);
const HHP       = new ethers.Contract(must("HHP_ADDRESS", HHP_ADDRESS), HHP_ABI, arbWallet);

// ---------- Helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toUnits(amountStr, decimals) {
  // BigInt-safe conversion for integers
  const [whole, frac = ""] = String(amountStr).split(".");
  if (frac && [...frac].some((c) => c !== "0")) {
    throw new Error(`Provide integer token amount or match decimals precisely. Got ${amountStr}`);
  }
  return BigInt(whole) * (10n ** BigInt(decimals));
}

function addrToBytes32(addr) {
  // left-pad 20-byte address to 32 bytes
  return ethers.zeroPadValue(ethers.getAddress(addr), 32);
}

async function getQuoteWei(domain = ARBSEP_DOMAIN) {
  // try 1-arg, then 2-arg (gasLimit=200000)
  try {
    const q = await routerSep.quoteGasPayment(domain);
    return q;
  } catch (_) {
    try {
      const q = await routerSep.quoteGasPayment(domain, 200_000);
      return q;
    } catch (e2) {
      // fallback: send a safe buffer; caller can override by `--valueWei`
      return ethers.parseEther("0.003");
    }
  }
}

async function ensureAllowance(token, owner, spender, needed) {
  const cur = await token.allowance(owner, spender);
  if (cur >= needed) return;
  console.log(`🟡 Approving ${spender} for ${needed}...`);
  const tx = await token.approve(spender, needed);
  await tx.wait();
  console.log(`   ✓ approve tx: ${tx.hash}`);
}

// ---------- MAIN ----------
(async () => {
  const mySepAddr = await sepWallet.getAddress();
  const myArbAddr = await arbWallet.getAddress();
  console.log(`🧑 Sepolia  : ${mySepAddr}`);
  console.log(`🧑 ArbSep   : ${myArbAddr}`);

  // ----- amounts & decimals -----
  const decimals = Number(await tpyusd.decimals()); // expect 6
  const amountTokens = args.amount ? String(args.amount) : "100";
  const amount = toUnits(amountTokens, decimals);

  // =====================================================================================
  // (A) OPTIONAL: create listing (requireProof=false) on Arbitrum Sepolia
  // =====================================================================================
  let listingId = args.listingId ? BigInt(args.listingId) : null;

  if (args.createListing) {
    const name        = args.name        ?? "Hacker House (Demo)";
    const location    = args.location    ?? "Arbitrum Sepolia";
    const metadataURI = args.metadataURI ?? "ipfs://example";
    const nightlyRate = args.rate ? toUnits(String(args.rate), decimals) : toUnits("50", decimals);
    const maxGuests   = args.maxGuests ? Number(args.maxGuests) : 4;

    console.log(`🏠 Creating listing on Arbitrum Sepolia with paymentToken=${HYPYUSD_ARB} ...`);
    const tx = await HHP.createListing(
      name,
      location,
      metadataURI,
      HYPYUSD_ARB,         // payment token is the synthetic on Arb Sepolia
      nightlyRate,
      maxGuests,
      ethers.ZeroHash,     // privDataHash (none)
      "",                  // encPrivDataCid (none)
      false                // requireProof=false (no EIP-712 gating)
    );
    const rc = await tx.wait();
    // Return value decoding (v6): use interface decodeResult from the tx, or read from logs if needed.
    const res = await arbProvider.getTransactionReceipt(tx.hash);
    // safer: call again via static to get the id
    // but we can parse by calling a read if your function returns ID:
    const ret = await arbProvider.call({ to: HHP_ADDRESS, data: tx.data }, rc.blockNumber);
    const id = HHP.interface.decodeFunctionResult("createListing", ret)[0];
    listingId = id;
    console.log(`   ✓ listingId: ${listingId}`);
  }

  // =====================================================================================
  // (B) OPTIONAL: create reservation (self payer 100%)
  // =====================================================================================
  let reservationId = args.reservationId ? BigInt(args.reservationId) : null;

  if (args.createReservation) {
    const _listing = listingId ?? BigInt(args.listingId);
    if (!_listing) throw new Error("Need --listingId or run with --createListing");
    const nights = BigInt(args.nights ?? 1);

    // simple dummy dates: start now+5 min, end = start + nights * 1day
    const now = Math.floor(Date.now() / 1000);
    const startDate = BigInt(now + 5 * 60);
    const endDate   = BigInt(Number(startDate) + Number(nights) * 86400);

    const a = {
      listingId: _listing,
      startDate,
      endDate,
      nights,
      payers: [myArbAddr],
      bps: [10_000]
    };
    const p = { expiry: 0, nonce: 0, sig: "0x" }; // not used when requireProof=false

    console.log(`🧾 Creating reservation...`);
    const tx = await HHP.createReservation(a, p);
    const rc = await tx.wait();

    // decode return value
    const ret = await arbProvider.call({ to: HHP_ADDRESS, data: tx.data }, rc.blockNumber);
    reservationId = HHP.interface.decodeFunctionResult("createReservation", ret)[0];

    console.log(`   ✓ reservationId: ${reservationId}`);
  }

  // =====================================================================================
  // (C) Bridge: Sepolia tPYUSD -> Arbitrum Sepolia hyPYUSD
  // =====================================================================================
  const mySepBal = await tpyusd.balanceOf(mySepAddr);
  if (mySepBal < amount) throw new Error(`Not enough tPYUSD on Sepolia. Have ${mySepBal}, need ${amount}`);

  // 1) approve router to pull tokens
  await ensureAllowance(tpyusd, mySepAddr, SEPOLIA_ROUTER, amount);

  // 2) IGP quote
  let quote = await getQuoteWei(ARBSEP_DOMAIN);
  // allow override from CLI
  if (args.valueWei) {
    quote = BigInt(args.valueWei);
  } else {
    quote = (quote * 11n) / 10n; // +10% buffer
  }
  console.log(`⛽ IGP value (wei): ${quote} (~${ethers.formatEther(quote)} ETH)`);

  // 3) transferRemote
  const recipient32 = addrToBytes32(myArbAddr);
  console.log(`🌉 Bridging ${amountTokens} to Arbitrum Sepolia...`);
  const txBridge = await routerSep.transferRemote(
    ARBSEP_DOMAIN,
    recipient32,
    amount,
    { value: quote }
  );
  console.log(`   tx: ${txBridge.hash}`);
  await txBridge.wait();
  console.log(`   ✓ transferRemote confirmed on Sepolia`);

  // 4) wait for mint on Arbitrum Sepolia (simple poll)
  console.log(`⏳ Waiting for hyPYUSD to arrive on Arbitrum Sepolia...`);
  const start = Date.now();
  let got = false;
  while (Date.now() - start < 6 * 60 * 1000) { // up to 6 minutes
    const bal = await hyPyusd.balanceOf(myArbAddr);
    if (bal >= amount) { got = true; break; }
    await sleep(8000);
  }
  if (!got) {
    console.warn("⚠️  Timed out waiting; you can re-run only steps D/E later when balance shows up.");
  } else {
    console.log("   ✓ hyPYUSD minted on Arbitrum Sepolia");
  }

  // =====================================================================================
  // (D) If we have a reservation, fund it using hyPYUSD on Arbitrum Sepolia
  // =====================================================================================
  if (reservationId != null) {
    // approve HHP to pull
    await ensureAllowance(hyPyusd, myArbAddr, HHP_ADDRESS, amount);
    console.log(`💸 Funding reservation ${reservationId} with ${amountTokens}...`);
    const txFund = await HHP.fundReservation(reservationId, amount);
    console.log(`   tx: ${txFund.hash}`);
    await txFund.wait();
    console.log(`   ✓ fundReservation confirmed`);
  } else {
    console.log("ℹ️  No reservationId provided/created; skipping funding step.");
  }

  console.log("✅ Done.");
})().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
