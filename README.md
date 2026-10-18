# ⚡ Gibwork Terminal (`gibwork-terminal`)

> **Autonomous Terminal Utility, Bounty Sentinel & Agent Integration for Gibwork**  
> Built for the **Gibwork Developer Hackathon** using the official `@gibwork/sdk` and `@solana/web3.js`.

---

## 🚀 Overview

**Gibwork Terminal** is a professional, non-web command-line interface (CLI) and autonomous sentinel engine designed for Solana developers, bot operators, and bounty hunters. 

While Gibwork provides mobile apps and web frontends, developer-centric automation requires a fast, headless, scriptable terminal interface that can integrate into developer workflows, local shells, daemon cron jobs, and AI agents.

### Why It Matters:
- **Zero Web Overhead:** Fast, terminal-native execution with ANSI formatting.
- **Autonomous Bounty Sentinel:** Continuous background watcher polling for high-value bounties with customizable thresholds.
- **Instant Triage:** Strip HTML, calculate real-time deadline urgency, parse token mints, and inspect rules directly in your terminal.
- **Data Pipelines:** Export live bounty ecosystems directly to JSON or CSV for CI/CD integrations or analytical scripts.
- **Solana Web3 Native:** Integrated keypair generation, address validation, and RPC on-chain balance verification.

---

## 🛠️ Architecture

```
gibwork-hunter/
├── bin/
│   └── gibwork-terminal.js       # CLI entry point & Commander dispatcher
├── src/
│   ├── client.js                 # @gibwork/sdk client factory & keypair signer
│   └── commands/
│       ├── list.js               # Tabular bounty discovery & filtering
│       ├── inspect.js            # Deep-dive specification parser & deadline urgency
│       ├── watch.js              # Autonomous sentinel daemon loop
│       ├── wallet.js             # Keypair factory & Solana RPC balance auditor
│       └── export.js             # JSON/CSV structured pipeline exporter
├── package.json
└── README.md
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js:** v22.0.0 or newer
- **Solana RPC:** Mainnet or Devnet (defaults to public cluster)

```bash
# Clone or navigate to the directory
cd gibwork-hunter

# Install dependencies
npm install

# (Optional) Link globally for system-wide access
npm link
```

### Configuration
Create a `.env` file in the root directory (optional for read-only / discovery calls):

```dotenv
# Optional: Solana keypair for wallet-authenticated actions (Base58 or byte array)
SOLANA_PRIVATE_KEY=your_base58_private_key_here

# Optional: Custom Solana RPC endpoint
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## 💻 CLI Commands & Usage

### 1. `list` — Scan Open Bounties
Scan live bounties on Gibwork with formatted columns, payout values, asset types, and status.

```bash
# List all active bounties
node ./bin/gibwork-terminal.js list

# Filter bounties paying at least $25 USD
node ./bin/gibwork-terminal.js list --min 25

# Exclude bounties requiring mobile app / premium status
node ./bin/gibwork-terminal.js list --no-premium
```

**Sample Output:**
```
>>> GIBWORK TERMINAL — LIVE TASK RADAR [MAINNET]
Fetching open bounties via @gibwork/sdk...

────────────────────────────────────────────────────────────────────────────────────────────────────
ID                                     | MIN PAYOUT   | ASSET      | PREMIUM  | TITLE
────────────────────────────────────────────────────────────────────────────────────────────────────
fee5da23-be65-4b10-b635-ad74a0761688 | $    1.00 | USDC       | NO       | Share Your BASIS Story 50 Topics, Pic...
9adb1772-5fdc-4aba-9036-86124b03cd6e | $    1.00 | USDC       | YES      | OGs VS NEWBIES
5f073804-bb43-49c9-99c0-3fb498180465 | $   25.00 | USDC       | NO       | Create a UGC Video Bounty for the Gib...
1052f22d-3f87-4b1d-b0d7-71a60679e7fa | $   50.00 | USDC       | NO       | Gibwork Developer Hackathon Bounty
────────────────────────────────────────────────────────────────────────────────────────────────────
Displaying 6 of 6 tasks (Page 1/1, Total: 6)
```

---

### 2. `inspect <taskId>` — Specification & Scope Deep-Dive
Performs a deep audit of a specific bounty. Strips HTML markup, calculates deadline hours remaining, displays total prize pool and token mint, and formats submission criteria.

```bash
node ./bin/gibwork-terminal.js inspect 1052f22d-3f87-4b1d-b0d7-71a60679e7fa
```

**Sample Output:**
```
>>> GIBWORK TERMINAL — TASK DEEP-DIVE [MAINNET]
Auditing task ID: 1052f22d-3f87-4b1d-b0d7-71a60679e7fa...

════════════════════════════════════════════════════════════════════════════════
TITLE:         Gibwork Developer Hackathon Bounty
STATUS:        OPEN / ACTIVE
PAYOUT:        $50.00 USDC
POOL:          1000.00 USDC
DEADLINE:      2026-10-30T04:00:00.000Z | 277.8h remaining
PREMIUM ONLY:  NO (Open to all)
SUBMISSIONS:   2 submitted (Max: Unlimited)
MINT ADDRESS:  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
════════════════════════════════════════════════════════════════════════════════

[ SPECIFICATION & SCOPE ]
Join this Gibwork Developer Hackathon bounty to create a new non-web-app use case for Gibwork using the SDK, CLI, or MCP...
```

---

### 3. `watch` — Autonomous Bounty Sentinel
Runs a background daemon polling the Gibwork network. When a new bounty meeting your minimum payout threshold appears, it triggers an instant visual alert.

```bash
# Watch for any bounty >= $25 polling every 15 seconds
node ./bin/gibwork-terminal.js watch --min 25 --interval 15
```

---

### 4. `balance [address]` — Solana On-Chain Balance Audit
Queries on-chain SOL and USDC SPL balances for any Solana address or your configured signer keypair.

```bash
node ./bin/gibwork-terminal.js balance 3Uiis6Zv8fsxuvANCAvDPU5dGxrnjrGgg4HpN1Pz6HHn
```

---

### 5. `export` — Structured Data Pipeline Exporter
Dumps the live bounty database to structured JSON or CSV for developer pipelines, analytics, or automated filtering scripts.

```bash
# Export to JSON
node ./bin/gibwork-terminal.js export --format json --output bounties.json

# Export to CSV
node ./bin/gibwork-terminal.js export --format csv --output bounties.csv
```

---

## 🔒 Security & Privacy

- **Non-Custodial:** Private keys never leave the local environment and are never transmitted over the network.
- **Zero-Telemetry:** No third-party analytics, trackers, or telemetry payloads.
- **Standard Cryptography:** Uses `@solana/web3.js` and `bs58` for standard Ed25519 cryptographic key derivation and transaction signing.

---

## 📄 License
ISC License. Built for the Gibwork Developer Community.
