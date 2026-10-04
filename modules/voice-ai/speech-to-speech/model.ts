/** The same calls through a cascaded pipeline and a speech-to-speech model. Illustrative. */

export type Arch = "cascade" | "s2s";
export type Scenario = "upset" | "disclosure" | "lookup";

export const SCENARIOS: { id: Scenario; label: string; setup: string }[] = [
  {
    id: "upset",
    label: "An upset caller",
    setup: "“This is the third time my parcel's gone missing!” (voice shaking)",
  },
  {
    id: "disclosure",
    label: "A legal disclosure",
    setup: "Before taking payment, the agent must read a 40-word disclosure exactly as written.",
  },
  {
    id: "lookup",
    label: "A booking lookup",
    setup: "“Can you check whether my table for Friday is confirmed?”",
  },
];

export const OUTCOME: Record<
  Scenario,
  Record<Arch, { ms: number; text: string; good: boolean }>
> = {
  upset: {
    cascade: {
      ms: 1100,
      text: "The transcript says the words but not the shaking voice. The reply is polite but flat: “I can help with that. Please give me your order number.”",
      good: false,
    },
    s2s: {
      ms: 450,
      text: "It hears the distress and answers gently, more slowly: “Oh no, that's really frustrating, I'm sorry. Let's sort it out now.”",
      good: true,
    },
  },
  disclosure: {
    cascade: {
      ms: 1000,
      text: "Your code sends the exact disclosure text straight to speech synthesis: word for word, every time, and logged.",
      good: true,
    },
    s2s: {
      ms: 400,
      text: "The model is told to read it, but paraphrases a clause on some calls, and there's no exact record of what it actually said.",
      good: false,
    },
  },
  lookup: {
    cascade: {
      ms: 1300,
      text: "Transcript → model calls the booking tool → reply. Slower, but every step is visible in the logs.",
      good: true,
    },
    s2s: {
      ms: 700,
      text: "Realtime models call tools too, and answer faster, though you see less of what happened between hearing and speaking.",
      good: true,
    },
  },
};

export const TRAITS: [string, boolean, boolean][] = [
  ["Low latency", false, true],
  ["Hears tone and emotion", false, true],
  ["Exact scripted wording", true, false],
  ["A transcript at every step", true, false],
  ["Use any language model", true, false],
  ["Easy to add voice to an existing text agent", true, false],
];
