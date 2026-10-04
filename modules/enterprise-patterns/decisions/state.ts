/** Everything a learner can change in this module, saved for resume. */
export interface AdrState {
  [key: string]: unknown;
  picks: Record<string, number>;
  status: "proposed" | "accepted" | "superseded";
  fitness: boolean;
  commit: boolean;
}

export const initialState: AdrState = {
  picks: {},
  status: "proposed",
  fitness: false,
  commit: false,
};
