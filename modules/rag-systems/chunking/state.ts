/** Everything a learner can change in this module, saved for resume. */
export interface ChunkState {
  [key: string]: unknown;
  method: "fixed" | "sentence" | "heading";
  size: "small" | "medium" | "large";
  overlap: 0 | 25;
  q: number;
  card: number;
}

export const initialState: ChunkState = {
  method: "fixed",
  size: "small",
  overlap: 0,
  q: 0,
  card: 0,
};
