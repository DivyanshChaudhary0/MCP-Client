import ai from "../services/ai.js";
import { getMcpClient } from "../mcp/client.js";

export const postChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Get the already connected MCP client
    const mcpClient = getMcpClient();

    // Get tools from MCP Server
    const { tools } = await mcpClient.listTools();

    // Convert MCP tools to Gemini function declarations
    const geminiTools = tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    }));

    // Send user's message + MCP tools to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        tools: [
          {
            functionDeclarations: geminiTools,
          },
        ],
      },
    });

    // Check if Gemini wants to call an MCP tool
    const functionCalls = response.functionCalls;

    if (functionCalls?.length) {
      const functionCall = functionCalls[0];

      console.log("Gemini wants:", functionCall.name);
      console.log("Arguments:", functionCall.args);

      const toolResult = await mcpClient.callTool({
        name: functionCall.name,
        arguments: functionCall.args,
      });

      console.log("MCP Tool Response:", toolResult);

      return res.json({
        type: "text",
        response: toolResult,
      });
    }

    // Gemini answered normally
    return res.json({
      type: "text",
      response: response.text,
    });
  } catch (error) {
    console.error("Error in postChat:", error);

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
