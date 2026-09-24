/** Everything a learner can change in this module, saved for resume. */
export interface QueueState {
  [key: string]: unknown;
  consumers: number; // index into CONSUMER_COUNTS
  mode: "queue" | "log";
  routing: "competing" | "random" | "key";
  run: number;
  dlq: boolean;
  kind: "queue" | "log";
  frame: number;
}

export const initialState: QueueState = {
  consumers: 1,
  mode: "queue",
  routing: "competing",
  run: 0,
  dlq: false,
  kind: "queue",
  frame: 0,
};
