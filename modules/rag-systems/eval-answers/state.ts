/** Everything a learner can change in this module, saved for resume. */
export interface JudgeState {
  [key: string]: unknown;
  i: number;
  /** The learner's own verdicts per answer: faithful and relevant, 1 yes / 0 no. */
  picks: Record<string, { f?: number; r?: number }>;
  j: number;
  view: "oneshot" | "claims";
}

export const initialState: JudgeState = { i: 0, picks: {}, j: 5, view: "oneshot" };
