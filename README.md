# Campus Sidekick Codelab

Build an AI agent that helps a student plan an affordable afternoon in Nairobi.

This is a two-part codelab:

1. **Part 1 — Build the brain:** LangGraph, tools, state, routing, and Skein-JS.
2. **Part 2 — Build the experience:** Next.js, structured output, json-render, and A2UI ideas.

In Part 1, your finished agent should be able to respond to a request like this:

> I have KSh 800 and Saturday afternoon free. I want two quiet study hours, something fun with
> friends, and food before 7 pm. Plan my day.

The interesting constraint is not generating a confident answer. It is generating a plan that uses
trusted places and prices, fits the time available, and stays within KSh 800.

## What you will learn

By the end of Part 1, you should be able to explain:

- What an agent is and how it differs from a single model call.
- Why LangGraph represents agent behavior as state, nodes, and edges.
- How a model decides when to call a typed JavaScript tool.
- Why a tool description and Zod schema matter.
- How the `agent → tools → agent` loop works.
- What Skein-JS provides around a normal LangGraph graph.

Estimated time: **2–3 hours**.

## Before class

You need:

- Node.js 24 or newer.
- npm 11 or newer.
- A Google AI Studio API key from <https://aistudio.google.com/apikey>.
- A code editor and a modern browser.

An AI Studio key is enough. You do not need Vertex AI, a service account, or Google Cloud
credentials.

## Meet the monorepo

This project uses npm workspaces and Turborepo.

```text
campus-sidekick-codelab/
├── apps/
│   ├── agent/               # LangGraph served by Skein-JS
│   │   ├── src/
│   │   └── langgraph.json
│   └── web/                 # Next.js frontend for Part 2
├── package.json             # Commands for the whole workspace
└── turbo.json               # Runs both apps together
```

You do not need to `cd` into each app. Run commands from the repository root.

## 0. Start the starter kit

Install every workspace dependency:

```bash
npm install
```

Create your local environment file:

```bash
cp apps/agent/.env.example apps/agent/.env
```

Open `apps/agent/.env` and uncomment these values:

```dotenv
GOOGLE_API_KEY=replace-with-your-ai-studio-key
GOOGLE_MODEL=gemini-3.8-flash
```

Never commit your real key. `.env` is ignored by Git.

Start both applications with one command:

```bash
npm run dev
```

Turborepo keeps both development processes alive and preserves their hot reload:

- Next.js placeholder: <http://localhost:3000>
- Skein Console: <http://localhost:2024/console>

### Checkpoint 0

In Skein Console, select the `echo` graph, create a thread, and send:

```text
hello sidekick
```

You should receive `echo: hello sidekick`. If that works, the server, graph loader, and console are
connected correctly.

## 1. Read your first graph

Open `apps/agent/src/echo-graph.ts`.

Do not change it yet. Find these three ideas in the code:

1. **State:** `MessagesAnnotation` stores the conversation. Its reducer appends new messages.
2. **Node:** `echo` is a function that reads state and returns a state update.
3. **Edges:** `START → echo → END` defines the order of execution.

```text
 START ──────▶ echo ──────▶ END
                 │
                 └── returns one AI message
```

### Stop and predict

Before testing, discuss these questions with a partner:

1. Why does the node return `{ messages: [newMessage] }` rather than the entire conversation?
2. What would happen if the edge from `echo` to `END` were removed?
3. Is this graph already an agent? What decision can it make?

<details>
<summary>Compare your reasoning</summary>

- Nodes return updates because LangGraph applies them to state using each field's reducer.
- Without a route onward, the graph is incomplete and compilation should reject it.
- The echo graph is a workflow, but it is not very agentic: it follows one fixed path and makes no
  choice about what to do next.

</details>

## 2. Give the agent trusted knowledge

Open `apps/agent/src/campus-data.ts`.

This local dataset contains study spots, activities, and food options. We use fixtures so everyone
gets the same result and so the model cannot silently invent a venue or price.

Now open `apps/agent/src/campus-tools.ts`. The file contains four incomplete filtering tasks.

Run the exercise tests:

```bash
npm run test:exercise --workspace @campus-sidekick/agent
```

The failures are expected. Read each failure before writing code.

### TODO 1: Filter by budget and area

Complete `withinBudgetAndArea`.

Requirements:

- Exclude an option when `costKsh` is greater than `maxCostKsh`.
- When no area is supplied, allow every area.
- Compare supplied areas without case sensitivity.
- Do not mutate the input array.

Try your implementation, rerun the exercise tests, and only then open the hint.

<details>
<summary>Hint for TODO 1</summary>

`Array.prototype.filter` returns a new array. Normalize both area strings using `trim()` and
`toLowerCase()`.

</details>

<details>
<summary>Reference answer for TODO 1</summary>

```ts
const requestedArea = area?.trim().toLowerCase();

return options.filter((option) => {
  const isAffordable = option.costKsh <= maxCostKsh;
  const isInArea = !requestedArea || option.area.toLowerCase() === requestedArea;
  return isAffordable && isInArea;
});
```

</details>

### TODOs 2–4: Complete the domain filters

Each tool already has three things an LLM needs:

- A unique `name`.
- A plain-language `description` explaining when to use it.
- A Zod `schema` describing valid arguments.

Complete the function inside each tool:

- `findStudySpots`: apply the common filter and match `noiseLevel`.
- `findActivities`: apply the common filter, match `timeOfDay`, and require at least one shared
  interest.
- `findFoodOptions`: apply the common filter and, when supplied, match `dietaryPreference`.

Use `JSON.stringify(matches)` for each return value. Tool results become messages that the model can
read on the next graph step.

### Stop and predict

1. Why should the tool filter data instead of asking Gemini to remember the KSh limit?
2. What does the schema prevent? What does it not prevent?
3. How would a vague description change the model's tool choice?

<details>
<summary>Implementation hints for TODOs 2–4</summary>

```ts
const matches = withinBudgetAndArea(studySpots, maxCostKsh, area).filter(
  (spot) => spot.noiseLevel === noiseLevel,
);
```

Use `.includes(timeOfDay)` for activity time. Normalize interests and dietary preferences to lower
case before comparing them.

</details>

### Checkpoint 1

Run:

```bash
npm run test:exercise --workspace @campus-sidekick/agent
npm run typecheck
```

The exercise tests and TypeScript checks should pass before you continue.

## 3. Meet the model node

Open `apps/agent/src/campus-sidekick-graph.ts`.

The file already creates Gemini and defines the personality and rules for Campus Sidekick. Its graph
currently has one model node and one fixed route:

```text
 START ──────▶ agent ──────▶ END
```

Register it in `apps/agent/langgraph.json`:

```json
{
  "node_version": "24",
  "graphs": {
    "echo": "./src/echo-graph.ts:graph",
    "campus-sidekick": "./src/campus-sidekick-graph.ts:graph"
  },
  "env": ".env"
}
```

Save the file. Skein should reload automatically. Refresh Skein Console and select
`campus-sidekick`.

Send the motivating request from the beginning of the codelab.

### Observe before fixing

The model may invent places, ignore fixture data, or confidently claim it cannot access local data.
That is useful evidence: the prompt mentions tools, but no tools have been attached to the model.

## 4. Let Gemini request tools

Complete TODO 5 in `campus-sidekick-graph.ts`.

Import the tools:

```ts
import { campusTools } from "./campus-tools.js";
```

Bind them once, next to the model definition:

```ts
const modelWithTools = model.bindTools(campusTools);
```

Then invoke `modelWithTools` inside `callModel` instead of `model`.

Save and send the prompt again.

### Stop and inspect

Look at the final AI message in Skein Console. Gemini can now request a tool, but the graph stops
immediately afterward.

Discuss:

1. Did calling `bindTools` execute any JavaScript function?
2. What information did Gemini produce in its tool call?
3. Why can the graph not yet return a useful final answer?

Binding tools gives the model their names, descriptions, and schemas. It lets the model *request* a
tool call. A graph node still has to execute the requested function.

## 5. Build the agent loop

Complete TODO 6.

Add this import:

```ts
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
```

Create a tool node below `modelWithTools`:

```ts
const toolNode = new ToolNode(campusTools);
```

Replace the current graph with:

```ts
export const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", toolsCondition)
  .addEdge("tools", "agent")
  .compile();
```

Remove the unused `END` import.

The graph can now loop:

```text
                         requests a tool
                    ┌─────────────────────┐
                    ▼                     │
 START ──────▶ agent ──────▶ tools ───────┘
                 │
                 └────────────────────────▶ END
                       gives a final answer
```

`toolsCondition` examines the last AI message. A tool call routes to `tools`; a normal response
routes to `END`. After execution, the tool result is appended to state and routed back to Gemini.

### Checkpoint 2

Send:

```text
I have KSh 800 and Saturday afternoon free. I want two quiet study hours,
something fun with friends, and food before 7 pm. Plan my day.
```

In the Skein trace, identify:

- The first model message containing tool calls.
- Each tool and its structured arguments.
- Tool-result messages containing fixture data.
- The second model call that turns results into an answer.
- The final total in KSh.

The final response can vary, but every named place and price must exist in `campus-data.ts`, and its
total must not exceed KSh 800.

## 6. Prove that it is an agent

Try these prompts in the same thread:

```text
Actually, I only have KSh 450. Keep the quiet study time but change the rest.
```

```text
Skip food. Give me one social activity in Karen in the afternoon for at most KSh 250.
```

```text
Explain what you can help me with. Do not plan anything yet.
```

Compare the paths in Skein Console. A useful agent does not call every tool every time. It chooses
actions based on the request and current conversation state.

## 7. Your challenge: add one capability

Choose one:

- `estimate_transport`: compare a student's transport allowance with local fixture estimates.
- `find_campus_events`: return events by date, interest, and maximum entry price.
- `check_plan_budget`: calculate a proposed plan total and report the remaining balance.

Your tool must include:

1. Typed fixture data.
2. A Zod input schema.
3. A description written for a model that cannot see your implementation.
4. Deterministic filtering or calculation code.
5. At least two tests.
6. Registration in `campusTools`.

Show a partner one prompt that should call your tool and one that should not. Ask them to predict
the route before running either prompt.

## 8. Final checks

Stop the development server with `Ctrl+C`, then run:

```bash
npm test
npm run typecheck
npm run build
```

Your Part 1 implementation is complete when:

- The echo graph still works without a model key.
- The Campus Sidekick appears in Skein Console when a key is configured.
- The motivating prompt causes relevant tool calls.
- The final plan uses only fixture facts and stays within budget.
- Changing the request can change the graph path.
- Tests, type checking, and builds pass.

## What Skein-JS added

The graph itself imports LangGraph and LangChain—not Skein. Skein reads `langgraph.json` and gives the
graph a local Agent Protocol server, threads, streaming, state inspection, and the visual console.
The same graph can later be consumed by the standard LangGraph frontend SDK.

## Next lesson: build the experience

The Next.js app is intentionally only a landing page today. In Part 2, you will keep this exact
backend and:

1. Connect React to Skein with `useStream`.
2. Replace free-form presentation data with a validated structured response.
3. Define a small json-render catalog of trusted components.
4. Render plan cards, a timeline, and a budget meter inside the conversation.
5. Send UI actions such as “choose this plan” back to the agent.
6. Connect the design to A2UI's core idea: agents send declarative UI data; applications decide what
   code is trusted and rendered.

## Troubleshooting

### The `campus-sidekick` graph does not appear

- Confirm it was added to `apps/agent/langgraph.json`.
- Confirm `apps/agent/.env` contains `GOOGLE_API_KEY` without a leading `#`.
- Read the agent terminal output; Skein reports graph-loading errors there.

### Port 3000 or 2024 is already in use

Stop the older development process before running `npm run dev` again.

### Gemini returns a tool call but no final answer

Confirm the graph has a `ToolNode`, uses `toolsCondition`, and routes `tools` back to `agent`.

### The tool returns options outside the budget

Run the exercise tests and inspect whether you used `<=` rather than `<` or `>=`.

## References

- [Skein-JS: your first agent](https://skein-js.github.io/skein-js/your-first-agent)
- [LangGraph JavaScript overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [LangChain tools](https://docs.langchain.com/oss/javascript/langchain/tools)
- [LangChain Google integration](https://docs.langchain.com/oss/javascript/integrations/chat/google)
- [json-render documentation](https://json-render.dev/docs)
- [A2UI](https://a2ui.org/)
