/** Everything a learner can change in this module, saved for resume. */
export interface UrlState {
  [key: string]: unknown;
  perMonth: number; // index into VOLUMES
  ratio: number; // index into RATIOS
  years: number; // index into YEARS
  scheme: "hash" | "counter" | "random";
  keyLen: number;
  links: number; // index into LINKS
  store: "sql" | "kv";
  cache: "none" | "redis" | "cdn";
  analytics: "sync" | "async";
}

export const initialState: UrlState = {
  perMonth: 2,
  ratio: 1,
  years: 2,
  scheme: "random",
  keyLen: 1,
  links: 1,
  store: "sql",
  cache: "none",
  analytics: "sync",
};
