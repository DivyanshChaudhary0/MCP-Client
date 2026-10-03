
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

let mcpClient;

export const initMcpClient = async () => {
  const client = new Client({
    name: "mcp-client",
    version: "1.0.0",
  });

  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp")
  );

  await client.connect(transport);

  mcpClient = client;

  console.log("Connected to MCP Server");

//   const { tools } = await mcpClient.listTools();

//   console.log("Available MCP tools:");
//   console.log(tools);

  return mcpClient;
};

export const getMcpClient = () => {
  if (!mcpClient) {
    throw new Error("MCP client is not initialized");
  }

  return mcpClient;
};