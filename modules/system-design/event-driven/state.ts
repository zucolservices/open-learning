/** Everything a learner can change in this module, saved for resume. */
export interface EventState {
  [key: string]: unknown;
  wiring: "calls" | "events";
  added: string[]; // extra consumers the learner has added
  emailDown: boolean;
  style: "notification" | "state" | "sourcing" | "cqrs";
  replay: number;
  change: "add-optional" | "remove" | "rename" | "type";
  registry: boolean;
}

export const initialState: EventState = {
  wiring: "calls",
  added: [],
  emailDown: false,
  style: "notification",
  replay: 5,
  change: "add-optional",
  registry: false,
};
