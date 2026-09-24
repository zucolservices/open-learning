/** Everything a learner can change in this module, saved for resume. */
export interface LandscapeState {
  [key: string]: unknown;
  platform: string;
  block: string;
  vendor: string;
  picks: Record<string, string>;
  active: string;
}

export const initialState: LandscapeState = {
  platform: "aws",
  block: "catalog",
  vendor: "databricks",
  picks: {},
  active: "storage",
};
