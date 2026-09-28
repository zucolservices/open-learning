"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ScrumPageState } from "./state";
import { GuideOrAddOn, OnePage, Relay, Timebox, Wrap } from "./steps";

export default defineModule<ScrumPageState>({
  initialState,
  steps: [
    { id: "relay", title: "A relay, or a rugby team?", Component: Relay },
    { id: "one-page", title: "Scrum on one page", Component: OnePage },
    {
      id: "in-guide",
      title: "In the guide, or added on?",
      checkpoint: "guide-or-addon",
      Component: GuideOrAddOn,
    },
    {
      id: "timebox",
      title: "How long is Sprint Planning?",
      checkpoint: "timebox",
      Component: Timebox,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
