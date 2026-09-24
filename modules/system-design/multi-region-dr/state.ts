/** Everything a learner can change in this module, saved for resume. */
export interface DrState {
  [key: string]: unknown;
  view: "backup" | "pilot" | "warm" | "active";
  strategy: "backup" | "pilot" | "warm" | "active";
  data: "backups" | "replica";
  routing: "manual" | "dns" | "global";
  ran: boolean;
  shown: number; // events revealed
}

export const initialState: DrState = {
  view: "backup",
  strategy: "backup",
  data: "backups",
  routing: "manual",
  ran: false,
  shown: 0,
};
