import type { Lang, Q } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface SqlState {
  [key: string]: unknown;
  q: Q;
  lang: Lang;
  ansi: boolean;
}

export const initialState: SqlState = { q: "revenue", lang: "sql", ansi: true };
