"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SevState } from "./state";
import { Inspection, LabelIt, Systems, Verdicts, SevCheck, Wrap } from "./steps";

export default defineModule<SevState>({
  initialState,
  steps: [
    { id: "story", title: "The health inspector's report", Component: Inspection },
    { id: "label", title: "Label your review, then give a verdict", Component: LabelIt },
    { id: "systems", title: "Two common labelling systems", Component: Systems },
    { id: "verdicts", title: "Verdicts on each platform", Component: Verdicts },
    { id: "check", title: "Blocking or not?", checkpoint: "review-severity", Component: SevCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
