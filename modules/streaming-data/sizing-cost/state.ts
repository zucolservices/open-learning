export type Region = "us" | "mumbai";

/** Everything a learner can change in this module, saved for resume. */
export interface SizingState {
  [key: string]: unknown;
  target: number; // MB/s
  perProducer: number; // MB/s per partition
  perConsumer: number; // MB/s per partition
  retention: number; // days
  rf: number;
  mbps: number; // pricing throughput
  groups: number;
  region: Region;
  fetchFollower: boolean;
}

export const initialState: SizingState = {
  target: 50,
  perProducer: 10,
  perConsumer: 2,
  retention: 7,
  rf: 3,
  mbps: 10,
  groups: 1,
  region: "us",
  fetchFollower: false,
};
