/**
 * Split one big feature for a citizen portal with named patterns: Mike Cohn's SPIDR (2017) and
 * Richard Lawrence's story-splitting patterns (2009; Humanizing Work guide 2020). Sizes in points
 * are illustrative.
 */

export const EPIC = {
  text: "Citizens can apply for any certificate online, pay the fee, track it and download it, on web, app or kiosk, in Kannada or English.",
  size: 45,
};
export const FITS = 8; // roughly what one story can be for a Sprint

export interface Story {
  text: string;
  size: number;
  /** Delivers something usable on its own (false for layer "slices"). */
  valuable: boolean;
  skeleton?: boolean;
}

export interface Pattern {
  id: string;
  name: string;
  source: string;
  idea: string;
  stories: Story[];
  trap?: boolean;
}

export const PATTERNS: Pattern[] = [
  {
    id: "workflow",
    name: "Workflow steps",
    source: "Lawrence",
    idea: "Build the thinnest start-to-finish path first; add the steps in the middle later.",
    stories: [
      {
        text: "Apply for an income certificate, an officer approves it by hand, citizen downloads it",
        size: 5,
        valuable: true,
        skeleton: true,
      },
    ],
  },
  {
    id: "paths",
    name: "Paths",
    source: "Cohn, SPIDR",
    idea: "Support one way of doing it first.",
    stories: [
      { text: "Pay the fee by UPI", size: 3, valuable: true },
      { text: "Pay by card or net banking", size: 3, valuable: true },
    ],
  },
  {
    id: "data",
    name: "Data",
    source: "Cohn, SPIDR · Lawrence",
    idea: "Handle fewer kinds of data at first.",
    stories: [
      { text: "The other certificate types (caste, residence, …)", size: 5, valuable: true },
      { text: "Every screen in Kannada as well as English", size: 3, valuable: true },
    ],
  },
  {
    id: "rules",
    name: "Rules",
    source: "Cohn, SPIDR · Lawrence",
    idea: "Relax a business rule for now; handle it by hand.",
    stories: [
      { text: "Automatic fee waivers for eligible groups", size: 3, valuable: true },
      { text: "Automatic eligibility checks", size: 3, valuable: true },
    ],
  },
  {
    id: "interfaces",
    name: "Interfaces",
    source: "Cohn, SPIDR · Lawrence",
    idea: "Start with one simple channel or screen.",
    stories: [
      { text: "The same journey in the mobile app", size: 5, valuable: true },
      { text: "Kiosk mode for service centres", size: 3, valuable: true },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    source: "Lawrence",
    idea: "“Manage” hides several actions. Do one first.",
    stories: [
      { text: "Edit a submitted application", size: 2, valuable: true },
      { text: "Withdraw an application", size: 1, valuable: true },
    ],
  },
  {
    id: "performance",
    name: "Defer performance",
    source: "Lawrence",
    idea: "Make it work, then make it fast, as a separate story.",
    stories: [{ text: "Stay fast during the admission-season rush", size: 3, valuable: true }],
  },
  {
    id: "spike",
    name: "Spike",
    source: "XP · Cohn, SPIDR",
    idea: "A timeboxed investigation when you can't size something yet. Use it last.",
    stories: [
      { text: "Spike (2 days): how to fetch documents from DigiLocker", size: 1, valuable: true },
      { text: "Attach documents from DigiLocker", size: 3, valuable: true },
    ],
  },
  {
    id: "layers",
    name: "By layer: UI, API, database",
    source: "the horizontal trap",
    idea: "Split the work by technical layer.",
    trap: true,
    stories: [
      { text: "Build all the screens", size: 15, valuable: false },
      { text: "Build all the APIs", size: 15, valuable: false },
      { text: "Build all the database tables", size: 15, valuable: false },
    ],
  },
];

export function split(applied: string[]) {
  if (applied.includes("layers")) {
    const p = PATTERNS.find((x) => x.id === "layers")!;
    return { stories: p.stories, rest: 0 };
  }
  const stories = PATTERNS.filter((p) => !p.trap && applied.includes(p.id)).flatMap(
    (p) => p.stories,
  );
  const used = stories.reduce((a, s) => a + s.size, 0);
  return { stories, rest: Math.max(0, EPIC.size - used) };
}
