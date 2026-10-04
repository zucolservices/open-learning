/** One task, four ways for an agent to act. All numbers are illustrative. */

export type Hand = "tool" | "code" | "browser" | "desktop";

export const HANDS: {
  id: Hand;
  label: string;
  steps: string[];
  time: number;
  reliable: number;
  reach: string;
  risk: string;
}[] = [
  {
    id: "tool",
    label: "A dedicated tool",
    steps: ['invoices_search(month="September", sort="amount", limit=3)', "add the three amounts"],
    time: 4,
    reliable: 98,
    reach: "Only works where someone built the tool.",
    risk: "Low: it can only do what the tool allows.",
  },
  {
    id: "code",
    label: "A code sandbox",
    steps: [
      "download invoices.csv",
      "write 6 lines of Python: filter, sort, sum",
      "run it; check the output",
    ],
    time: 12,
    reliable: 93,
    reach: "Any data it can get as a file or through an API.",
    risk: "Medium: code can do anything the sandbox allows.",
  },
  {
    id: "browser",
    label: "A browser",
    steps: [
      "open the accounts site",
      "log in",
      "filter by September",
      "sort by amount",
      "read the top three rows",
      "add them up",
    ],
    time: 70,
    reliable: 80,
    reach: "Any website, even without an API.",
    risk: "Higher: pages can contain hidden instructions.",
  },
  {
    id: "desktop",
    label: "A whole desktop",
    steps: [
      "screenshot",
      "click the accounts app icon",
      "screenshot",
      "click 'Invoices'",
      "screenshot",
      "type 'September'",
      "screenshot",
      "click the Amount header",
      "screenshot",
      "read three numbers",
    ],
    time: 150,
    reliable: 66,
    reach: "Anything a person can do on screen, even old desktop software.",
    risk: "Highest: it can click anything it can see.",
  },
];
