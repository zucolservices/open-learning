import type { Feature, Verify } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ChildState {
  [key: string]: unknown;
  child: boolean;
  verify: Verify | "";
  on: Feature[];
  school: boolean;
  caseId: string;
}

export const initialState: ChildState = {
  child: true,
  verify: "",
  on: [],
  school: false,
  caseId: "1",
};
