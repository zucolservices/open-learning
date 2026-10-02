export type KeyChoice = "customer" | "order" | "none" | "status";
export type HotKey = "merchant" | "payer" | "salted";

/** Everything a learner can change in this module, saved for resume. */
export interface PartState {
  [key: string]: unknown;
  key: string;
  parts: number;
  orderKey: KeyChoice;
  hotKey: HotKey;
  hotParts: number;
}

export const initialState: PartState = {
  key: "asha",
  parts: 6,
  orderKey: "none",
  hotKey: "merchant",
  hotParts: 6,
};
