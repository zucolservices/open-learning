/** Everything a learner can change in this module, saved for resume. */
export interface ChatState {
  [key: string]: unknown;
  transport: "poll" | "long" | "sse" | "ws";
  scenario: "online" | "offline" | "drop";
  frame: number;
  users: number; // index into USERS
  perServer: number; // index into PER_SERVER
  jitter: boolean;
}

export const initialState: ChatState = {
  transport: "poll",
  scenario: "online",
  frame: 0,
  users: 1,
  perServer: 1,
  jitter: false,
};
