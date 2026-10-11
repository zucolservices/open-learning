/** Everything a learner can change in this module, saved for resume. */
export interface StateState {
  [key: string]: unknown;
  derived: boolean;
  items: string[];
  storedCount: number;
  storedTotal: number;
  renders: number;
  fw: string;
  declarative: boolean;
}

export const initialState: StateState = {
  derived: false,
  items: [],
  storedCount: 0,
  storedTotal: 0,
  renders: 1,
  fw: "react",
  declarative: false,
};
