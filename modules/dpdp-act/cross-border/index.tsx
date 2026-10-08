"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BorderState } from "./state";
import { Parcel, RouteData, History, SectorRules, BorderCheck, Wrap } from "./steps";

export default defineModule<BorderState>({
  initialState,
  steps: [
    { id: "story", title: "Posting a parcel abroad", Component: Parcel },
    { id: "route", title: "Route a fintech's data", Component: RouteData },
    { id: "history", title: "From 'mirror everything' to a negative list", Component: History },
    { id: "sectors", title: "Where sector rules step in", Component: SectorRules },
    { id: "check", title: "Can it go abroad?", checkpoint: "dpdp-border", Component: BorderCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
