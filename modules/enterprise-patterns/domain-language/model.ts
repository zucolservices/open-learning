/** What "customer" means to five departments of a fictional insurer, and where they clash. */

export type Dept = "sales" | "billing" | "support" | "claims" | "marketing";

export const DEPTS: Record<Dept, { name: string; means: string; fields: string[]; rule: string }> =
  {
    sales: {
      name: "Sales",
      means: "Anyone we're talking to, even if they haven't bought yet.",
      fields: ["leadSource", "quoteStage"],
      rule: "A customer can exist without a policy.",
    },
    billing: {
      name: "Billing",
      means: "Whoever pays the premium, maybe an employer, not the insured person.",
      fields: ["payerAccount", "mandateId"],
      rule: "A customer must have a payment method.",
    },
    support: {
      name: "Support",
      means: "The person on the phone, who might be a spouse or an agent.",
      fields: ["callerName", "openTickets"],
      rule: "A customer is whoever raised the ticket.",
    },
    claims: {
      name: "Claims",
      means: "The insured person or the claimant, often not the payer.",
      fields: ["claimantId", "nominee"],
      rule: "A customer must hold an active policy.",
    },
    marketing: {
      name: "Marketing",
      means: "A segment: 'urban families, 30–40', not a person at all.",
      fields: ["segment", "consentFlags"],
      rule: "Customers are counted, not identified.",
    },
  };

/** Pairs of departments whose rules contradict each other. */
export const CLASHES: [Dept, Dept, string][] = [
  ["sales", "claims", "Can a customer exist without a policy?"],
  ["sales", "billing", "Does a customer need a payment method?"],
  ["billing", "claims", "Is the customer the payer or the insured?"],
  ["support", "claims", "Is a spouse calling in a customer?"],
  ["marketing", "support", "Is a customer a person or a group?"],
];

export function clashes(picked: Dept[]) {
  return CLASHES.filter(([a, b]) => picked.includes(a) && picked.includes(b));
}
