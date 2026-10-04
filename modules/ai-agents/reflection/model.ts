/** A coding agent revising a date parser under three kinds of critic. Illustrative. */

export type Critic = "none" | "self" | "tests";

export const CRITICS: { id: Critic; label: string }[] = [
  { id: "none", label: "No critic" },
  { id: "self", label: "“Review your answer”" },
  { id: "tests", label: "Run the tests" },
];

const SELF = [6, 7, 6, 5, 6];
const TESTS = [6, 8, 9, 10];

const SELF_NOTES = [
  "First draft.",
  "“I should also accept 3-letter months.” Fixed one case.",
  "“Actually, the day-first rule was wrong.” Changed it; broke a passing case.",
  "“Revisiting: I'll be stricter about separators.” Broke another.",
  "“Changing back to day-first.” Still not sure it's right.",
];
const TEST_NOTES = [
  "First draft.",
  "2 failing: '03-Oct-2026' and '2026/10/03'. Added month names and slashes.",
  "1 failing: '3 Oct' without a year. Defaulted to the current year.",
  "All 10 tests pass. Stop.",
];

export function rounds(c: Critic, max: number) {
  if (c === "none") return [{ pass: 6, note: "First draft. Nobody checks it." }];
  const scores = c === "self" ? SELF : TESTS;
  const notes = c === "self" ? SELF_NOTES : TEST_NOTES;
  const out: { pass: number; note: string }[] = [];
  for (let i = 0; i <= Math.min(max, scores.length - 1); i++) {
    out.push({ pass: scores[i], note: notes[i] });
    if (c === "tests" && scores[i] === 10) break;
  }
  return out;
}
