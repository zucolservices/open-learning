import type { Cache, Deps, Tool } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface BuildState {
  [key: string]: unknown;
  deps: Deps;
  tool: Tool;
  cache: Cache;
  eco: string;
}

export const initialState: BuildState = { deps: "range", tool: "any", cache: "none", eco: "npm" };
