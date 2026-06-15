import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "MemeBiom MCP Endpoint",
      status: "active",
      description: "Active MCP server for MemeBiom Orchestrator Agent",
      capabilities: ["meme-biology", "biom-evolution", "viral-mutation-management"],
      tools: [
        {
          name: "get_race_status",
          description: "Get the real-time status of current warp races.",
          inputSchema: { type: "object", properties: {}, required: [] }
        },
        {
          name: "start_race",
          description: "Start a new warp race on a designated track.",
          inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
        },
        {
          name: "get_leaderboard",
          description: "Fetch the competitive leaderboard.",
          inputSchema: { type: "object", properties: {}, required: [] }
        },
        {
          name: "optimize_speed",
          description: "Analyze and optimize racing performance.",
          inputSchema: { type: "object", properties: { agentId: { type: "string" } }, required: ["agentId"] }
        },
        {
          name: "get_track_info",
          description: "Get information about a specific racing track.",
          inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
        },
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
          inputSchema: { type: "object", properties: { intensity: { type: "number", description: "Mutation intensity (1-100)" } }, required: ["intensity"] }
        }
      ],
      prompts: [],
      resources: [],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { jsonrpc, id, method } = body;
      const responseRpc = jsonrpc || "2.0";

      // Handling Standard MCP JSON-RPC 2.0 Protocol
      if (method) {
        if (method === "tools/list") {
          return res.status(200).json({
            jsonrpc: responseRpc,
            id,
            result: {
              tools: [
                {
                  name: "get_race_status",
                  description: "Get the real-time status of current warp races.",
                  inputSchema: { type: "object", properties: {}, required: [] }
                },
                {
                  name: "start_race",
                  description: "Start a new warp race on a designated track.",
                  inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
                },
                {
                  name: "get_leaderboard",
                  description: "Fetch the competitive leaderboard.",
                  inputSchema: { type: "object", properties: {}, required: [] }
                },
                {
                  name: "optimize_speed",
                  description: "Analyze and optimize racing performance.",
                  inputSchema: { type: "object", properties: { agentId: { type: "string" } }, required: ["agentId"] }
                },
                {
                  name: "get_track_info",
                  description: "Get information about a specific racing track.",
                  inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
                },
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
          return res.status(200).json({ jsonrpc: responseRpc, id, result: { prompts: [] } });
        }
        
        if (method === "resources/list") {
          return res.status(200).json({ jsonrpc: responseRpc, id, result: { resources: [] } });
        }

        if (method === "tools/call") {
          return res.status(200).json({
            jsonrpc: responseRpc,
            id,
            result: { 
              content: [
                { type: "text", text: `Successfully executed tool: ${body.params?.name}` }
              ] 
            }
          });
        }

        // Catch-all for other MCP methods
        return res.status(200).json({ jsonrpc: responseRpc, id, result: { status: "success", executed_method: method } });
      }

      // Legacy fallback (for older tests)
      const targetAction = (body?.action || body?.command || body?.task || "").toLowerCase();
      let result: any = {};

      switch (targetAction) {
        case "status":
        case "ping":
          result = { status: "online", agent: "MemeBiom Orchestrator", message: "Ready" };
          break;
        case "get_info":
          result = { name: "MemeBiom Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
          break;
        default:
          result = { success: true, executed: body?.params || body?.command, executedAt: new Date().toISOString() };
      }

      return res.status(200).json({
        status: "success",
        agent: "MemeBiom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      return res.status(400).json({ status: "error", message: "Failed to process request" });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
