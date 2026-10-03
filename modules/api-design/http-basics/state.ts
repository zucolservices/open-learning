import type { Method, Path } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface HttpState {
  [key: string]: unknown;
  method: Method;
  path: Path;
  auth: boolean;
  json: boolean;
  body: boolean;
  seen: number[];
}

export const initialState: HttpState = {
  method: "GET",
  path: "/menu/dish_42",
  auth: false,
  json: false,
  body: false,
  seen: [],
};
