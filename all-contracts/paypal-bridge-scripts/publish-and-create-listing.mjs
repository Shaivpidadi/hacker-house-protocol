#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import FormData from 'form-data';
import got from 'got';
import rfs from 'recursive-fs';
import basePathConverter from 'base-path-converter';
import { ethers } from 'ethers';
import { PinataSDK } from 'pinata';

// ---------- simple args ----------
function arg(flag, def) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (!v || v.startsWith('--')) return true;
  return v;
}
function argPath(flag, def) {
  const v = arg(flag, def);
  return v === true ? def : v;
}

// ---------- CLI (required) ----------
const NAME           = arg('--name')            ?? 'Untitled Listing';
const LOCATION       = arg('--location')        ?? '';
const PAYMENT_TOKEN  = arg('--paymentToken');
const RATE_HUMAN     = arg('--rate');                  // e.g. "150"
const DECIMALS       = Number(arg('--decimals', '6')); // 6 for USDC-like
const MAX_GUESTS     = Number(arg('--maxGuests', '4'));
const REQUIRE_PROOF  = String(arg('--requireProof', 'false')).toLowerCase() === 'true';

// ---------- paths (only houses is a path; JSONs are inline by default) ----------
const DIR_HOUSES     = argPath('--houses', './houses');
// optional file overrides; leave unset to use inline JSON baked below:
const PUBLIC_JSON_FILE  = arg('--public');  // e.g. ./metadata.public.json
const PRIVATE_JSON_FILE = arg('--private'); // e.g. ./private.plain.json

// ---------- ENV ----------
const {
  PINATA_JWT,
  PINATA_GATEWAY,    // optional cosmetic
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT,
  ENCRYPTION_KEY_HEX // optional 32-byte hex (0x…); otherwise generated
} = process.env;

if (!PINATA_JWT)   throw new Error('Missing PINATA_JWT');
if (!RPC_URL)      throw new Error('Missing RPC_URL');
if (!PRIVATE_KEY)  throw new Error('Missing PRIVATE_KEY');
if (!CONTRACT)     throw new Error('Missing CONTRACT');
if (!PAYMENT_TOKEN)throw new Error('Missing --paymentToken');
if (!RATE_HUMAN)   throw new Error('Missing --rate');

// ---------- Inline JSONs (edit these as you like) ----------
// Public metadata we’re OK with being public.
const INLINE_PUBLIC = {
  name: NAME,
  location: LOCATION,
  photos: [],               // auto-filled from ./houses filenames
  amenities: ["wifi","coffee","24/7 access"],
  abilities: ["co-working","events"],
  paymentToken: PAYMENT_TOKEN,
  nightlyRate: RATE_HUMAN,
  maxGuests: MAX_GUESTS
};

// Private JSON (sensitive). You can edit below or pass --private <file>.
const INLINE_PRIVATE = {
  rooms: [{ number: "3A", beds: 2 }],
  lockCode: "8230#",
  wifi: { ssid: "HackerHouse", password: "s3cr3t!" },
  who: [],
  notes: "Spare key with building super."
};

// ---------- helpers ----------
function toIpfsUri(cid, p = '') {
  const gateway = PINATA_GATEWAY || 'gateway.pinata.cloud';
  return p ? `https://${gateway}/ipfs/${cid}/${p}` : `https://${gateway}/ipfs/${cid}`;
}
function aesGcmEncrypt(plaintextUtf8, keyHex) {
  const key = keyHex ? Buffer.from(keyHex.replace(/^0x/, ''), 'hex') : crypto.randomBytes(32);
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY_HEX must be 32 bytes (hex)');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintextUtf8, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    keyHex: '0x' + key.toString('hex'),
    ivB64: iv.toString('base64'),
    ctB64: ciphertext.toString('base64'),
    tagB64: tag.toString('base64')
  };
}
async function pinFolderToPinata(folderAbs, jwt) {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const { files } = await rfs.read(folderAbs);
  const data = new FormData();
  for (const f of files) {
    data.append('file', fs.createReadStream(f), { filepath: basePathConverter(folderAbs, f) });
  }
  const res = await got(url, { method: 'POST', headers: { Authorization: `Bearer ${jwt}` }, body: data }).json();
  return res.IpfsHash; // CID
}

// ---------- Pinata SDK for JSON ----------
const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY || 'gw.mypinata.cloud'
});

// ---------- main ----------
(async () => {
  // 1) Upload images folder
  const housesDirAbs = path.resolve(process.cwd(), DIR_HOUSES);
  console.log('➕ Uploading images folder to Pinata…');
  const housesCid = await pinFolderToPinata(housesDirAbs, PINATA_JWT);
  console.log('   ✓ houses CID:', housesCid, toIpfsUri(housesCid));

  // 2) Build public metadata (inline or from file), then upload
  console.log('📝 Preparing public metadata…');

  let publicMeta;
  if (PUBLIC_JSON_FILE) {
    // read from file if provided
    const p = path.resolve(process.cwd(), PUBLIC_JSON_FILE);
    publicMeta = JSON.parse(fs.readFileSync(p, 'utf8'));
  } else {
    // use inline
    publicMeta = { ...INLINE_PUBLIC };
  }

  // auto-derive photo filenames if photos is empty
  if (!Array.isArray(publicMeta.photos) || publicMeta.photos.length === 0) {
    const all = fs.readdirSync(housesDirAbs).filter(f => !fs.lstatSync(path.join(housesDirAbs, f)).isDirectory());
    publicMeta.photos = all;
  }
  // rewrite photos to be full https URIs, converting ipfs:// URIs and local paths
  publicMeta.photos = publicMeta.photos.map(p => {
    if (p.startsWith('http')) {
      return p;
    }
    if (p.startsWith('ipfs://')) {
      const path = p.substring('ipfs://'.length);
      const [cid, ...rest] = path.split('/');
      return toIpfsUri(cid, rest.join('/'));
    }
    return toIpfsUri(housesCid, p);
  });
  publicMeta.imagesRoot = toIpfsUri(housesCid);

  const pubUpload = await pinata.upload.json(publicMeta);
  const metadataCid = pubUpload.cid;
  console.log('   ✓ metadata CID:', metadataCid, toIpfsUri(metadataCid));

  // 3) Build private JSON (inline or from file), hash, encrypt, upload
  console.log('🔒 Hashing & encrypting private JSON…');

  let privatePlain;
  if (PRIVATE_JSON_FILE) {
    const p = path.resolve(process.cwd(), PRIVATE_JSON_FILE);
    privatePlain = fs.readFileSync(p, 'utf8');
  } else {
    privatePlain = JSON.stringify(INLINE_PRIVATE);
  }

  const privDataHash = ethers.keccak256(ethers.toUtf8Bytes(privatePlain));
  const enc = aesGcmEncrypt(privatePlain, ENCRYPTION_KEY_HEX);
  const envelope = { alg: 'AES-256-GCM', iv: enc.ivB64, tag: enc.tagB64, ciphertext: enc.ctB64 };
  if (!ENCRYPTION_KEY_HEX) {
    fs.writeFileSync(path.resolve(process.cwd(), 'private.encrypt.key'), enc.keyHex + '\n', { mode: 0o600 });
    console.log('   ⚠️  saved new symmetric key to ./private.encrypt.key (guard this file)');
  }
  const encUpload = await pinata.upload.json(envelope);
  const encPrivCid = encUpload.cid;
  console.log('   ✓ private ciphertext CID:', encPrivCid, toIpfsUri(encPrivCid));

  // 4) Chain call
  console.log('⛓  Creating listing on-chain…');
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);

  const abi = [
    'function nextListingId() view returns (uint256)',
    'function createListing(string,string,string,address,uint256,uint8,bytes32,string,bool) returns (uint256)',
    'event ListingCreated(uint256 indexed listingId,address indexed builder,address indexed paymentToken,bytes32 nameHash,bytes32 locationHash,uint256 nightlyRate,uint8 maxGuests,bool requireProof,string metadataURI,bytes32 privDataHash,string encPrivDataCid)',
    'event ListingCreatedBasic(uint256 indexed listingId,address indexed builder,address indexed paymentToken,bytes32 nameHash,bytes32 locationHash,uint256 nightlyRate,uint8 maxGuests,bool requireProof)',
    'event ListingMetadataURISet(uint256 indexed listingId,string metadataURI)',
    'event ListingPrivateDataSet(uint256 indexed listingId,bytes32 privDataHash,string encPrivDataCid)'
  ];

  const contract   = new ethers.Contract(CONTRACT, abi, wallet);
  const nightlyRate = ethers.parseUnits(RATE_HUMAN, DECIMALS);

  const before = await contract.nextListingId();
  const predictedId = before + 1n;

  const tx = await contract.createListing(
    NAME,
    LOCATION,
    toIpfsUri(metadataCid),
    PAYMENT_TOKEN,
    nightlyRate,
    MAX_GUESTS,
    privDataHash,
    toIpfsUri(encPrivCid),
    REQUIRE_PROOF
  );
  console.log('   ↳ tx:', tx.hash);
  const rcpt = await tx.wait();
  console.log('   ✓ mined in block', rcpt.blockNumber);

  // best-effort parse listingId
  let listingId = predictedId;
  for (const log of rcpt.logs) {
    try {
      const p = contract.interface.parseLog(log);
      if (p?.name === 'ListingCreated' || p?.name === 'ListingCreatedBasic') {
        listingId = p.args.listingId;
        break;
      }
    } catch (_) {}
  }

  console.log('\n✅ DONE');
  console.log('Listing ID      :', listingId.toString());
  console.log('Name / Location :', NAME, '/', LOCATION);
  console.log('Payment Token   :', PAYMENT_TOKEN);
  console.log('Nightly Rate    :', RATE_HUMAN, `(decimals=${DECIMALS})`);
  console.log('Max Guests      :', MAX_GUESTS);
  console.log('Require Proof   :', REQUIRE_PROOF);
  console.log('metadataURI     :', toIpfsUri(metadataCid));
  console.log('privDataHash    :', privDataHash);
  console.log('encPrivDataCid  :', toIpfsUri(encPrivCid));
  console.log('imagesRoot      :', toIpfsUri(housesCid));
})().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
