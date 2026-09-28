/** Everything a learner can change in this module, saved for resume. */
export interface InspectState {
  [key: string]: unknown;
  /** Driving demo: steer in small corrections, or point once and go. */
  drive: "small" | "once";
  /** Three-pillars walkthrough frame. */
  frame: number;
  /** Weeks between inspections in the steering simulation. */
  every: number;
  /** Whether inspections see the real product and real users. */
  transparent: boolean;
}

export const initialState: InspectState = {
  drive: "once",
  frame: 0,
  every: 13,
  transparent: true,
};
