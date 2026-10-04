"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { TwoCalls } from "./steps-story";
import { FeelTheGap, History, Uses, HowItFeels, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "Two phone calls", Component: TwoCalls },
    { id: "gap", title: "Feel the gap", Component: FeelTheGap },
    { id: "history", title: "From phone menus to talking AI", Component: History },
    { id: "uses", title: "Where voice AI is used", Component: Uses },
    { id: "check", title: "How would it feel?", checkpoint: "gap-feel", Component: HowItFeels },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
