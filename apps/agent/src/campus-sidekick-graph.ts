import { SystemMessage } from "@langchain/core/messages";
import { ChatGoogle } from "@langchain/google/node";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { END, MessagesAnnotation, START, StateGraph, MessagesValue, StateSchema } from "@langchain/langgraph";
import { campusTools } from "./campus-tools.js";
import { campusPlanSchema } from "@campus-sidekick/ui"

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

const modelWithTools = model.bindTools(campusTools);

export const CampusState = new StateSchema({
  messages: MessagesValue,
  ui: campusPlanSchema.nullable().default(null),
});

const structuredModel = model.withStructuredOutput(campusPlanSchema);

async function presentPlanNode(state: typeof CampusState.State) {
  // Pass the accumulated conversation context into the structured output generator
  const plan = await structuredModel.invoke([
    new SystemMessage(
      "Produce a valid CampusPlan using only the trusted venue and price facts above. " +
      "Calculate totalCostKsh and remainingKsh from the schedule. " +
      "Make followUp prompts useful for refining the plan.",
    ),
    ...state.messages,
  ]);
  return { ui: plan };
}

const systemPrompt = `You are Campus Sidekick, a friendly planning agent for students in Nairobi.
Help students combine study, food, and fun without exceeding their stated money or time limits.
Never invent a venue or price. When local information is needed, use the supplied tools.
Show costs in KSh and finish with a clear total.`;

async function callModel(state: typeof MessagesAnnotation.State) {
  // TODO 5: Bind campusTools to the model and invoke that tool-aware model here.
  const response = await modelWithTools.invoke([
    new SystemMessage(systemPrompt),
    ...state.messages,
  ]);
  return { messages: [response] };
}

/**
 * This first version is only START -> agent -> END. It can talk, but it cannot complete a tool
 * call. In the codelab, students add a ToolNode and conditional edges to create the agent loop.
 */
const toolNode = new ToolNode(campusTools);

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addNode("present", presentPlanNode)

  .addEdge(START, "agent")
  // TODO 6: Replace this fixed edge with conditional tool routing.
  .addConditionalEdges("agent", (state: typeof MessagesAnnotation.State) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.additional_kwargs?.tool_calls && lastMessage.additional_kwargs.tool_calls.length > 0) {
      return "tools";
    }
    return "present";
  })

  .addEdge("tools", "agent")
  .addEdge("present", END)
  .compile();
