# MemeBiom Orchestrator

## Overview
**MemeBiom Orchestrator** is a high-performance AI Agent specialized in Meme biology, biom evolution, viral mutation management, and ecosystem orchestration on Base.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) / React, TailwindCSS, Framer Motion, Canvas API.
- **Web3:** Wagmi, Viem, Base Mainnet.
- **Agent Standards:** ERC-8004 Trustless Agents, ERC-8021 Transaction Attribution, Model Context Protocol (MCP).

## AI Capabilities & Skills
The agent incorporates capabilities defined in the ERC-8004 standard:
- **Meme Biology:** Orchestrates creature evolutions and meme life cycles.
- **Ecosystem Orchestration:** Balances Hype, Chaos, and Memetic energy across biomes.
- **Viral Mutation Management:** Analyzes and executes rapid meme mutations and viral strategies.

## MCP Connection Guide
The MemeBiom Orchestrator exposes a Model Context Protocol (MCP) server that conforms precisely to MCP JSON-RPC 2.0 standards.
- **Endpoint:** `https://memebiom.vercel.app/api/mcp`
- **Supported Methods:** `tools/list`, `prompts/list`, `resources/list`

### Tools Available
1. `evolve_meme` - Evolves a specific meme in the biome.
2. `get_biome_status` - Returns the current state of the meme biome.
3. `mutate_biome` - Triggers a random viral mutation across the biome.

## Agent Registration Info
The agent exposes a standard `agent-card.json` for A2A communication.
- **Agent Card:** `https://memebiom.vercel.app/.well-known/agent-card.json`
- **Type:** `https://eips.ethereum.org/EIPS/eip-8004#registration-v1`
- **Supported Chains:** EIP155:8453 (Base)

## How to Run Locally
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
