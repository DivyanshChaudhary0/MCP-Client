import express from "express";
import aiRouter from "./src/routes/ai.route.js";
import { initMcpClient } from "./src/mcp/client.js";

// Initialize MCP client
initMcpClient()
  .then(() => {
    console.log("MCP client initialized successfully");
  })
  .catch((error) => {
    console.error("Error initializing MCP client:", error);
  });

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/ai", aiRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
