/** Everything a learner can change in this module, saved for resume. */
export interface ScrumPageState {
  [key: string]: unknown;
  /** Selected part of the framework, or null. */
  part: string | null;
  /** Relay-vs-rugby analogy view. */
  team: "relay" | "rugby";
}

export const initialState: ScrumPageState = { part: null, team: "relay" };
