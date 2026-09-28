"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DailyState } from "./state";
import { Huddle, Myths, Standups, Wrap } from "./steps";

export default defineModule<DailyState>({
  initialState,
  steps: [
    { id: "huddle", title: "Fifteen minutes, for the Developers", Component: Huddle },
    { id: "standups", title: "Three stand-ups that go wrong", Component: Standups },
    { id: "myths", title: "Guide or myth?", checkpoint: "daily-myths", Component: Myths },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
