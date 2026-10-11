/**
 * A confusing booking filter and candidate names for each identifier: one clear, one vague, one
 * misleading. The code is rebuilt from the chosen names; each good name answers a reader's question.
 */

export interface Slot {
  id: string;
  question: string;
  options: { name: string; kind: "good" | "vague" | "misleading"; note: string }[];
}

export const SLOTS: Slot[] = [
  {
    id: "fn",
    question: "What does this function give me back?",
    options: [
      { name: "proc", kind: "vague", note: "Process what, into what?" },
      { name: "getData", kind: "vague", note: "All functions get data." },
      { name: "confirmedLargeBookings", kind: "good", note: "Says exactly what comes back." },
    ],
  },
  {
    id: "list",
    question: "What is d?",
    options: [
      { name: "d", kind: "vague", note: "A letter, not a meaning." },
      { name: "bookings", kind: "good", note: "A list of bookings." },
      {
        name: "dates",
        kind: "misleading",
        note: "They aren't dates: wrong names are worse than vague ones.",
      },
    ],
  },
  {
    id: "flag",
    question: "What does passing true for f do?",
    options: [
      { name: "includeSmallParties", kind: "good", note: "Now the call site reads naturally." },
      { name: "flag", kind: "vague", note: "Still a mystery." },
      { name: "f", kind: "vague", note: "Still a mystery." },
    ],
  },
  {
    id: "item",
    question: "What is each x?",
    options: [
      { name: "x", kind: "vague", note: "Fine for maths, not for bookings." },
      { name: "booking", kind: "good", note: "One booking from the list." },
      { name: "item", kind: "vague", note: "Item of what?" },
    ],
  },
  {
    id: "status",
    question: "What does s === 2 mean?",
    options: [
      {
        name: "booking.status === CONFIRMED",
        kind: "good",
        note: "A named constant explains the magic number.",
      },
      { name: "booking.s === 2", kind: "vague", note: "Still a magic number." },
      {
        name: "booking.state === TWO",
        kind: "misleading",
        note: "Naming the number doesn't name the meaning.",
      },
    ],
  },
  {
    id: "size",
    question: "What does a > 8 compare?",
    options: [
      {
        name: "booking.partySize > LARGE_PARTY",
        kind: "good",
        note: "Size of the group, against a named rule.",
      },
      {
        name: "booking.age > 8",
        kind: "misleading",
        note: "Sounds like a customer's age: a reader would be badly misled.",
      },
      { name: "booking.a > 8", kind: "vague", note: "Still a mystery." },
    ],
  },
  {
    id: "result",
    question: "What is t?",
    options: [
      { name: "t", kind: "vague", note: "Temporary? Total? Time?" },
      { name: "temp", kind: "vague", note: "Every variable is temporary." },
      { name: "matches", kind: "good", note: "The bookings that matched." },
    ],
  },
];

export function render(choice: Record<string, number>): string[] {
  const n = (id: string, fallback: number) => {
    const slot = SLOTS.find((s) => s.id === id)!;
    return slot.options[choice[id] ?? fallback].name;
  };
  const fn = n("fn", 0);
  const list = n("list", 0);
  const flag = n("flag", 2);
  const item = n("item", 0);
  const result = n("result", 0);
  const status = n("status", 1).replace("booking", item);
  const size = n("size", 2).replace("booking", item);
  return [
    `function ${fn}(${list}, ${flag}) {`,
    `  const ${result} = [];`,
    `  for (const ${item} of ${list}) {`,
    `    if (${status} && (${flag} || ${size})) ${result}.push(${item});`,
    `  }`,
    `  return ${result};`,
    `}`,
  ];
}

/** Defaults show the original confusing code. */
export const ORIGINAL: Record<string, number> = {
  fn: 0,
  list: 0,
  flag: 2,
  item: 0,
  status: 1,
  size: 2,
  result: 0,
};
