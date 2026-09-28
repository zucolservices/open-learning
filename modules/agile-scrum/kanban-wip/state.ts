/** Everything a learner can change in this module, saved for resume. */
export interface KanbanState {
  [key: string]: unknown;
  road: "jam" | "metered";
  frame: number;
  dev: number;
  test: number;
}

export const initialState: KanbanState = { road: "jam", frame: 0, dev: 99, test: 99 };
