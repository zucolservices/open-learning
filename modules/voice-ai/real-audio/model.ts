/** Real-world audio problems and their fixes, with an illustrative error rate. */

export type Problem = "noise" | "echo" | "overlap" | "accent";

export const PROBLEMS: {
  id: Problem;
  label: string;
  fix: string;
  fixLabel: string;
  add: number;
  fixed: number;
  symptom: string;
}[] = [
  {
    id: "noise",
    label: "Traffic noise",
    fix: "suppress",
    fixLabel: "Noise suppression",
    add: 12,
    fixed: 3,
    symptom: "“book a table” → “look a cable”",
  },
  {
    id: "echo",
    label: "Speakerphone echo",
    fix: "aec",
    fixLabel: "Echo cancellation",
    add: 15,
    fixed: 1,
    symptom: "the agent hears its own voice and interrupts itself",
  },
  {
    id: "overlap",
    label: "A second person talking",
    fix: "diarise",
    fixLabel: "Speaker diarisation",
    add: 10,
    fixed: 4,
    symptom: "two people's words merged into one muddled request",
  },
  {
    id: "accent",
    label: "An accent the model rarely heard in training",
    fix: "test",
    fixLabel: "Test and tune on real callers",
    add: 14,
    fixed: 6,
    symptom: "names and place names mis-heard again and again",
  },
];

export const BASE = 6;
