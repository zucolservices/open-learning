"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type A11yLawState } from "./state";
import { Ramp, Barriers, IndiaLaw, Abroad, LawCheck, Wrap } from "./steps";

export default defineModule<A11yLawState>({
  initialState,
  steps: [
    { id: "story", title: "Steps without a ramp", Component: Ramp },
    { id: "barriers", title: "Remove the barriers", Component: Barriers },
    { id: "india", title: "India's law, step by step", Component: IndiaLaw },
    { id: "abroad", title: "Rules in other countries", Component: Abroad },
    { id: "check", title: "The blink test", checkpoint: "gov-accessibility", Component: LawCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
