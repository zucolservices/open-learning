/** Everything a learner can change in this module, saved for resume. */
export interface CacheState {
  [key: string]: unknown;
  layer: number;
  pattern: "aside" | "read-through" | "write-through" | "write-back";
  frame: number;
  raceFix: "none" | "update" | "ttl" | "lease";
  raceFrame: number;
}

export const initialState: CacheState = {
  layer: 3,
  pattern: "aside",
  frame: 0,
  raceFix: "none",
  raceFrame: 0,
};
