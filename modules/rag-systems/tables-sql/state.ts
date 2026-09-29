/** Everything a learner can change in this module, saved for resume. */
export interface TablesState {
  [key: string]: unknown;
  sq: number;
  q: number;
  schema: "bare" | "desc";
}

export const initialState: TablesState = { sq: 1, q: 0, schema: "bare" };
