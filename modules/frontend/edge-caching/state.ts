import type { Header, Res } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface CacheState {
  [key: string]: unknown;
  headers: Record<Res, Header>;
}

export const initialState: CacheState = {
  headers: { js: "no-store", html: "max-age", api: "smaxage" },
};
