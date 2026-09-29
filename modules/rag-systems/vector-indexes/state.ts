/** Everything a learner can change in this module, saved for resume. */
export interface IndexState {
  [key: string]: unknown;
  qx: number;
  qy: number;
  hop: number;
  ef: number;
  method: "hnsw" | "ivf";
  knob: number;
  nPow: number;
  dims: number;
  prec: "f32" | "int8" | "bin";
}

export const initialState: IndexState = {
  qx: 0.7,
  qy: 0.3,
  hop: 0,
  ef: 6,
  method: "hnsw",
  knob: 3,
  nPow: 2,
  dims: 1024,
  prec: "f32",
};
