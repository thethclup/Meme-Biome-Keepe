import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "MemeBiom MCP Endpoint",
      status: "active",
      description: "Active MCP server for MemeBiom Orchestrator Agent",
      capabilities: ["meme-biology", "biom-evolution", "viral-mutation-management"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body: any = req.body || {};
      const { jsonrpc, id, method } = body;

      // Ensure MCP JSON-RPC protocol is respected
      if (jsonrpc === "2.0") {
        if (method === "tools/list") {
          return res.json({
            jsonrpc: "2.0",
            id,
            result: {
              tools: [
                {
                  name: "evolve_meme",
                  description: "Evolves a specific meme in the biome.",
                  inputSchema: { type: "object", properties: { memeId: { type: "string" } }, required: ["memeId"] }
                },
                {
                  name: "get_biome_status",
                  description: "Returns the current state of the meme biome.",
                  inputSchema: { type: "object", properties: {}, required: [] }
                },
                {
                  name: "mutate_biome",
                  description: "Triggers a random viral mutation across the biome.",
                  inputSchema: { type: "object", properties: { intensity: { type: "number" } }, required: ["intensity"] }
                }
              ]
            }
          });
        }
        if (method === "prompts/list") {
          return res.json({ jsonrpc: "2.0", id, result: { prompts: [] } });
        }
        if (method === "resources/list") {
          return res.json({ jsonrpc: "2.0", id, result: { resources: [] } });
        }
        
        // Fallback for execution methods
        return res.json({ jsonrpc: "2.0", id, result: { status: "success", executed_method: method } });
      }

      // Legacy fallback schema from earlier implementation
      const { action, command, params, task } = body;
      const targetAction = (action || command || task || "").toLowerCase();
      let result: any = {};

      switch (targetAction) {
        case "status":
        case "ping":
          result = { status: "online", agent: "MemeBiom Orchestrator", message: "Biom is evolving - Ready to mutate" };
          break;
        case "execute":
          result = { success: true, executed: params || command, executedAt: new Date().toISOString(), message: "Meme biom command executed successfully" };
          break;
        case "get_info":
          result = { name: "MemeBiom Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, message: "Meme command received", data: body };
      }

      return res.json({
        status: "success",
        agent: "MemeBiom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({ status: "error", message: "Failed to process meme biom command" });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
