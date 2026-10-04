/**
 * Capstone: modernise a fictional state's 20-year-old welfare benefits system without stopping
 * payments. Seven decisions; each option has an outcome two years later. Illustrative.
 */

export type Level = "holds" | "strains" | "fails";

export interface Option {
  id: string;
  label: string;
  level: Level;
  later: string;
}

export const DECISIONS: { id: string; area: string; module: number; options: Option[] }[] = [
  {
    id: "teams",
    area: "Teams",
    module: 2,
    options: [
      {
        id: "central",
        label: "One central IT team does everything",
        level: "fails",
        later: "Every scheme's change queues behind every other. The backlog is 14 months long.",
      },
      {
        id: "layers",
        label: "Teams by layer: portal, backend, database",
        level: "strains",
        later: "Each new benefit rule needs all three teams; releases slip together.",
      },
      {
        id: "streams",
        label: "Teams by stream: applications, eligibility, payments, plus a platform team",
        level: "holds",
        later: "Most changes stay inside one team. The platform team runs the paved road.",
      },
    ],
  },
  {
    id: "boundaries",
    area: "Boundaries",
    module: 4,
    options: [
      {
        id: "copy",
        label: "Copy the legacy data model into the new system",
        level: "fails",
        later:
          "The new code is full of BEN-STAT codes nobody understands. The old system's confusion lives on.",
      },
      {
        id: "storm",
        label: "Run event storming with caseworkers, then draw bounded contexts",
        level: "holds",
        later: "Applications, Eligibility, Payments and Appeals each have a clear model and owner.",
      },
    ],
  },
  {
    id: "migration",
    area: "Migration",
    module: 17,
    options: [
      {
        id: "bigbang",
        label: "Rewrite everything; switch over in year three",
        level: "fails",
        later:
          "Year two: nothing live, budget half spent, and the old system still changing under you.",
      },
      {
        id: "strangler",
        label: "Strangler fig: a façade, then move statements first, then applications",
        level: "holds",
        later:
          "Citizens have used the new statements and applications for 18 months. Legacy handles less each quarter.",
      },
      {
        id: "package",
        label: "Wait for one off-the-shelf product to replace it all",
        level: "strains",
        later:
          "Procurement takes 14 months; then the product doesn't fit three state-specific schemes.",
      },
    ],
  },
  {
    id: "legacy",
    area: "Legacy connection",
    module: 18,
    options: [
      {
        id: "direct",
        label: "New services read the mainframe's tables directly",
        level: "fails",
        later: "A legacy schema change breaks the citizen portal on the first of the month.",
      },
      {
        id: "api",
        label: "An API wrapper, called for every request",
        level: "strains",
        later: "Works, but the portal is down whenever the mainframe runs its overnight batch.",
      },
      {
        id: "acl",
        label: "An anticorruption layer plus a CDC copy for reads",
        level: "holds",
        later:
          "The portal stays up during batch windows, and no legacy codes leak into new models.",
      },
    ],
  },
  {
    id: "integration",
    area: "Integration between contexts",
    module: 11,
    options: [
      {
        id: "shareddb",
        label: "One new shared database for all contexts",
        level: "fails",
        later: "Eligibility can't change a table without asking three teams.",
      },
      {
        id: "esb",
        label: "A central ESB holding the eligibility and payment rules",
        level: "strains",
        later: "The ESB team becomes the new bottleneck.",
      },
      {
        id: "events",
        label: "Events between contexts; an orchestrated monthly payment run inside Payments",
        level: "holds",
        later:
          "Contexts change independently; the payment run is visible, auditable and retryable.",
      },
    ],
  },
  {
    id: "payments",
    area: "Moving payments",
    module: 17,
    options: [
      {
        id: "switch",
        label: "Test thoroughly, then switch all payments over in one month",
        level: "fails",
        later:
          "A rounding rule nobody documented underpays 40,000 pensioners by a few rupees. Headlines follow.",
      },
      {
        id: "parallel",
        label: "Parallel-run every payment for two months; switch one scheme at a time",
        level: "holds",
        later: "The parallel run caught the rounding rule before anyone was paid wrongly.",
      },
    ],
  },
  {
    id: "governance",
    area: "Governance",
    module: 19,
    options: [
      {
        id: "board",
        label: "An architecture board approves every change",
        level: "strains",
        later: "Decisions are consistent but slow; teams wait three weeks for each meeting.",
      },
      {
        id: "adrs",
        label: "ADRs in each repo, fitness functions in CI, a radar and a paved road",
        level: "holds",
        later: "Decisions are recorded and checked automatically; new joiners can see why.",
      },
    ],
  },
];
