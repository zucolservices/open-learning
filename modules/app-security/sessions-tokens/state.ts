import type { Guard } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SessState {
  [key: string]: unknown;
  on: Guard[];
  sameSite: "None" | "Lax" | "Strict";
  algFromToken: boolean;
  store: "local" | "cookie" | "bff";
}

export const initialState: SessState = {
  on: [],
  sameSite: "Lax",
  algFromToken: true,
  store: "local",
};
