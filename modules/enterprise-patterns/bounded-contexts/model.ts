/** Splitting the insurer's one Customer model into bounded contexts (illustrative). */

export type Ctx = "sales" | "billing" | "claims" | "support";

export const CONTEXTS: Record<Ctx, { name: string; calls: string }> = {
  sales: { name: "Sales", calls: "Prospect" },
  billing: { name: "Billing", calls: "Payer" },
  claims: { name: "Claims", calls: "Claimant" },
  support: { name: "Support", calls: "Caller" },
};

export const PIECES: { id: string; label: string; home: Ctx; why: string }[] = [
  {
    id: "lead",
    label: "lead source",
    home: "sales",
    why: "Only sales cares where a prospect came from.",
  },
  { id: "quote", label: "quote stage", home: "sales", why: "A sales pipeline concept." },
  { id: "mandate", label: "payment mandate", home: "billing", why: "How the payer pays." },
  { id: "dues", label: "overdue premium", home: "billing", why: "Billing's own rule." },
  { id: "claim", label: "open claims", home: "claims", why: "Belongs with the claimant." },
  {
    id: "nominee",
    label: "nominee",
    home: "claims",
    why: "Who receives a payout: a claims concern.",
  },
  {
    id: "ticket",
    label: "support tickets",
    home: "support",
    why: "Exists only in the support context.",
  },
  {
    id: "caller",
    label: "authorised callers",
    home: "support",
    why: "Who may speak for the customer.",
  },
];
