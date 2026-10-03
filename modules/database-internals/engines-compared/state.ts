import type { Engine, Facet } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EngState {
  [key: string]: unknown;
  engine: Engine;
  facet: Facet;
}

export const initialState: EngState = { engine: "postgres", facet: "storage" };
