export type Reader = "fraud" | "ledger" | "sms";

/** Everything a learner can change in this module, saved for resume. */
export interface LogState {
  [key: string]: unknown;
  part: string;
  appended: number;
  offsets: Record<Reader, number>;
  mode: "log" | "queue";
  taken: Record<number, Reader>;
  platform: "kafka" | "redpanda" | "pulsar" | "kinesis" | "pubsub" | "eventhubs";
}

export const initialState: LogState = {
  part: "key",
  appended: 6,
  offsets: { fraud: 0, ledger: 0, sms: 0 },
  mode: "log",
  taken: {},
  platform: "kafka",
};
