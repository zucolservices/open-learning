export type Acks = "0" | "1" | "all";
export type Health = "both" | "one" | "none";

/** Everything a learner can change in this module, saved for resume. */
export interface ReplState {
  [key: string]: unknown;
  acks: Acks;
  minIsr: 1 | 2;
  unclean: boolean;
  health: Health;
  crashed: boolean;
  story: number;
}

export const initialState: ReplState = {
  acks: "1",
  minIsr: 1,
  unclean: false,
  health: "both",
  crashed: false,
  story: 0,
};
