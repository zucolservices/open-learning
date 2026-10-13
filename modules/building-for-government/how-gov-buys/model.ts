/** A made-up labour department buys a case-management system: five decisions and their consequences. */

export interface Decision {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DECISIONS: Decision[] = [
  {
    id: "route",
    title: "1 · Where to buy a custom-built system worth about ₹8 crore",
    options: [
      {
        id: "gem",
        label: "Pick the cheapest case-management product in the GeM catalogue",
        ok: false,
        outcome:
          "Nothing off the shelf fits the department's rules. GeM suits standard goods and services; a custom build needs a tender.",
      },
      {
        id: "cppp",
        label: "Publish a tender on the Central Public Procurement Portal",
        ok: true,
        outcome: "Right. Custom IT work is tendered and published openly so anyone can bid.",
      },
    ],
  },
  {
    id: "spec",
    title: "2 · How to write the requirements",
    options: [
      {
        id: "brand",
        label: "Name the product and version the officer already likes",
        ok: false,
        outcome:
          "That rules out every other bidder. Brand-specific requirements are a classic way tenders get challenged.",
      },
      {
        id: "copy",
        label: "Copy another department's tender word for word",
        ok: false,
        outcome:
          "Their rules, users and integrations differ. The vendor will build what's written, not what you need.",
      },
      {
        id: "outcomes",
        label: "Describe users, outcomes and must-have functions, with room for how",
        ok: true,
        outcome: "Right. Bidders compete on how well they meet the need.",
      },
    ],
  },
  {
    id: "eligibility",
    title: "3 · Who may bid",
    options: [
      {
        id: "fair",
        label: "Criteria in proportion to the job, with the startup relaxations the rules allow",
        ok: true,
        outcome:
          "Right. The rules let departments relax turnover and experience for recognised startups, and exempt small businesses from bid security.",
      },
      {
        id: "huge",
        label: "Only firms with ₹500 crore turnover and 10 years' experience",
        ok: false,
        outcome:
          "Far out of proportion to an ₹8 crore job. It shuts out small businesses and startups for no good reason.",
      },
    ],
  },
  {
    id: "evaluation",
    title: "4 · How to choose the winner",
    options: [
      {
        id: "l1",
        label: "Lowest price among technically qualified bids (L1)",
        ok: false,
        outcome:
          "Allowed, and the default. But for a system where quality matters, the cheapest qualified bid often costs more later.",
      },
      {
        id: "qcbs30",
        label: "Quality and cost based selection, with 30% weight on quality",
        ok: true,
        outcome:
          "Right. Since 2021, QCBS is allowed for such services up to ₹10 crore, with quality weighted at no more than 30%.",
      },
      {
        id: "qcbs80",
        label: "Quality and cost based selection, with 80% weight on quality",
        ok: false,
        outcome:
          "Up to 80% is possible for consultancy, but this is a build service: the cap is 30%.",
      },
    ],
  },
  {
    id: "payment",
    title: "5 · How to pay",
    options: [
      {
        id: "milestones",
        label: "Payments tied to accepted milestones, with performance security",
        ok: true,
        outcome:
          "Right. Pay for working, accepted software; performance security (3–5%) protects the department.",
      },
      {
        id: "upfront",
        label: "60% on signing, to get the vendor started",
        ok: false,
        outcome:
          "Advances to private firms are normally capped at 30%, and paying before delivery removes your leverage.",
      },
    ],
  },
];
