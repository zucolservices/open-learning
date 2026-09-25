import type { AnswerId, ContextId, HostId, LangId, ModelId } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ChooseState {
  [key: string]: unknown;
  model: ModelId;
  context: ContextId;
  lang: LangId;
  host: HostId;
  answer: AnswerId;
  gpus: number;
  replayed: boolean;
}

export const initialState: ChooseState = {
  model: "large",
  context: "stuff",
  lang: "native",
  host: "api",
  answer: "full",
  gpus: 2,
  replayed: false,
};
