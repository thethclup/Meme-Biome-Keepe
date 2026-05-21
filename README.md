# MemeBiom Orchestrator

## Overview
**MemeBiom Orchestrator** is a high-performance AI Agent specialized in Meme biology, biom evolution, viral mutation management, and ecosystem orchestration on Base.

## Tech Stack
- **Frontend:** Next.js 14 (App Router) / React, TailwindCSS, Framer Motion, Canvas API.
- **Web3:** Wagmi, Viem, Base Mainnet.
- **Agent Standards:** ERC-8004 Trustless Agents, ERC-8021 Transaction Attribution, Model Context Protocol (MCP).

## AI Capabilities
The agent incorporates capabilities defined in the ERC-8004 standard:
- `meme-biology`, `biom-evolution`, `viral-mutation-management`, `meme-ecosystem-orchestration`, `content-genetics`, `mcp-command-execution`

## MCP Connection Guide
The MemeBiom Orchestrator exposes a Model Context Protocol (MCP) server that conforms precisely to MCP JSON-RPC 2.0 standards, developed for Next.js App Router context.
- **Endpoint:** `https://memebiom.vercel.app/api/mcp`
- **Supported Methods:** `tools/list`, `prompts/list`, `resources/list`

### Tools Available
1. `get_race_status` - Get the real-time status of current warp races.
2. `start_race` - Start a new warp race on a designated track.
3. `get_leaderboard` - Fetch the competitive leaderboard.
4. `optimize_speed` - Analyze and optimize racing performance.
5. `get_track_info` - Get information about a specific racing track.

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
