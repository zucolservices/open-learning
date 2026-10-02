export type Who = "govt" | "bank" | "market" | "insurer" | "company";

/** Everything a learner can change in this module, saved for resume. */
export interface IndiaState {
  [key: string]: unknown;
  city: string;
  category: "A" | "B";
  fixes: string[];
  who: Who;
}

export const initialState: IndiaState = { city: "Mumbai", category: "B", fixes: [], who: "govt" };
