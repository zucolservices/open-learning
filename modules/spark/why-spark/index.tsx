"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { ManyHands } from "./steps-story";
import { DiskTrips, Record, Timeline, NeedSpark, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "Many hands", Component: ManyHands },
    { id: "trips", title: "Count the disk trips", Component: DiskTrips },
    { id: "record", title: "The sorting record", Component: Record },
    { id: "timeline", title: "From a lab to everywhere", Component: Timeline },
    { id: "check", title: "Do you need Spark?", checkpoint: "need-spark", Component: NeedSpark },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
