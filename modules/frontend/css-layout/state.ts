import type { Align, Dir, Justify } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LayoutState {
  [key: string]: unknown;
  dir: Dir;
  justify: Justify;
  align: Align;
  gap: number;
  met: string[];
  columns: string;
  span: boolean;
  padding: number;
  border: number;
  borderBox: boolean;
}

export const initialState: LayoutState = {
  dir: "row",
  justify: "flex-start",
  align: "stretch",
  gap: 0,
  met: [],
  columns: "one",
  span: false,
  padding: 16,
  border: 4,
  borderBox: false,
};
