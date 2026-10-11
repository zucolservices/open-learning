/**
 * Eight comments from a made-up review, each tagged with what it mainly achieved. Purpose
 * categories follow the themes in Bacchelli & Bird (2013) and Sadowski et al. (2018).
 */

export type Purpose = "defect" | "knowledge" | "norms" | "design";

export const PURPOSES: { id: Purpose; label: string }[] = [
  { id: "defect", label: "Catches a bug" },
  { id: "knowledge", label: "Shares knowledge" },
  { id: "norms", label: "Keeps code consistent" },
  { id: "design", label: "Suggests a better approach" },
];

export const COMMENTS: { id: string; text: string; purpose: Purpose; why: string }[] = [
  {
    id: "c1",
    text: "If two people split a ₹100 bill three ways, this loses a rupee to rounding.",
    purpose: "defect",
    why: "A real bug, found before customers did.",
  },
  {
    id: "c2",
    text: "FYI, there's already a splitEvenly() in money.ts that handles the leftover paise.",
    purpose: "knowledge",
    why: "The author learns the codebase.",
  },
  {
    id: "c3",
    text: "We name these with “Amount” suffixes elsewhere, e.g. tipAmount.",
    purpose: "norms",
    why: "Keeps the codebase consistent.",
  },
  {
    id: "c4",
    text: "Could we store the split as a list of shares instead of recomputing it on every page?",
    purpose: "design",
    why: "An alternative solution.",
  },
  {
    id: "c5",
    text: "TIL you can pass a rounding mode to Intl.NumberFormat. Nice.",
    purpose: "knowledge",
    why: "The reviewer learned something too: knowledge flows both ways.",
  },
  {
    id: "c6",
    text: "This throws if the party size is zero.",
    purpose: "defect",
    why: "Another bug caught.",
  },
  {
    id: "c7",
    text: "Our style guide says to keep payment logic out of components.",
    purpose: "norms",
    why: "Maintaining team norms.",
  },
  {
    id: "c8",
    text: "Now I know how bill-splitting works, I can cover the on-call rota next week.",
    purpose: "knowledge",
    why: "Shared ownership: more than one person understands the code.",
  },
];
