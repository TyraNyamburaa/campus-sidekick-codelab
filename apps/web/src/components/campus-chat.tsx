"use client";
import { useStream } from "@langchain/langgraph-sdk/react";
import { planToSpec } from "@campus-sidekick/ui";
import { CampusPlanRenderer } from "./campus-plan-renderer";

/**
 * TODO 10 (Part 2): Replace this checkpoint with a useStream-powered conversation and render the
 * latest `values.ui` using CampusPlanRenderer. The README builds it in small, testable steps.
 */
export function CampusChat() {
  const thread = useStream({
    apiUrl: process.env.NEXT_PUBLIC_SKEIN_URL ?? "http://localhost:2024",
    assistantId: "campus-sidekick",
  });

  function handleAction(name: string, params: any) {
    if (name === "choosePlan" && typeof params?.prompt === "string") {
      thread.submit({
        messages: [{ type: "human", content: params.prompt }],
      });
    }
  }

  const spec = thread.values?.ui ? planToSpec(thread.values.ui) : null;

  return (
  <div className="flex flex-col h-screen p-4">
    {/* Transcript stream */}
    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
      {thread.messages.map((msg: any, i: number) => (
        <div key={i} className={`p-3 rounded-lg ${msg.type === 'human' ? 'bg-blue-100 self-end' : 'bg-gray-100'}`}>
          {msg.content}
        </div>
      ))}
      
      {/* Declarative A2UI Element */}
      {spec && (
        <CampusPlanRenderer spec={spec} onAction={handleAction} />
      )}
    </div>

    {/* Inputs Form */}
    <form onSubmit={(e) => {
      e.preventDefault();
      const target = e.currentTarget;
      const input = target.elements.namedItem("prompt") as HTMLInputElement;
      thread.submit({ messages: [{ type: "human", content: input.value }] });
      target.reset();
    }}>
      <input name="prompt" disabled={thread.isLoading} className="border p-2 w-full rounded" placeholder="Ask your sidekick..." />
    </form>
  </div>
);
}
