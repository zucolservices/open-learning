/** How each tool names the same Scrum ideas (cloud editions, checked against vendor docs, Sept 2026). */

export type Slot =
  "item" | "backlog" | "sprint" | "board" | "breakdown" | "grouping" | "estimate" | "chart";

export const SLOTS: [Slot, string][] = [
  ["item", "A piece of work"],
  ["backlog", "Product Backlog"],
  ["sprint", "Sprint"],
  ["board", "Board"],
  ["breakdown", "Breakdown of an item"],
  ["grouping", "Bigger grouping"],
  ["estimate", "Estimate"],
  ["chart", "Progress chart"],
];

export interface Tool {
  id: string;
  name: string;
  names: Record<Slot, string>;
  /** Shorter labels for the board picture, where space is tight. */
  short?: Partial<Record<Slot, string>>;
  note: string;
}

export const TOOLS: Tool[] = [
  {
    id: "jira",
    name: "Jira",
    names: {
      item: "Work item (Story, Task, Bug)",
      backlog: "Backlog",
      sprint: "Sprint",
      board: "Scrum board",
      breakdown: "Subtask",
      grouping: "Epic (parent)",
      estimate: "Story point estimate",
      chart: "Burndown Chart",
    },
    short: { item: "Work item" },
    note: "Atlassian renamed “issues” to “work items” from 2025, and “projects” to “spaces” from late 2025. Older docs and JQL still use the old words.",
  },
  {
    id: "azure",
    name: "Azure Boards",
    names: {
      item: "Product Backlog Item",
      backlog: "Backlogs",
      sprint: "Iteration (Sprints)",
      board: "Taskboard",
      breakdown: "Task",
      grouping: "Epic → Feature",
      estimate: "Effort",
      chart: "Sprint burndown",
    },
    short: { grouping: "Epic / Feature" },
    note: "Names depend on the process template. Shown: the Scrum process. The Agile process says User Story and Story Points; CMMI says Requirement and Size; Basic says Issue.",
  },
  {
    id: "github",
    name: "GitHub",
    names: {
      item: "Issue (or draft issue)",
      backlog: "A table view you filter",
      sprint: "Iteration field",
      board: "Board layout",
      breakdown: "Sub-issue",
      grouping: "Parent issue / Milestone",
      estimate: "A number field you add",
      chart: "Insights: Burn up",
    },
    short: {
      item: "Issue",
      backlog: "Table view",
      estimate: "Number field",
      grouping: "Parent issue",
    },
    note: "GitHub Projects has no built-in backlog or sprint: you add an Iteration field and build views. Sub-issues and issue types became generally available in April 2025.",
  },
  {
    id: "gitlab",
    name: "GitLab",
    names: {
      item: "Issue (a work item)",
      backlog: "An issue board you set up",
      sprint: "Iteration (with cadence)",
      board: "Issue board",
      breakdown: "Task",
      grouping: "Epic",
      estimate: "Weight",
      chart: "Burndown / burnup",
    },
    short: { backlog: "Issue board", sprint: "Iteration" },
    note: "Iterations, weights, epics and burndown charts need a paid tier (Premium or Ultimate). The Free tier has issue boards and milestones.",
  },
  {
    id: "linear",
    name: "Linear",
    names: {
      item: "Issue",
      backlog: "Backlog status (+ Triage)",
      sprint: "Cycle",
      board: "Board view",
      breakdown: "Sub-issue",
      grouping: "Project → Initiative",
      estimate: "Estimate (points or T-shirt)",
      chart: "Cycle graph",
    },
    short: { backlog: "Backlog status", grouping: "Project", estimate: "Estimate" },
    note: "Linear has no “epic”: Projects and Initiatives fill that role. Estimates can use exponential, Fibonacci, linear or T-shirt scales.",
  },
  {
    id: "open",
    name: "Open source",
    names: {
      item: "User story (Taiga) · Work package (OpenProject)",
      backlog: "Backlog",
      sprint: "Sprint (Taiga, OpenProject) · Cycle (Plane)",
      board: "Taskboard",
      breakdown: "Task · Child work package",
      grouping: "Epic",
      estimate: "Points",
      chart: "Sprint burndown",
    },
    short: { item: "User story", sprint: "Sprint / Cycle", breakdown: "Task" },
    note: "Taiga (MPL-2.0 / AGPL-3.0), OpenProject (GPL-3.0) and Plane (AGPL-3.0) can be self-hosted. Redmine needs a plugin for Scrum; WeKan is Kanban only.",
  },
];
