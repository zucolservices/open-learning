/**
 * Findings from three kinds of tool on a made-up pull request, with the sensible triage for each.
 * Security findings are described in words; no real attack strings.
 */

export type Action = "fix" | "suppress" | "later";

export const ACTIONS: { id: Action; label: string }[] = [
  { id: "fix", label: "Fix now" },
  { id: "suppress", label: "Suppress, with a reason" },
  { id: "later", label: "Not in this PR" },
];

export const FINDINGS: {
  id: string;
  tool: "Type checker" | "Linter" | "Security scanner";
  where: string;
  msg: string;
  answer: Action;
  why: string;
}[] = [
  {
    id: "qty",
    tool: "Type checker",
    where: "order.ts:14",
    msg: "Argument of type 'string' is not assignable to parameter of type 'number' (qty from the form)",
    answer: "fix",
    why: "A real bug: “2” + 1 is “21”. Parse the quantity at the edge.",
  },
  {
    id: "sql",
    tool: "Security scanner",
    where: "search.ts:31",
    msg: "Query built by joining text typed by the user into SQL",
    answer: "fix",
    why: "A classic injection risk. Use a parameterised query.",
  },
  {
    id: "undef",
    tool: "Type checker",
    where: "label.ts:8",
    msg: "'customer.address' is possibly 'undefined'",
    answer: "fix",
    why: "Collection orders have no address. Handle that case.",
  },
  {
    id: "unused",
    tool: "Linter",
    where: "order.ts:3",
    msg: "'oldTotal' is assigned a value but never used",
    answer: "fix",
    why: "Ten seconds to delete; leftovers confuse readers.",
  },
  {
    id: "secret",
    tool: "Security scanner",
    where: "fixtures/payments.ts:2",
    msg: "Possible hard-coded credential",
    answer: "suppress",
    why: "It's the obvious fake value used by the test fixtures. Suppress on that line and say why.",
  },
  {
    id: "md5",
    tool: "Security scanner",
    where: "cache.ts:12",
    msg: "Weak hash algorithm (MD5)",
    answer: "suppress",
    why: "Used only to name cache files, not for passwords or signatures. Suppress with that reason, or switch if it's cheap.",
  },
  {
    id: "complex",
    tool: "Linter",
    where: "legacy/report.ts:40",
    msg: "Function has a complexity of 23 (maximum allowed is 20)",
    answer: "later",
    why: "Old code this PR doesn't touch. Record it as debt instead of widening the PR.",
  },
];
