export type Scenario = "one" | "two" | "all";

/** Everything a learner can change in this module, saved for resume. */
export interface DisState {
  [key: string]: unknown;
  scenario: Scenario;
  pdb: boolean;
  tick: number;
  frame: number;
}

export const initialState: DisState = { scenario: "two", pdb: false, tick: 0, frame: 0 };
