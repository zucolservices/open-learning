"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ServingState } from "./state";
import { OneKitchen } from "./steps-story";
import { LeakCheck, OneRevenue, PointInTime } from "./steps-bi-ml";
import { RagLab, RouteCheck, Wrap } from "./steps-ai";
import { Tools } from "./steps-tools";

export default defineModule<ServingState>({
  initialState,
  steps: [
    { id: "kitchen", title: "One copy, four customers", Component: OneKitchen },
    { id: "revenue", title: "Revenue means one thing", Component: OneRevenue },
    { id: "pit", title: "The time-travel trap", Component: PointInTime },
    { id: "leak", title: "Spot the leak", checkpoint: "leak", Component: LeakCheck },
    { id: "rag", title: "An assistant on your documents", Component: RagLab },
    { id: "route", title: "Route each request", checkpoint: "route", Component: RouteCheck },
    { id: "tools", title: "Who serves what", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
