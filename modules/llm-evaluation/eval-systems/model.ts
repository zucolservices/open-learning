/** A RAG answer scored three ways, and an agent run graded by outcome and by path. Illustrative. */

export const QUESTION = "Can I return a jacket I bought in the sale?";

export interface Passage {
  text: string;
  relevant: boolean;
}

export interface Claim {
  text: string;
  supported: boolean;
}

export interface RagCase {
  id: string;
  name: string;
  passages: Passage[];
  claims: Claim[];
  onTopic: boolean;
  diagnosis: string;
}

const P_SALE: Passage = {
  text: "Sale items can be returned within 14 days for store credit only.",
  relevant: true,
};
const P_GENERAL: Passage = {
  text: "Full-price items can be refunded to the original card within 30 days.",
  relevant: true,
};
const P_SHIP: Passage = { text: "Standard delivery takes 3–5 working days.", relevant: false };
const P_CARE: Passage = { text: "Wash jackets on a cool cycle and dry flat.", relevant: false };

export const RAG_CASES: RagCase[] = [
  {
    id: "good",
    name: "Working well",
    passages: [P_SALE, P_GENERAL],
    claims: [
      { text: "Yes, sale items can be returned", supported: true },
      { text: "within 14 days", supported: true },
      { text: "for store credit, not a refund", supported: true },
    ],
    onTopic: true,
    diagnosis: "Right passages, every claim supported, on topic.",
  },
  {
    id: "missed",
    name: "Retriever missed it",
    passages: [P_GENERAL, P_SHIP, P_CARE],
    claims: [
      { text: "Yes, you can return it", supported: true },
      { text: "within 30 days", supported: true },
      { text: "for a refund to your card", supported: true },
    ],
    onTopic: true,
    diagnosis:
      "Faithful to what it was given, but the sale-items passage never arrived, so the answer is wrong. Fix the retriever.",
  },
  {
    id: "invented",
    name: "Generator made things up",
    passages: [P_SALE, P_GENERAL, P_SHIP],
    claims: [
      { text: "Yes, sale items can be returned", supported: true },
      { text: "within 14 days", supported: true },
      { text: "and we'll cover the return postage", supported: false },
    ],
    onTopic: true,
    diagnosis:
      "The right passages arrived, but the answer added a promise nothing supports. Fix the generation step.",
  },
  {
    id: "offtopic",
    name: "Answered a different question",
    passages: [P_SALE, P_GENERAL, P_SHIP],
    claims: [
      { text: "Delivery takes 3–5 working days", supported: true },
      { text: "so it should arrive soon", supported: true },
    ],
    onTopic: false,
    diagnosis: "Faithful and well retrieved, but it didn't answer the question.",
  },
];

export function triad(c: RagCase) {
  const ctx = c.passages.filter((p) => p.relevant).length / c.passages.length;
  const grounded = c.claims.filter((x) => x.supported).length / c.claims.length;
  return { ctx, grounded, relevance: c.onTopic ? 1 : 0.2 };
}

/* Agent runs ------------------------------------------------------------------------------------- */

export const EXPECTED = ["find_customer", "check_availability", "create_booking"];

export interface Run {
  id: string;
  name: string;
  calls: string[];
  booked: boolean;
  note: string;
}

export const RUNS: Run[] = [
  {
    id: "expected",
    name: "The expected path",
    calls: ["find_customer", "check_availability", "create_booking"],
    booked: true,
    note: "Matches everything.",
  },
  {
    id: "valid",
    name: "A different valid path",
    calls: ["check_availability", "find_customer", "create_booking"],
    booked: true,
    note: "Checked availability first: perfectly fine, but strict path checks fail it.",
  },
  {
    id: "extra",
    name: "An extra lookup",
    calls: ["find_customer", "get_history", "check_availability", "create_booking"],
    booked: true,
    note: "One harmless extra call breaks an exact match.",
  },
  {
    id: "skipped",
    name: "Skipped the availability check",
    calls: ["find_customer", "create_booking"],
    booked: true,
    note: "The booking landed, but the rule says always check first: only a path check catches this.",
  },
  {
    id: "fake",
    name: "Said “done”, booked nothing",
    calls: ["find_customer", "check_availability"],
    booked: false,
    note: "It told the customer it was booked. Only the outcome check catches it.",
  },
];

export type Grader = "outcome" | "exact" | "inOrder" | "anyOrder";

export const GRADERS: { id: Grader; name: string }[] = [
  { id: "outcome", name: "Outcome: booking exists" },
  { id: "exact", name: "Exact path" },
  { id: "inOrder", name: "Required calls, in order" },
  { id: "anyOrder", name: "Required calls, any order" },
];

export function grade(g: Grader, r: Run) {
  switch (g) {
    case "outcome":
      return r.booked;
    case "exact":
      return r.calls.join() === EXPECTED.join();
    case "inOrder": {
      let i = 0;
      for (const c of r.calls) if (c === EXPECTED[i]) i++;
      return i === EXPECTED.length;
    }
    case "anyOrder":
      return EXPECTED.every((c) => r.calls.includes(c));
  }
}
