# Hacker House Protocol (Mono-Repo)

**What this repo shows:**

- Create a **listing** on Arbitrum Sepolia with public + private metadata on IPFS
- Bridge **PYUSD ➜ hyPYUSD** using **Hyperlane Warp Route** (Sepolia → Arbitrum Sepolia)
- Create & **fund a reservation** in **hyPYUSD**
- See live state via **The Graph** (Subgraph)

> Wallet connect: Privy (MVP).  
> Gating (optional): EIP-712 proof if a listing requires POAP.

# Technology USED

- **THE GRAPH** (SUBGRAPH AND HYPERGRAPH) (/sub-graph folder)
- **Hyperlane** (pyUSD Crosschain payment) (/contracts Folder)
- **Paypal USD** (pyUSD as Main token with cross chain and interaopertability using Hyperlane) (/scripts in /contracts and when making payment)
- **Privy** (Wallet Connection and Interaction)

---

## Deployed (Testnets)

| Component                         | Chain            | Address                                      |
| --------------------------------- | ---------------- | -------------------------------------------- |
| HackerHouseProtocol               | Arbitrum Sepolia | `0xE633Ea91a3c78C5C29B04A6883AA970b19220cF9` |
| hyPYUSD (synthetic)               | Arbitrum Sepolia | `0xD584433723A69FC92aEDB058De82298ACe9591Fc` |
| HypERC20Collateral (router/proxy) | Sepolia          | `0x967884fcFab55BB8Ed249d2834Fb12eED38e19B9` |
| PYUSD collateral token (test)     | Sepolia          | `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9` |
| Mailbox                           | Sepolia          | `0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766` |

**Subgraph:** `https://thegraph.com/studio/subgraph/hacker-house-protocol/playground`  
**Demo video:** (link)

---

## Quickstart

### 0) Prereqs

- Node 18+, Foundry (forge/cast), pnpm or npm
- Test ETH on **Sepolia** & **Arbitrum Sepolia**
- Some test **PYUSD on Sepolia** (our “collateral” token)

### 1) Configure env

Copy and fill:

```bash
cp .env.example .env
```

**Cross chain flow (PAYPAL USD & HYPERLANE)**

The user payment flow (today)

User has tPYUSD on Sepolia (or acquires it).

They bridge it with Hyperlane:

approve(router, amount) on Sepolia (tPYUSD).

transferRemote(ArbSepolia, recipient, amount) on the Sepolia router, paying a small IGP fee in Sepolia ETH.

Hyperlane delivers the message; on Arbitrum Sepolia, the user receives hyPYUSD.

They pay out protocol:

approve(HHP, amount) on hyPYUSD.

HHP.fundReservation(reservationId, amount) on Arbitrum Sepolia.

Later, the builder withdraws from HHP (hyPYUSD goes to builder; protocol fee to treasury).

(If the builder wants funds back on another chain, they can bridge hyPYUSD back via Hyperlane, which burns on Arbitrum and mints/unlocks on the other side.)

How this connects to the app pieces with others

HackerHouseProtocol (Arbitrum Sepolia)
Accepts hyPYUSD as its paymentToken. Handles listings, reservations, splits, funding, and withdraw.

Hyperlane
Provides the interchain PYUSD experience: lock (Sepolia) ↔ mint (Arb Sepolia) and back. 

We used:
  - Warp Route (collateral ↔ synthetic)
  - Mailbox/ISM (message security/verification)
  - IGP (interchain gas payment)
PYUSD
  - The currency users hold/bridge. In prod, this could be real PYUSD from Mainnet (or L2s with liquidity). In test, it’s tPYUSD collateral on Sepolia → hyPYUSD on Arbitrum Sepolia.

## Technical Overview

This section details the core architecture, data flows, and technology stack of the Hacker House Protocol.

---

### Create (Write Paths)

These are the primary user actions that write data to the blockchain and supporting systems.

#### 1. Create Listing (Arbitrum Sepolia)

**Off-chain Steps:**

1.  **Upload Photos:** All property images are uploaded to IPFS.
2.  **Build Public Metadata:** A `metadata.public.json` file is created containing the listing's name, location, photo CIDs, and amenities. This file is also uploaded to IPFS.
3.  **Encrypt Private Data:** A `private.plain.json` file (containing sensitive info like door codes) is encrypted. The resulting ciphertext is uploaded to IPFS, and a `privDataHash` of the plaintext is computed for on-chain verification.

**On-chain Transaction:**
A call is made to `HackerHouseProtocol.createListing(...)` with the following parameters:

- `paymentToken`: The address of the `hyPYUSD` token on Arbitrum Sepolia.
- `metadataURI`: The `ipfs://` URI of the public metadata JSON.
- `privDataHash`: The Keccak-256 hash of the private data.
- `encPrivDataCid`: The `ipfs://` URI of the encrypted private data.
- `requireProof`: A boolean to indicate if reservations require an EIP-712 signature.

**Indexed Events:**

- `ListingCreated`
- `ListingMetadataURISet`
- `ListingPrivateDataSet`
- `ListingRequireProofUpdated`

#### 2. Create Reservation (Arbitrum Sepolia)

The process depends on whether the listing requires proof:

- **If `requireProof = true`:**

  1.  **Verifier Service (Backend):** A Node.js service checks if the user holds a specific POAP on Gnosis Chain (via The Graph).
  2.  **Signature:** If valid, the service signs an EIP-712 `Eligibility` message (`user`, `listingId`, `expiry`, `nonce`).
  3.  **Frontend:** The frontend sends the `{expiry, nonce, sig}` to the `createReservation` function.

- **If `requireProof = false`:**
  - A blank proof is sent: `{expiry: 0, nonce: 0, sig: 0x0}`.

The smart contract validates the dates, ensures `nights > 0`, checks that payment splits sum to 100%, and verifies the proof if required.

**Indexed Events:**

- `ReservationCreated`
- `CoPayersSet`

#### 3. Fund Reservation (Bridging if Needed)

**Bridging from Sepolia (Collateral Chain):**

1.  **Approve:** The user approves the Hyperlane router to spend their `PYUSD` on Sepolia.
2.  **Bridge:** The user calls `transferRemote` on the Hyperlane router, specifying the destination chain (Arbitrum Sepolia), recipient, and amount. A gas payment is included via `msg.value`.
3.  **Receive:** The user receives `hyPYUSD` on Arbitrum Sepolia.

**Paying the Protocol (Arbitrum Sepolia):**

1.  **Approve:** The user approves the Hacker House Protocol contract to spend their `hyPYUSD`.
2.  **Fund:** The user calls `fundReservation` with the `reservationId` and `amount`.

**Indexed Events:**

- `ReservationFunded`
- `FundsWithdrawn` (emitted later when the host withdraws funds)

---

### Read (Query Paths)

All UI data is sourced from a Subgraph deployed to The Graph's decentralized network.

#### Subgraph Entities

- **`Listing`**: `{ id, builder, paymentToken, nightlyRate, maxGuests, active, requireProof, metadataURI, ... }`
- **`Reservation`**: `{ id, listing, renter, startDate, endDate, totalDue, amountPaid, active, ... }`
- **`Split`**: `{ id, reservation, payer, bps }`
- **`Funding`**: `{ id, reservation, payer, amount, timestamp }`
- **`Withdrawal`**: `{ id, reservation, to, builderAmount, protocolFee, timestamp }`

#### Event Handlers

Handlers map directly to smart contract events (e.g., `handleListingCreated`, `handleReservationFunded`).

#### Example Frontend Queries

- Fetch active listings with filters for price, guests, or location.
- Get listing details by ID, then fetch the `metadataURI` from IPFS.
- Display reservation funding progress by querying the `Reservation` and its associated `Fundings`.

> **Why The Graph?** It dramatically reduces direct RPC calls, provides powerful filtering and searching capabilities, and allows the frontend to remain stateless.

---

### Background Services

#### Verifier Service (Node.js)

- **Function:** Checks for POAP ownership on Gnosis via The Graph.
- **Output:** Signs and returns a short-lived EIP-712 `Eligibility` signature.
- **Security:** The smart contract enforces a strict expiry (e.g., 10 minutes) and uses a nonce to prevent replay attacks.

#### IPFS Pinning

- Ensures all public metadata and private ciphertexts are permanently pinned, for instance via Pinata.

---

### Technology Stack & Priorities

1.  **Highest Priority: Smart Contract & Hyperlane**

    - The `HackerHouseProtocol` contract is the core of the system.
    - Hyperlane's Warp Route is critical for bridging `PYUSD` to `hyPYUSD` on Arbitrum Sepolia, enabling payments.

2.  **High Priority: The Graph**

    - The subgraph powers all data reads for the application UI.

3.  **Medium Priority: Verifier Service**

    - Only required for listings where `requireProof = true`. Its development can be deferred if not immediately needed for the MVP.

4.  **Lowest Priority: Privy**
    - Serves as the wallet connector. It can be easily swapped with other solutions and does not handle sensitive user data.
  


Important Note: On the submission dashboard we got the following message: "Too many lines changed in a single commit", but this is because we merge 3 different repo (app, subgraph and Contracts) and turned this into one mono-repo for submission.
