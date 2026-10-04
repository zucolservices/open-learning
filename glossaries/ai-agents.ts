import type { GlossaryEntry } from "./types";

/** AI Agents track glossary. `module` slugs refer to this track. */
export const aiAgents = {
  "ai-agent": {
    term: "AI agent",
    definition:
      "A system in which a language model works towards a goal by choosing its own next steps and using tools, in a loop, until it decides the job is done.",
    module: "what-is-an-agent",
  },
  "agent-workflow": {
    term: "Workflow (agentic)",
    definition:
      "A system where a developer's code fixes the sequence of steps and a language model fills in some of them; the model doesn't choose what happens next.",
    module: "what-is-an-agent",
  },
  "agent-autonomy": {
    term: "Autonomy",
    definition:
      "How much of a program's next step a model controls, from none (a single call) through routing and tool calling to choosing every step in a loop.",
    module: "what-is-an-agent",
  },
} satisfies Record<string, GlossaryEntry>;
