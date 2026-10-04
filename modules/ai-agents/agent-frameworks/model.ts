/** Who handles which job, by how you build. Examples as of October 2026. */

export type Option = "raw" | "sdk" | "graph" | "platform";

export const OPTIONS: { id: Option; label: string; examples: string; lockIn: number }[] = [
  {
    id: "raw",
    label: "The model API directly",
    examples: "Responses API, Messages API, Gemini API",
    lockIn: 1,
  },
  {
    id: "sdk",
    label: "An agent SDK",
    examples:
      "OpenAI Agents SDK, Claude Agent SDK, Google ADK, Strands Agents, Pydantic AI, smolagents",
    lockIn: 2,
  },
  {
    id: "graph",
    label: "A graph or workflow framework",
    examples: "LangGraph, Microsoft Agent Framework, LlamaIndex Workflows, CrewAI Flows",
    lockIn: 3,
  },
  {
    id: "platform",
    label: "A managed platform",
    examples:
      "Amazon Bedrock AgentCore, Google's Agent Runtime, Microsoft Foundry Agent Service, Claude Managed Agents",
    lockIn: 4,
  },
];

export const JOBS: { id: string; label: string; by: Record<Option, boolean> }[] = [
  {
    id: "loop",
    label: "The agent loop",
    by: { raw: false, sdk: true, graph: true, platform: true },
  },
  {
    id: "tools",
    label: "Running tools and MCP",
    by: { raw: false, sdk: true, graph: true, platform: true },
  },
  {
    id: "handoffs",
    label: "Multiple agents and handoffs",
    by: { raw: false, sdk: true, graph: true, platform: true },
  },
  {
    id: "state",
    label: "Checkpoints and resuming",
    by: { raw: false, sdk: false, graph: true, platform: true },
  },
  {
    id: "guardrails",
    label: "Guardrails",
    by: { raw: false, sdk: true, graph: false, platform: true },
  },
  { id: "tracing", label: "Tracing", by: { raw: false, sdk: true, graph: true, platform: true } },
  {
    id: "hosting",
    label: "Hosting, scaling, identity",
    by: { raw: false, sdk: false, graph: false, platform: true },
  },
];
