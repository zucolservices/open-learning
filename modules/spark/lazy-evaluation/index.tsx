"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LazyState } from "./state";
import { Shopper, BuildPlan, TwoKinds, NarrowWide, TorA, Wrap } from "./steps";

export default defineModule<LazyState>({
  initialState,
  steps: [
    { id: "story", title: "The personal shopper", Component: Shopper },
    { id: "plan", title: "Build a plan, then run it", Component: BuildPlan },
    { id: "kinds", title: "Transformations and actions", Component: TwoKinds },
    { id: "narrow", title: "Narrow and wide", Component: NarrowWide },
    { id: "check", title: "Transformation or action?", checkpoint: "t-or-a", Component: TorA },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
