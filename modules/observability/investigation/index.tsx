"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InvState } from "./state";
import { FlyThePlane, GoodOrAnti, Methods, WorkIt, Wrap } from "./steps";

export default defineModule<InvState>({
  initialState,
  steps: [
    { id: "work", title: "Work the incident", Component: WorkIt },
    { id: "methods", title: "Methods and anti-methods", Component: Methods },
    { id: "fly", title: "Fly the plane first", Component: FlyThePlane },
    {
      id: "check",
      title: "Good move or anti-method?",
      checkpoint: "good-or-anti",
      Component: GoodOrAnti,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
