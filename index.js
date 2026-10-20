
const tools = require("./tools");

// Simulate the LLM's first response
function mockLLM(messages) {
  const lastMessage = messages[messages.length - 1];

  // First turn: choose a tool based on the user request
  if (lastMessage.role === "user") {
    const request = lastMessage.content.toLowerCase();

    if (request.includes("pending") || request.includes("incomplete")) {
      return {
        type: "tool_call",
        toolName: "getTasks",
        arguments: false
      };
    }

    if (request.includes("summary") || request.includes("status")) {
      return {
        type: "tool_call",
        toolName: "getTaskSummary",
        arguments: undefined
      };
    }

    return {
      type: "message",
      content: "Try asking for pending tasks or a task summary."
    };
  }

  // Second turn: simulate the LLM interpreting the tool result
  if (lastMessage.role === "tool") {
    const result = lastMessage.content;

    if (Array.isArray(result)) {
      if (result.length === 0) {
        return {
          type: "message",
          content: "You have no pending tasks."
        };
      }

      const taskNames = result.map(task => task.title).join(", ");

      return {
        type: "message",
        content: `You have ${result.length} pending tasks: ${taskNames}.`
      };
    }

    return {
      type: "message",
      content: `Here is your task summary: ${JSON.stringify(result)}`
    };
  }
}

function runAgent(userMessage) {
  const messages = [
    { role: "user", content: userMessage }
  ];

  // Limit iterations to prevent an endless loop
  for (let step = 0; step < 3; step++) {
    const response = mockLLM(messages);

    if (response.type === "message") {
      return response.content;
    }

    const tool = tools[response.toolName];

    if (typeof tool !== "function") {
      return `Unknown tool: ${response.toolName}`;
    }

    const result = tool(response.arguments);

    // Send the tool result back into the conversation
    messages.push({
      role: "tool",
      content: result
    });
  }

  return "Agent stopped: maximum steps reached.";
}

console.log(runAgent("Show me my pending tasks"));
