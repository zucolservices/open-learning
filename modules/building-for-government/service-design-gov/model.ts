/** Redesigning a made-up old-age pension application: five decisions. */

export interface Decision {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DECISIONS: Decision[] = [
  {
    id: "start",
    title: "1 · Where to start",
    options: [
      {
        id: "research",
        label: "Spend two weeks with pensioners, families and service-centre operators",
        ok: true,
        outcome:
          "You learn most applicants are helped by a relative or an operator, and that the yearly proof-of-life visit is the real pain.",
      },
      {
        id: "digitise",
        label: "Turn the six-page paper form into an online form, field by field",
        ok: false,
        outcome: "The online form is as confusing as the paper one, now with time-outs.",
      },
    ],
  },
  {
    id: "life",
    title: "2 · The yearly proof that a pensioner is alive",
    options: [
      {
        id: "office",
        label: "Keep requiring a visit to the district office every year",
        ok: false,
        outcome: "Frail pensioners travel for hours; some miss the date and their pension stops.",
      },
      {
        id: "near",
        label: "Let them prove it at a nearby service centre, or at home for the housebound",
        ok: true,
        outcome: "Missed proofs and stopped pensions fall sharply.",
      },
    ],
  },
  {
    id: "words",
    title: "3 · How the service talks",
    options: [
      {
        id: "plain",
        label: "Plain language in the user's own language, tested with real applicants",
        ok: true,
        outcome: "People understand what to do without asking.",
      },
      {
        id: "legal",
        label: "The wording of the pension rules, so it's legally precise",
        ok: false,
        outcome: "Accurate, and almost nobody understands it.",
      },
    ],
  },
  {
    id: "channels",
    title: "4 · Channels",
    options: [
      {
        id: "online",
        label: "Online only, to save money",
        ok: false,
        outcome: "Those least able to apply online, often the oldest, are pushed out.",
      },
      {
        id: "joined",
        label: "Online, phone and service centres, all showing the same status",
        ok: true,
        outcome: "Whoever applies, by whatever route, can see where the application is.",
      },
    ],
  },
  {
    id: "team",
    title: "5 · Who builds and runs it",
    options: [
      {
        id: "team",
        label:
          "A team with policy, operations, design and engineering, improving it in small releases",
        ok: true,
        outcome: "Problems found after launch are fixed in weeks.",
      },
      {
        id: "vendor",
        label: "A vendor builds it to a fixed spec; the department checks it at the end",
        ok: false,
        outcome: "By launch the spec is out of date, and changes need a new contract.",
      },
    ],
  },
];
