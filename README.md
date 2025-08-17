# 🏠 Hacker House Protocol

**The first decentralized hackerhouse platform with cross-chain PayPal USD payments.**

## 🚀 The Innovation

We solved a real problem: **How do hackers find roommates and pay for accommodations at hackathons using any crypto?**

### The Magic
- **Find roommates**: Connect with other hackers attending the same events
- **Pay with any crypto**: PayPal USD, ETH, or any supported token
- **Automatic bridging**: Seamlessly pay from any chain
- **Split costs**: Multiple hackers can pay for one accommodation
- **Privacy-first**: Encrypted door codes and wifi passwords

### Why This Matters
- **Real-world use case**: Hackers need affordable lodging and roommates
- **Crypto flexibility**: Pay with whatever tokens you have
- **Cross-chain reality**: No matter what chain your funds are on
- **Community building**: Connect with other hackers before the event

## 🛠️ Tech Stack

| Component | Technology | Why We Chose It |
|-----------|------------|-----------------|
| **Smart Contracts** | Solidity + Foundry | Core logic on Arbitrum Sepolia |
| **Cross-Chain Bridge** | Hyperlane Warp Route | Seamless PYUSD bridging |
| **Data Indexing** | The Graph | Decentralized, real-time queries |
| **Frontend** | Next.js 15 + React 19 | Modern, performant UI |
| **Payments** | PayPal USD (PYUSD) | Real USD-backed token |

## 🔄 The "Hacky" Part

```typescript
// Hackers can pay with ANY crypto, from ANY chain
await token.approve(hyperlaneRouter, amount);
await hyperlaneRouter.transferRemote(
  destinationChain, // Arbitrum Sepolia
  recipient,        // Hacker's address  
  amount,           // Any token amount
  { value: gasFee } // Interchain gas payment
);
// ...automatically bridged and converted!
```

**Why this is clever**: Hackers don't need to worry about which chain their crypto is on - they can pay with whatever they have!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Foundry
- Test ETH on Sepolia & Arbitrum Sepolia
- Test PYUSD on Sepolia

### Deploy Everything

1. **Contracts**
```bash
cd all-contracts
forge build
forge script Deploy --rpc-url $ARBITRUM_SEPOLIA_RPC_URL --broadcast
```

2. **Subgraph**
```bash
cd sub-graph
npm install && npm run codegen && npm run build && npm run deploy
```

3. **Frontend**
```bash
cd hacker-house-app
npm install && npm run dev
```

## 📊 Live Demo

- **Contract**: `0xE633Ea91a3c78C5C29B04A6883AA970b19220cF9` (Arbitrum Sepolia)
- **Subgraph**: [The Graph Studio](https://thegraph.com/studio/subgraph/hacker-house-protocol/playground)

## 🎯 Impact

This isn't just another DeFi protocol. We're solving real problems that affect thousands of hackers at events worldwide:

- **No more expensive solo bookings** - find roommates to split costs
- **No more "what crypto do you accept?"** - pay with any token from any chain
- **No more centralized platforms** taking 15% fees
- **No more awkward roommate matching** - connect with fellow hackers

**The future**: Every hackathon becomes more affordable and accessible. Hackers can focus on building, not worrying about accommodation logistics.

---

*Built with ❤️ for the hackathon community*
Twitter: x.com/hackerhousep
Website: https://hackerhouse.app/
Presentation Deck: https://docs.google.com/presentation/d/1086j3TyvSXLmkPZK3aXF58eYmfiQqNOTiOXxJY7VTq8/
Figma: https://www.figma.com/design/A8k8TI5T4IvaJHZ41b05aY/NYC-Hackathon---FINAL?node-id=0-1&p=f&t=RgqqTm0ksDj1oXCn-0

---
Important Note: On the submission dashboard we got the following message: "Too many lines changed in a single commit", but this is because we merge 3 different repo (app, subgraph and Contracts) and turned this into one mono-repo for submission.

