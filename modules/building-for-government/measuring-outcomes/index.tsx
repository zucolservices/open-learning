"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MeasureState } from "./state";
import { Clinic, Dashboard, IndiaMeasures, LeftOut, MeasureCheck, Wrap } from "./steps";

export default defineModule<MeasureState>({
  initialState,
  steps: [
    { id: "story", title: "The busy clinic", Component: Clinic },
    { id: "dashboard", title: "Rebuild the minister's dashboard", Component: Dashboard },
    { id: "india", title: "How India measures e-services", Component: IndiaMeasures },
    { id: "left-out", title: "Who is being left out?", Component: LeftOut },
    {
      id: "check",
      title: "Output or outcome?",
      checkpoint: "gov-outcomes",
      Component: MeasureCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
