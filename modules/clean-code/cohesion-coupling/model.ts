/**
 * Eight responsibilities in a made-up café codebase, a starting layout grouped by technical
 * kind ("utils", "service", "helpers"), the files a learner can move them to, three change
 * requests, and the calls between responsibilities. Files touched and cross-file calls are counted.
 */

export const FILES = [
  "utils.js",
  "service.js",
  "helpers.js",
  "pricing.js",
  "receipts.js",
  "orders.js",
  "loyalty.js",
];

export const ITEMS: { id: string; label: string; start: string }[] = [
  { id: "price", label: "Add up item prices", start: "service.js" },
  { id: "gst", label: "Apply GST", start: "utils.js" },
  { id: "student", label: "Student discount", start: "helpers.js" },
  { id: "format", label: "Format the receipt", start: "utils.js" },
  { id: "send", label: "Send the receipt", start: "service.js" },
  { id: "save", label: "Save the order", start: "service.js" },
  { id: "history", label: "Load order history", start: "helpers.js" },
  { id: "points", label: "Work out loyalty points", start: "utils.js" },
];

export const CHANGES: { label: string; touches: string[] }[] = [
  {
    label: "GST changes and the student discount becomes 15%",
    touches: ["gst", "student", "price"],
  },
  { label: "Receipts are sent by text message instead of email", touches: ["format", "send"] },
  { label: "Orders move to a new database", touches: ["save", "history"] },
  { label: "Double loyalty points on Sundays", touches: ["points"] },
];

/** Who calls whom. */
export const CALLS: [string, string][] = [
  ["price", "gst"],
  ["price", "student"],
  ["format", "price"],
  ["save", "price"],
  ["points", "price"],
  ["send", "format"],
];

export function filesTouched(layout: Record<string, string>, touches: string[]): number {
  return new Set(touches.map((t) => layout[t])).size;
}

export function crossCalls(layout: Record<string, string>): number {
  return CALLS.filter(([a, b]) => layout[a] !== layout[b]).length;
}

export const START: Record<string, string> = Object.fromEntries(ITEMS.map((i) => [i.id, i.start]));
