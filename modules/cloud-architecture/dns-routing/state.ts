/** Everything a learner can change in this module, saved for resume. */
export interface DnsState {
  [key: string]: unknown;
  policy: "simple" | "latency" | "failover" | "weighted";
  mumbaiDown: boolean;
  interval: number;
  threshold: number;
  ttl: number;
}

export const initialState: DnsState = {
  policy: "simple",
  mumbaiDown: false,
  interval: 30,
  threshold: 3,
  ttl: 60,
};
