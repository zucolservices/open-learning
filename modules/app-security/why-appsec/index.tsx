"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { OneWindow } from "./steps-story";
import { StopTheBreach, WaysIn, RiskWords, SortWords, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "One forgotten window", Component: OneWindow },
    { id: "stop", title: "Where could it have been stopped?", Component: StopTheBreach },
    { id: "ways", title: "How attackers get in", Component: WaysIn },
    { id: "words", title: "Vulnerability, threat, risk", Component: RiskWords },
    { id: "check", title: "Name it", checkpoint: "vuln-threat-risk", Component: SortWords },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
