/** A made-up policy document used for the chunking simulation. Every rule is invented. */
export const POLICY_TITLE = "Kalpanagar Water Supply Rules, 2026";

export const SECTIONS: [string, string][] = [
  [
    "1. Scope",
    "These rules apply to every piped water connection supplied by the Kalpanagar Municipal Corporation. They replace the Water Supply Rules of 2019. Words such as 'consumer' mean the person in whose name the connection is registered.",
  ],
  [
    "2. New connections",
    "A new domestic connection is granted to the owner of a property, or to a tenant with the owner's written consent. The application must include the latest property tax receipt and an identity proof. The connection fee is ₹500, and a refundable deposit of ₹3,000 is collected. The Corporation completes new connections within 15 working days of a complete application.",
  ],
  [
    "3. Free water for low-income households",
    "Households holding a valid below-poverty-line (BPL) card receive a lifeline allowance. The limit is 20 kilolitres per month, free of charge. Water used above the limit is billed at the normal domestic rate. The card must be renewed with the ward office every two years to keep the allowance.",
  ],
  [
    "4. Meters and billing",
    "Every connection has a meter, which remains the property of the Corporation. Meters are read every two months, and bills are sent by SMS and post within 10 days of the reading. If a meter is found faulty, the bill is based on the average of the previous three readings until the meter is replaced.",
  ],
  [
    "5. Paying your bill",
    "Bills must be paid within 21 days of the bill date, online on the NMC citizen portal or at any ward office. A late fee of 2% of the unpaid amount is added for every month of delay. Consumers who pay by auto-debit receive a rebate of 1% on each bill.",
  ],
  [
    "6. Disconnection",
    "If a bill remains unpaid for 90 days, the Corporation may disconnect the supply after giving 15 days' written notice. Supply to hospitals, schools and homes with a registered dialysis patient is never disconnected for non-payment; arrears are recovered through the courts instead.",
  ],
  [
    "7. Reconnection",
    "A disconnected supply is restored within 2 working days after all arrears are paid. The reconnection fee is ₹1,000. However, the fee is waived for senior citizens who clear their arrears within 30 days of disconnection.",
  ],
  [
    "8. Complaints",
    "Complaints about leaks, low pressure or dirty water can be made on the citizen portal, by phone, or at a ward office. Leaks on a main road are attended to within 24 hours. Other complaints are resolved within 5 working days, and the consumer is informed by SMS when the work is complete.",
  ],
];

/** The superseded 2019 rules, still in the document store: similar wording, different numbers. */
export const OLD_TITLE = "Kalpanagar Water Supply Rules, 2019 (superseded)";

export const OLD_SECTIONS: [string, string][] = [
  [
    "3. Free water for low-income households",
    "Households holding a below-poverty-line (BPL) card receive a lifeline allowance. The limit is 15 kilolitres per month, free of charge.",
  ],
  [
    "6. Disconnection",
    "If a bill remains unpaid for 60 days, the Corporation may disconnect the supply after giving 7 days' written notice.",
  ],
  [
    "7. Reconnection",
    "A disconnected supply is restored within 5 working days after all arrears are paid. The reconnection fee is ₹750.",
  ],
  [
    "8. Complaints",
    "Leaks on a main road are attended to within 48 hours. Other complaints are resolved within 10 working days.",
  ],
];

export const QUESTIONS: { q: string; must: string[]; right: string; wrong?: string }[] = [
  {
    q: "Under the current water rules, do senior citizens have to pay the reconnection fee?",
    must: ["reconnection fee is ₹1,000", "waived for senior citizens"],
    right: "waiv|do not have to|don't have to|not have to pay|exempt|no fee",
    wrong: "have to pay the reconnection fee of|must pay",
  },
  {
    q: "Under the current water rules, how much free water do BPL households get?",
    must: ["below-poverty-line", "20 kilolitres"],
    right: "20 kilolitres",
  },
  {
    q: "Under the current water rules, can the supply to a hospital be cut for unpaid bills?",
    must: ["hospitals", "never disconnected"],
    right: "^no|never|cannot|can't|not be cut|not be disconnected",
    wrong: "^yes",
  },
  {
    q: "Under the current water rules, how soon is a leak on a main road repaired?",
    must: ["main road", "24 hours"],
    right: "24 hours",
  },
];
