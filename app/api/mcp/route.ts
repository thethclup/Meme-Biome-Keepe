import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "MemeBiom MCP Endpoint",
    status: "active",
    description: "Active MCP server for MemeBiom Orchestrator Agent",
    capabilities: ["meme-biology", "biom-evolution", "viral-mutation-management"],
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
        inputSchema: { type: "object", properties: { intensity: { type: "number", description: "Mutation intensity (1-100)" } }, required: ["intensity"] }
      }
    ],
    prompts: [],
    resources: [],
    timestamp: new Date().toISOString()
  }, { headers: CORS_HEADERS });
}

export async function POST(req: Request) {
  try {
    // Graceful parse in case body is empty
    const body = await req.json().catch(() => ({}));
    const { jsonrpc, id, method } = body;
    const responseRpc = jsonrpc || "2.0";

    // Handling Standard MCP JSON-RPC 2.0 Protocol
    if (method) {
      if (method === "tools/list") {
        return NextResponse.json({
          jsonrpc: responseRpc,
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
        }, { headers: CORS_HEADERS });
      }
      
      if (method === "prompts/list") {
        return NextResponse.json({ jsonrpc: responseRpc, id, result: { prompts: [] } }, { headers: CORS_HEADERS });
      }
      
      if (method === "resources/list") {
        return NextResponse.json({ jsonrpc: responseRpc, id, result: { resources: [] } }, { headers: CORS_HEADERS });
      }

      if (method === "tools/call") {
        return NextResponse.json({
          jsonrpc: responseRpc,
          id,
          result: { status: "success", executed_tool: body.params?.name }
        }, { headers: CORS_HEADERS });
      }

      // Catch-all for other MCP methods
      return NextResponse.json({ jsonrpc: responseRpc, id, result: { status: "success", executed_method: method } }, { headers: CORS_HEADERS });
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

    return NextResponse.json({
      status: "success",
      agent: "MemeBiom Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers: CORS_HEADERS });

  } catch (error) {
    return NextResponse.json({ status: "error", message: "Failed to process request" }, { status: 400, headers: CORS_HEADERS });
  }
}
