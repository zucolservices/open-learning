import type { Piece } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface OasState {
  [key: string]: unknown;
  on: Piece[];
  view: "docs" | "mock" | "client";
}

export const initialState: OasState = { on: [], view: "docs" };
