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
  "agent-loop": {
    term: "Agent loop",
    definition:
      "The cycle every agent repeats: the model chooses an action, the application carries it out, and the result goes back to the model, until it gives a final answer or a limit is reached.",
    module: "agent-loop",
  },
  observation: {
    term: "Observation",
    definition:
      "The result of an agent's action, such as a tool's output or an error, fed back to the model so it can decide the next step.",
    module: "agent-loop",
  },
  "react-pattern": {
    term: "ReAct",
    definition:
      "Reason + Act: a 2022 approach in which a model alternates written reasoning with actions such as searches, reading each result before continuing. The basis of most agent loops.",
    module: "agent-loop",
  },
  "stopping-condition": {
    term: "Stopping condition",
    definition:
      "A rule that ends an agent's loop: normally the model's final answer, plus safety limits such as a maximum number of turns, time or spend.",
    module: "agent-loop",
  },
  "prompt-chaining": {
    term: "Prompt chaining",
    definition:
      "A workflow that splits a task into fixed steps, each model call taking the previous one's output, often with checks in between.",
    module: "workflows-vs-agents",
  },
  "orchestrator-workers": {
    term: "Orchestrator-workers",
    definition:
      "A pattern in which a lead model breaks a task into subtasks at run time, hands them to worker models and combines the results.",
    module: "workflows-vs-agents",
  },
  "evaluator-optimizer": {
    term: "Evaluator-optimiser",
    definition:
      "A loop in which one model call produces work and another critiques it against criteria, repeating until the work passes.",
    module: "workflows-vs-agents",
  },
  aci: {
    term: "Agent-computer interface (ACI)",
    definition:
      "Everything an agent sees of its tools: names, descriptions, inputs, outputs and error messages. Like a user interface, but designed for a model.",
    module: "tool-design",
  },
  "tool-definition": {
    term: "Tool definition",
    definition:
      "The description of a tool sent to a model: a name, a plain-language description and a JSON Schema for its inputs.",
    module: "tool-design",
  },
} satisfies Record<string, GlossaryEntry>;
