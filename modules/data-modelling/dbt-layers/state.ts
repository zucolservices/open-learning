import type { Layer } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface DbtState {
  [key: string]: unknown;
  placed: Record<string, Layer>;
  trace: string;
  bad: boolean;
}

export const initialState: DbtState = { placed: {}, trace: "", bad: false };
