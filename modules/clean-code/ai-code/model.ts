/**
 * Four made-up AI-generated suggestions for a café codebase, the issues in each, and the sensible
 * review decision. The existing helpers mentioned are part of the made-up codebase.
 */

export type Decision = "accept" | "changes" | "reject";
export type Issue = "bug" | "duplicate" | "convention" | "invented" | "tests";

export const ISSUES: { id: Issue; label: string }[] = [
  { id: "bug", label: "Wrong behaviour" },
  { id: "duplicate", label: "Duplicates an existing helper" },
  { id: "convention", label: "Doesn't fit our conventions" },
  { id: "invented", label: "Calls something that doesn't exist" },
  { id: "tests", label: "No tests for the tricky case" },
];

export const SUGGESTIONS: {
  id: string;
  ask: string;
  code: string[];
  issues: Issue[];
  decision: Decision;
  why: string;
}[] = [
  {
    id: "rupees",
    ask: "“Format a price for the menu”",
    code: ["function formatRupees(n) {", '  return "Rs. " + n.toFixed(2);', "}"],
    issues: ["duplicate", "convention"],
    decision: "reject",
    why: "The codebase already has formatMoney() in money.ts, which uses ₹ and Indian digit grouping (₹1,20,000). Use it.",
  },
  {
    id: "open",
    ask: "“Is the café open right now?”",
    code: [
      "function isOpenNow(now, open = 8, close = 1) {",
      "  const h = now.getHours();",
      "  return h >= open && h < close;",
      "}",
    ],
    issues: ["bug", "tests"],
    decision: "changes",
    why: "The café closes at 1 am, after midnight, so this is never true. Ask for the overnight case to be handled and tested.",
  },
  {
    id: "menu",
    ask: "“Load the menu faster”",
    code: ["async function loadMenu() {", "  return api.menus.getAllFast({ cache: true });", "}"],
    issues: ["invented"],
    decision: "reject",
    why: "Our API client has no getAllFast. Plausible-looking but invented calls are a known failure of code assistants; check before trusting.",
  },
  {
    id: "slug",
    ask: "“Make a URL slug from a dish name”",
    code: [
      "export function slugify(name: string): string {",
      '  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");',
      "}",
      "",
      'test("slugify", () => expect(slugify(" Masala Dosa! ")).toBe("masala-dosa"));',
    ],
    issues: [],
    decision: "accept",
    why: "Small, readable, follows our conventions, and comes with a test. Read it, understand it, accept it.",
  },
];
