/** Everything a learner can change in this module, saved for resume. */
export interface GrainState {
  [key: string]: unknown;
  step: number;
  process: string;
  grain: string;
  dims: string[];
  facts: string[];
  zoom: string;
}

export const initialState: GrainState = {
  step: 0,
  process: "",
  grain: "",
  dims: [],
  facts: [],
  zoom: "line",
};
