/** Everything a learner can change in this module, saved for resume. */
export interface NoticeState {
  [key: string]: unknown;
  fixed: string[];
  open: string;
  lang: string;
  user: "new" | "existing";
}

export const initialState: NoticeState = { fixed: [], open: "when", lang: "English", user: "new" };
