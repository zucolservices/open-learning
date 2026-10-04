/** A clinic booking call, scripted two ways per design choice. The call is illustrative. */

export type FixId = "greet" | "confirm" | "correct" | "recover" | "handover";

export interface Line {
  who: "agent" | "caller";
  text: string;
}

export interface Fix {
  id: FixId;
  label: string;
  bad: Line[];
  good: Line[];
  /** Extra turns and repeats the bad version costs the caller. */
  cost: { turns: number; repeats: number };
}

export const FIXES: Fix[] = [
  {
    id: "greet",
    label: "Greeting: say it's an AI, ask an open question",
    bad: [
      {
        who: "agent",
        text: "Welcome to Lakeside Clinic. Please listen carefully, as our menu options have changed. For billing, say 'billing'. For prescriptions, say 'prescriptions'. For…",
      },
      { who: "caller", text: "Appointment!" },
    ],
    good: [
      { who: "agent", text: "Hi, I'm Lakeside Clinic's AI assistant. What can I help you with?" },
      { who: "caller", text: "I need to book a check-up." },
    ],
    cost: { turns: 1, repeats: 0 },
  },
  {
    id: "confirm",
    label: "Confirm implicitly; ask outright only before booking",
    bad: [
      { who: "caller", text: "Tuesday afternoon, with Dr. Rao." },
      { who: "agent", text: "You said Tuesday. Is that correct?" },
      { who: "caller", text: "Yes." },
      { who: "agent", text: "You said afternoon. Is that correct?" },
      { who: "caller", text: "Yes…" },
      { who: "agent", text: "Dr. Rao on Tuesday afternoon. I have 3 or 4 PM." },
    ],
    good: [
      { who: "caller", text: "Tuesday afternoon, with Dr. Rao." },
      { who: "agent", text: "OK, Dr. Rao on Tuesday afternoon. I have 3 or 4 PM." },
    ],
    cost: { turns: 4, repeats: 0 },
  },
  {
    id: "correct",
    label: "Accept a one-step correction",
    bad: [
      { who: "caller", text: "No, I said Thursday." },
      {
        who: "agent",
        text: "Sorry about that. Let's start again. What would you like to do today?",
      },
      { who: "caller", text: "Book a check-up. Thursday afternoon. Dr. Rao." },
    ],
    good: [
      { who: "caller", text: "No, Thursday." },
      { who: "agent", text: "Thursday, got it. 3 or 4 PM?" },
    ],
    cost: { turns: 2, repeats: 1 },
  },
  {
    id: "recover",
    label: "Reprompt shorter, then give options; never loop",
    bad: [
      { who: "caller", text: "Whichever's less busy, I guess, the later one maybe?" },
      { who: "agent", text: "I didn't understand. Please say a time." },
      { who: "caller", text: "The later one?" },
      { who: "agent", text: "I didn't understand. Please say a time." },
    ],
    good: [
      { who: "caller", text: "Whichever's less busy, I guess, the later one maybe?" },
      { who: "agent", text: "Sorry, which time: 3 PM or 4 PM?" },
      { who: "caller", text: "Four." },
    ],
    cost: { turns: 2, repeats: 1 },
  },
  {
    id: "handover",
    label: "Warm handover: pass the details to the person",
    bad: [
      { who: "caller", text: "Actually, can I ask a nurse about my test results?" },
      { who: "agent", text: "Transferring you now." },
      {
        who: "agent",
        text: "(Nurse) Hello, how can I help? Can I have your name and date of birth?",
      },
    ],
    good: [
      { who: "caller", text: "Actually, can I ask a nurse about my test results?" },
      {
        who: "agent",
        text: "Sure. I'll pass you to a nurse with your details and your Thursday 4 PM booking, so you won't need to repeat them.",
      },
    ],
    cost: { turns: 1, repeats: 1 },
  },
];

export function call(on: Record<FixId, boolean>) {
  const lines = FIXES.flatMap((f) =>
    (on[f.id] ? f.good : f.bad).map((l) => ({ ...l, fix: f.id, good: on[f.id] })),
  );
  const turns = lines.length;
  const repeats = FIXES.reduce((n, f) => n + (on[f.id] ? 0 : f.cost.repeats), 0);
  return { lines, turns, repeats };
}
