/** Everything a learner can change in this module, saved for resume. */
export interface BusState {
  [key: string]: unknown;
  cells: string[];
  compare: boolean;
  pair: [number, number];
  join: "drill" | "direct";
  conform: boolean;
}

export const initialState: BusState = {
  cells: ["0-0", "0-1"],
  compare: false,
  pair: [0, 1],
  join: "drill",
  conform: false,
};
