/**
 * An order pipeline built from routing and transformation patterns. Two orders arrive (one from the
 * website as JSON, one from a partner as CSV), each with items for different warehouses. Illustrative.
 */

export type Stage = "normalize" | "split" | "route" | "enrich" | "aggregate";

export const STAGES: Record<Stage, { name: string; does: string }> = {
  normalize: {
    name: "Normalizer",
    does: "Translates each source's format into one common format.",
  },
  split: { name: "Splitter", does: "Breaks an order into one message per item." },
  route: {
    name: "Content-based router",
    does: "Sends each item to the right warehouse by its category.",
  },
  enrich: {
    name: "Content enricher",
    does: "Adds the customer's delivery slot, looked up from CRM.",
  },
  aggregate: {
    name: "Aggregator",
    does: "Waits for every warehouse to confirm, then sends one 'order ready'.",
  },
};

export const ORDER: Stage[] = ["normalize", "split", "route", "enrich", "aggregate"];

export function simulate(on: Stage[]): { out: string[]; issues: string[] } {
  const has = (s: Stage) => on.includes(s);
  const out: string[] = [];
  const issues: string[] = [];
  if (!has("normalize"))
    issues.push("The partner's CSV order can't be read by anything downstream; it's stuck.");
  const orders = has("normalize")
    ? ["web order #A (book, phone)", "partner order #B (rice, book)"]
    : ["web order #A (book, phone)"];
  if (!has("split")) {
    out.push(...orders.map((o) => `${o} → one message`));
    if (has("route"))
      issues.push(
        "Whole orders can't be routed: an order holding a book and a phone has no single warehouse.",
      );
  } else {
    const items = has("normalize")
      ? ["A·book", "A·phone", "B·rice", "B·book"]
      : ["A·book", "A·phone"];
    const wh: Record<string, string> = {
      book: "Books warehouse",
      phone: "Electronics warehouse",
      rice: "Grocery dark store",
    };
    for (const it of items) {
      const kind = it.split("·")[1];
      out.push(has("route") ? `${it} → ${wh[kind]}` : `${it} → (no destination)`);
    }
    if (!has("route")) issues.push("Items have nowhere to go without a router.");
  }
  if (!has("enrich"))
    issues.push("Warehouses don't know the customer's delivery slot, so they can't plan dispatch.");
  if (has("split") && has("route") && !has("aggregate"))
    issues.push("Each customer gets a separate 'confirmed' message per warehouse.");
  if (has("aggregate") && has("split") && has("route"))
    out.push(
      ...(has("normalize")
        ? [
            "A: all items confirmed → one 'order ready'",
            "B: all items confirmed → one 'order ready'",
          ]
        : ["A: all items confirmed → one 'order ready'"]),
    );
  return { out, issues };
}

/** Translators needed for n applications: direct n(n−1), with a canonical model 2n. */
export const direct = (n: number) => n * (n - 1);
export const canonical = (n: number) => 2 * n;
