"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BusState } from "./state";
import { SharedCalendar, BusMatrix, DrillAcross, SameValues, NotConformed, Wrap } from "./steps";

export default defineModule<BusState>({
  initialState,
  steps: [
    { id: "story", title: "One calendar for the whole school", Component: SharedCalendar },
    { id: "matrix", title: "Fill in the bus matrix", Component: BusMatrix },
    { id: "drill", title: "Drilling across", Component: DrillAcross },
    { id: "values", title: "Same names, same values", Component: SameValues },
    {
      id: "check",
      title: "Two rows for one category",
      checkpoint: "not-conformed",
      Component: NotConformed,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
