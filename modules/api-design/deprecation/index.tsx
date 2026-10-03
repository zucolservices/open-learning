"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DepState } from "./state";
import { RoadClosure, Sunset, Headers, HowOthers, RetireOrder, Wrap } from "./steps";

export default defineModule<DepState>({
  initialState,
  steps: [
    { id: "road", title: "Closing a road", Component: RoadClosure },
    { id: "sunset", title: "A twelve-month sunset", Component: Sunset },
    { id: "headers", title: "Say it in every response", Component: Headers },
    { id: "others", title: "How the big platforms do it", Component: HowOthers },
    { id: "check", title: "In what order?", checkpoint: "retire-order", Component: RetireOrder },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
