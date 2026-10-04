import type { Col } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FilesState {
  [key: string]: unknown;
  col: Col;
  repart: boolean;
}

export const initialState: FilesState = { col: "date", repart: false };
