/** Everything a learner can change in this module, saved for resume. */
export interface PlanState {
  [key: string]: unknown;
  /** Topics walkthrough frame. */
  frame: number;
  goal: string;
  picked: string[];
  ran: boolean;
}

export const initialState: PlanState = { frame: 0, goal: "", picked: [], ran: false };
