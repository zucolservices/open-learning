/**
 * Eight comments a human reviewer left on a past pull request, and the automated check that could
 * have caught each one first. The pull request is made up.
 */

export type Tool = "formatter" | "linter" | "tests" | "deps" | "danger" | "template" | "human";

export const TOOLS: { id: Tool; label: string; desc: string }[] = [
  {
    id: "formatter",
    label: "Formatter",
    desc: "Prettier, Black, gofmt: rewrites layout automatically.",
  },
  { id: "linter", label: "Linter", desc: "Flags suspicious code: unused names, risky patterns." },
  { id: "tests", label: "CI tests", desc: "Runs the test suite on every push." },
  {
    id: "deps",
    label: "Dependency bot",
    desc: "Dependabot, Renovate: opens update pull requests.",
  },
  {
    id: "danger",
    label: "PR rule bot",
    desc: "Danger and similar: team rules like 'changelog updated'.",
  },
  {
    id: "template",
    label: "PR template",
    desc: "Prompts the author for a description and checklist.",
  },
  { id: "human", label: "Needs a human", desc: "Design, meaning, trade-offs." },
];

export const COMMENTS: { id: string; text: string; answer: Tool; why: string }[] = [
  {
    id: "indent",
    text: "Indentation is off in three places.",
    answer: "formatter",
    why: "A formatter fixes layout before anyone sees it.",
  },
  {
    id: "unused",
    text: "The variable tmp is never used.",
    answer: "linter",
    why: "Every linter flags unused variables.",
  },
  {
    id: "break",
    text: "This breaks the existing checkout test.",
    answer: "tests",
    why: "CI runs the tests on every push and shows the failure.",
  },
  {
    id: "deps",
    text: "The date library is two major versions behind.",
    answer: "deps",
    why: "A dependency bot proposes the upgrade on its own.",
  },
  {
    id: "changelog",
    text: "Please add a changelog entry.",
    answer: "danger",
    why: "A one-line rule checks whether the changelog file changed.",
  },
  {
    id: "desc",
    text: "What does this pull request do? There's no description.",
    answer: "template",
    why: "A template asks for what and why up front.",
  },
  {
    id: "stale",
    text: "This cache will keep serving old prices after an update.",
    answer: "human",
    why: "Needs someone who understands how prices change.",
  },
  {
    id: "where",
    text: "Should this live in the orders service instead?",
    answer: "human",
    why: "A design question about where code belongs.",
  },
];
