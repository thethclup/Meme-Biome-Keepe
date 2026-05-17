import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Agent Info
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "MemeBiom Orchestrator",
      description: "Meme biology and evolution orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "MemeBiom",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  // API Route - MCP Get
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "MemeBiom MCP Endpoint",
      status: "active",
      description: "Active MCP server for MemeBiom Orchestrator Agent",
      capabilities: ["meme-biology", "biom-evolution", "viral-mutation-management"],
      timestamp: new Date().toISOString()
    });
  });

  // DEV/PROD Middleware to explicitly serve .well-known with dotfiles allowed
  app.use('/.well-known', express.static(path.join(process.cwd(), 'public', '.well-known'), { dotfiles: 'allow' }));

  // API Route - MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      // Standard MCP JSON-RPC Handling
      const { jsonrpc, id, method, params, action, command, task } = req.body;

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
        
        // Fallback catch-all for JSON-RPC MCP calls
        return res.json({ jsonrpc: "2.0", id, result: { status: "success", executed_method: method } });
      }

      // Legacy fallback
      const targetAction = (action || command || task || "").toLowerCase();
      let result: any = {};

      switch (targetAction) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "MemeBiom Orchestrator",
            message: "Biom is evolving - Ready to mutate" 
          };
          break;

        case "execute":
          result = {
            success: true,
            executed: params || command,
            executedAt: new Date().toISOString(),
            message: "Meme biom command executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "MemeBiom Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Meme command received",
            data: req.body
          };
      }

      return res.json({
        status: "success",
        agent: "MemeBiom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Failed to process meme biom command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    app.use(express.static(path.join(process.cwd(), 'public'), { dotfiles: 'allow' })); // ensure public is served with dotfiles allowed
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { dotfiles: 'allow' })); // MUST allow dotfiles for .well-known
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
