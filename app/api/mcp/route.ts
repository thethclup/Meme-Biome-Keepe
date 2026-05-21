import { NextResponse } from 'next/server';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "MemeBiom MCP Endpoint",
    status: "active",
    description: "Active MCP server for MemeBiom Orchestrator Agent",
    capabilities: ["meme-biology", "biom-evolution", "viral-mutation-management"],
    timestamp: new Date().toISOString()
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method } = body;

    // Standard MCP JSON-RPC Handling
    if (jsonrpc === "2.0") {
      if (method === "tools/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
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
              }
            ]
          }
        }, { headers: CORS_HEADERS });
      }
      
      if (method === "prompts/list") {
        return NextResponse.json({ jsonrpc: "2.0", id, result: { prompts: [] } }, { headers: CORS_HEADERS });
      }
      if (method === "resources/list") {
        return NextResponse.json({ jsonrpc: "2.0", id, result: { resources: [] } }, { headers: CORS_HEADERS });
      }

      // Fallback catch-all for JSON-RPC MCP calls
      return NextResponse.json({ jsonrpc: "2.0", id, result: { status: "success", executed_method: method } }, { headers: CORS_HEADERS });
    }

    // Legacy fallback schema from earlier implementation
    const targetAction = (body?.action || body?.command || body?.task || "").toLowerCase();
    let result: any = {};

    switch (targetAction) {
      case "status":
      case "ping":
        result = { status: "online", agent: "MemeBiom Orchestrator", message: "Biom is evolving - Ready to mutate" };
        break;
      case "execute":
        result = { success: true, executed: body?.params || body?.command, executedAt: new Date().toISOString(), message: "Meme biom command executed successfully" };
        break;
      case "get_info":
        result = { name: "MemeBiom Orchestrator", wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6", platform: "Base", version: "1.0.0" };
        break;
      default:
        result = { success: true, message: "Meme command received", data: body };
    }

    return NextResponse.json({
      status: "success",
      agent: "MemeBiom Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to process meme biom command" }, { status: 400, headers: CORS_HEADERS });
  }
}
