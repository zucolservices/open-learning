/** Everything a learner can change in this module, saved for resume. */
export interface LegacyState {
  [key: string]: unknown;
  run: string[];
  locked: string[];
  refactor: "rewrite" | "extracted" | null;
}

export const initialState: LegacyState = { run: [], locked: [], refactor: null };
