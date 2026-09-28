/** Everything a learner can change in this module, saved for resume. */
export interface ManifestoState {
  [key: string]: unknown;
  /** Selected value (0–3), or -1 for the overview. */
  value: number;
  /** Selected principle theme. */
  theme: string;
  /** Reflections walkthrough frame. */
  frame: number;
}

export const initialState: ManifestoState = { value: -1, theme: "value", frame: 0 };
