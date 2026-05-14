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
      name: "Meme Biom Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Meme Biom",
      version: "1.0.0"
    });
  });

  // API Route - MCP Get
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Meme Biom MCP Endpoint",
      status: "active",
      description: "Active MCP server for Meme Biom Orchestrator Agent",
      capabilities: ["meme-biology", "biomeme-evolution", "viral-mutation-management"],
      timestamp: new Date().toISOString()
    });
  });

  // API Route - MCP POST
  app.post("/api/mcp", (req, res) => {
    try {
      const { action, command, params } = req.body;
      let result: any = {};
      const targetAction = action || command;

      switch (targetAction) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Meme Biom Orchestrator",
            message: "Biom is alive - Ready to evolve memes!" 
          };
          break;

        case "execute":
          result = {
            success: true,
            action: command || params,
            executedAt: new Date().toISOString(),
            message: "Meme evolution command executed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Meme Biom Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        default:
          result = {
            success: true,
            message: "Command received",
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Meme Biom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
