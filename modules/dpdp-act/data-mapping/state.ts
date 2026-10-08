import type { IdKind } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MapState {
  [key: string]: unknown;
  inspected: string[];
  selected: string;
  idKind: IdKind;
  aadhaar: "full" | "masked" | "hashed";
}

export const initialState: MapState = {
  inspected: [],
  selected: "db",
  idKind: "aadhaar",
  aadhaar: "full",
};
