import type { Response } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ThreatState {
  [key: string]: unknown;
  selected: string;
  seen: string[];
  boundaries: boolean;
  letter: string;
  decisions: Record<string, Response>;
}

export const initialState: ThreatState = {
  selected: "",
  seen: [],
  boundaries: false,
  letter: "S",
  decisions: {},
};
