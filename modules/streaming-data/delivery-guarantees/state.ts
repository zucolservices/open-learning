export type Producer = "fire" | "retry" | "idem" | "txn";
export type Consumer = "before" | "after" | "txn";
export type Fault = "lostWrite" | "lostAck" | "appRestart" | "consumerCrash";

/** Everything a learner can change in this module, saved for resume. */
export interface DelState {
  [key: string]: unknown;
  producer: Producer;
  consumer: Consumer;
  fault: Fault;
  sms: boolean;
  dedupe: boolean;
  frame: number;
}

export const initialState: DelState = {
  producer: "retry",
  consumer: "after",
  fault: "lostAck",
  sms: false,
  dedupe: false,
  frame: 0,
};
