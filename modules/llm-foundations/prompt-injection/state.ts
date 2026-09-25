/** Everything a learner can change in this module, saved for resume. */
export interface InjectState {
  [key: string]: unknown;
  /** Why-it-happens walkthrough frame. */
  frame: number;
  /** Defences switched on in the sandbox (bit set of ids). */
  defences: string[];
  /** Selected attack in the sandbox. */
  attack: string;
  /** Trifecta explorer: which of the three legs are present. */
  legs: string[];
}

export const initialState: InjectState = {
  frame: 0,
  defences: [],
  attack: "authority",
  legs: ["private", "untrusted", "external"],
};
