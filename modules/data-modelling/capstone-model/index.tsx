"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Brief, Design, TenQuestions, Precedents, DesignOrder, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "brief", title: "The brief", Component: Brief },
    { id: "design", title: "Make the design choices", Component: Design },
    { id: "test", title: "Ten real questions", Component: TenQuestions },
    { id: "precedents", title: "It happens for real", Component: Precedents },
    {
      id: "order",
      title: "A design routine",
      checkpoint: "design-routine",
      Component: DesignOrder,
    },
    { id: "wrap", title: "The whole track", Component: Wrap },
  ],
});
