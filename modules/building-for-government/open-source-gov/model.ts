/** A state chooses how to get an urban services platform, and lives with the choice for five years. Illustrative. */

export type Route = "build" | "buy" | "reuse";

export const ROUTES: [Route, string, string][] = [
  [
    "build",
    "Have a vendor build it",
    "Custom code, written for you; the contract says who owns it.",
  ],
  ["buy", "License a commercial product", "Ready-made software, paid for every year."],
  [
    "reuse",
    "Reuse an open-source platform",
    "A digital public good already used by other states, adapted locally.",
  ],
];

export const YEARS: { title: string; outcome: Record<Route, [string, boolean]> }[] = [
  {
    title: "Year 1 · Launch",
    outcome: {
      build: ["Live after 18 months: everything built from scratch.", false],
      buy: ["Live in 6 months.", true],
      reuse: ["Live in 8 months, after adding the state's languages and fee rules.", true],
    },
  },
  {
    title: "Year 2 · Renewal",
    outcome: {
      build: ["No licence fee; maintenance under contract.", true],
      buy: ["The licence price rises 30%; moving the data out would be hard.", false],
      reuse: ["No licence fee; the state pays for hosting and support, which aren't free.", true],
    },
  },
  {
    title: "Year 3 · A new feature: water connections",
    outcome: {
      build: ["Only the original vendor knows the code; the change request is expensive.", false],
      buy: ["It's on the vendor's roadmap, maybe next year.", false],
      reuse: ["Another state already built it; the state switches it on and adapts it.", true],
    },
  },
  {
    title: "Year 4 · The supplier leaves",
    outcome: {
      build: ["The code was never handed over in usable form; nobody else can run it.", false],
      buy: ["The product is discontinued; a migration project begins.", false],
      reuse: ["A new support firm takes over the same open code.", true],
    },
  },
  {
    title: "Year 5 · A neighbouring state wants the same",
    outcome: {
      build: ["It has to start again, or negotiate with the old vendor.", false],
      buy: ["It buys its own licence.", false],
      reuse: ["It reuses the platform, including the improvements made here.", true],
    },
  },
];
