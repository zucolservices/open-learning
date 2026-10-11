/** Everything a learner can change in this module, saved for resume. */
export interface UiState {
  [key: string]: unknown;
  fw: string;
  qty: Record<string, number>;
  vegOnly: boolean;
  skip: boolean;
  changed: string[];
  rows: number;
}

export const initialState: UiState = {
  fw: "compose",
  qty: {},
  vegOnly: false,
  skip: true,
  changed: [],
  rows: 1000,
};
