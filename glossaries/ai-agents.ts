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
  mcp: {
    term: "Model Context Protocol (MCP)",
    definition:
      "An open standard, launched by Anthropic in 2024 and now under the Linux Foundation, for connecting AI apps to tools and data: a provider writes one MCP server and any compatible app can use it.",
    module: "mcp",
  },
  "mcp-host": {
    term: "MCP host",
    definition:
      "The AI application a person uses, such as a chat app or coding assistant, which runs MCP clients to reach servers.",
    module: "mcp",
  },
  "mcp-client": {
    term: "MCP client",
    definition:
      "The part of a host that holds one connection to one MCP server and sends it requests.",
    module: "mcp",
  },
  "mcp-server": {
    term: "MCP server",
    definition:
      "A program that offers tools, resources and prompts for one service, such as a calendar or code repository, to any MCP client.",
    module: "mcp",
  },
  "computer-use": {
    term: "Computer use",
    definition:
      "Letting a model operate a computer like a person: it looks at screenshots and asks for mouse clicks and key presses, which software carries out.",
    module: "computer-use",
  },
  "code-execution": {
    term: "Code execution tool",
    definition:
      "A tool that lets a model write code and run it in an isolated environment, then read the output, for calculations, data analysis or calling other tools.",
    module: "computer-use",
  },
  sandbox: {
    term: "Sandbox",
    definition:
      "An isolated environment, such as a container or small virtual machine, where agent actions or code run without access to real files, accounts or networks unless allowed.",
    module: "computer-use",
  },
  "task-decomposition": {
    term: "Task decomposition",
    definition:
      "Breaking a large goal into smaller steps or sub-tasks that an agent, or several agents, can carry out one at a time.",
    module: "planning",
  },
  "plan-and-execute": {
    term: "Plan-and-execute",
    definition:
      "An agent design where a planner writes the list of steps first and an executor carries them out, re-planning if something unexpected happens.",
    module: "planning",
  },
  "agent-reflection": {
    term: "Reflection",
    definition:
      "An agent checking its own work, through tests, tools or a critic, and revising it before continuing. Works best when the check rests on outside evidence.",
    module: "reflection",
  },
  "exponential-backoff": {
    term: "Exponential backoff",
    definition:
      "Retrying a failed request after waits that double each time (1 s, 2 s, 4 s…), usually with random jitter, so a struggling service can recover.",
    module: "errors-recovery",
  },
  "idempotency-key": {
    term: "Idempotency key",
    definition:
      "A unique id sent with an action, such as a payment, so that if the request is retried the service performs it only once.",
    module: "errors-recovery",
  },
  "agent-memory": {
    term: "Agent memory",
    definition:
      "Information an agent saves outside the model, such as facts, past events and learned rules, and loads back into its context when relevant.",
    module: "agent-memory",
  },
  "working-memory": {
    term: "Working memory",
    definition:
      "What an agent has in its context window right now: the current conversation, tool results and any memories loaded for this step.",
    module: "agent-memory",
  },
  "episodic-memory": {
    term: "Episodic memory",
    definition:
      "Long-term memory of past events, such as what happened in an earlier task or conversation.",
    module: "agent-memory",
  },
  "semantic-memory": {
    term: "Semantic memory",
    definition:
      "Long-term memory of facts, such as a user's preferences or details about their organisation.",
    module: "agent-memory",
  },
  compaction: {
    term: "Compaction",
    definition:
      "Summarising an agent's conversation so far and continuing in a fresh context window with the summary, so a long task can keep going.",
    module: "context-management",
  },
  "context-rot": {
    term: "Context rot",
    definition:
      "The tendency of models to become less reliable as their input grows longer, even within the context window's limit.",
    module: "context-management",
  },
  "sub-agent": {
    term: "Sub-agent",
    definition:
      "A helper agent given a self-contained job with its own fresh context window, which reports back a short result to the agent that called it.",
    module: "context-management",
  },
  "agent-checkpoint": {
    term: "Checkpoint (agent state)",
    definition:
      "A saved snapshot of an agent run's state after a step, so it can resume after a crash or a pause instead of starting again.",
    module: "durable-agents",
  },
  "agent-thread": {
    term: "Thread",
    definition:
      "An id that groups one agent run's saved checkpoints, so a later call can resume exactly that conversation or task.",
    module: "durable-agents",
  },
  "durable-execution": {
    term: "Durable execution",
    definition:
      "Running a program so that each finished step is recorded; after a failure it resumes by reusing saved results rather than redoing completed work.",
    module: "durable-agents",
  },
  "multi-agent-system": {
    term: "Multi-agent system",
    definition:
      "Several agents working on one job, usually with a lead agent splitting the work and combining results, sometimes with specialists or reviewers.",
    module: "multi-agent",
  },
  "agent-handoff": {
    term: "Handoff",
    definition:
      "Passing a conversation from one agent to another, which then takes over, like being transferred to a different desk.",
    module: "multi-agent",
  },
  a2a: {
    term: "Agent2Agent protocol (A2A)",
    definition:
      "An open protocol, started by Google in 2025 and now under the Linux Foundation, that lets agents built by different organisations discover each other, delegate tasks and return results.",
    module: "agent-protocols",
  },
  "agent-card": {
    term: "Agent Card",
    definition:
      "A JSON file an A2A agent publishes at a well-known web address, describing its skills, where to send requests and how to authenticate.",
    module: "agent-protocols",
  },
  "agent-framework": {
    term: "Agent framework",
    definition:
      "A code library you run yourself that provides building blocks for agents, such as the loop, tool calling, memory, multi-agent handoffs and tracing.",
    module: "agent-frameworks",
  },
  "agent-platform": {
    term: "Agent platform",
    definition:
      "A managed cloud service that hosts agents for you, handling running, scaling, identity and security as well as agent building blocks.",
    module: "agent-frameworks",
  },
  "agent-guardrail": {
    term: "Guardrail",
    definition:
      "An automatic check that runs before, after or around a model or tool call, such as screening input, blocking sensitive output or limiting an action, and can stop the run.",
    module: "guardrails",
  },
  "excessive-agency": {
    term: "Excessive agency",
    definition:
      "OWASP's name for the risk of giving an AI system too many tools, too many permissions or too much freedom to act without checks.",
    module: "guardrails",
  },
  "indirect-prompt-injection": {
    term: "Indirect prompt injection",
    definition:
      "Instructions hidden in content an agent reads, such as a web page, email or ticket, which can hijack it because models can't reliably tell instructions from data.",
    module: "agent-security",
  },
  exfiltration: {
    term: "Exfiltration",
    definition:
      "Getting stolen data out of a system, for example by making an agent load a link or image whose web address contains the data.",
    module: "agent-security",
  },
  "approval-fatigue": {
    term: "Approval fatigue",
    definition:
      "When people are asked to approve so many actions that they stop reading and approve automatically, defeating the point of the check.",
    module: "human-in-the-loop",
  },
  "agent-trajectory": {
    term: "Trajectory",
    definition:
      "The sequence of steps an agent took on a task: its tool calls, their inputs and results, and its messages.",
    module: "agent-evals",
  },
  "pass-hat-k": {
    term: "pass^k",
    definition:
      "The chance that all k separate attempts at the same task succeed, a measure of reliability; compare pass@k, the chance that at least one succeeds.",
    module: "agent-evals",
  },
  "agent-span": {
    term: "Span",
    definition:
      "One step recorded inside a trace, such as a single model call or tool call, with its start time, duration and details like tokens used.",
    module: "agent-ops",
  },
  "batch-api": {
    term: "Batch API",
    definition:
      "A way to send many model requests to be processed within hours rather than seconds, usually at about half the price; suited to offline work.",
    module: "agent-ops",
  },
  "agent-handover": {
    term: "Handover to a person",
    definition:
      "Passing a conversation or task from an agent to a human, with a summary of what has happened so far, when the agent is stuck or the stakes are high.",
    module: "capstone-agent",
  },
} satisfies Record<string, GlossaryEntry>;
