import { SystemMessage } from "@langchain/core/messages";
import { ChatGoogle } from "@langchain/google/node";
import { END, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error(
    "GOOGLE_API_KEY is missing. Copy apps/agent/.env.example to apps/agent/.env and add your AI Studio key.",
  );
}

const model = new ChatGoogle({
  apiKey,
  model: process.env.GOOGLE_MODEL ?? "gemini-3.8-flash",
});

const systemPrompt = `You are Campus Sidekick, a friendly planning agent for students in Nairobi.
Help students combine study, food, and fun without exceeding their stated money or time limits.
Never invent a venue or price. When local information is needed, use the supplied tools.
Show costs in KSh and finish with a clear total.`;

async function callModel(state: typeof MessagesAnnotation.State) {
  // TODO 5: Bind campusTools to the model and invoke that tool-aware model here.
  const response = await model.invoke([new SystemMessage(systemPrompt), ...state.messages]);
  return { messages: [response] };
}

/**
 * This first version is only START -> agent -> END. It can talk, but it cannot complete a tool
 * call. In the codelab, students add a ToolNode and conditional edges to create the agent loop.
 */
export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge(START, "agent")
  // TODO 6: Replace this fixed edge with conditional tool routing.
  .addEdge("agent", END)
  .compile();
