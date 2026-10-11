"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyTestState } from "./state";
import { FridayChange } from "./steps-story";
import { SafetyNets, WhatTestsGive, Escapes, WhyCheck, Wrap } from "./steps";

export default defineModule<WhyTestState>({
  initialState,
  steps: [
    { id: "story", title: "One line on a Friday", Component: FridayChange },
    { id: "nets", title: "Where is the bug found?", Component: SafetyNets },
    { id: "gives", title: "What tests give you, and what they don't", Component: WhatTestsGive },
    { id: "escapes", title: "When bugs escape", Component: Escapes },
    { id: "check", title: "Fact or myth?", checkpoint: "testing-why", Component: WhyCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
