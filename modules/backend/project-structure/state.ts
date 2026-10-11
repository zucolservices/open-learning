import type { Layer } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface StructState {
  [key: string]: unknown;
  placed: Record<string, Layer>;
  folders: string;
}

export const initialState: StructState = { placed: {}, folders: "layers" };
