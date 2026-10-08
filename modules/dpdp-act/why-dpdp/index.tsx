"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { LeakedList } from "./steps-story";
import { Runway, OldAndNew, Incidents, WhenCheck, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "A phone number on someone else's list", Component: LeakedList },
    { id: "runway", title: "What's in force when?", Component: Runway },
    { id: "old-new", title: "Old rules, new law", Component: OldAndNew },
    { id: "incidents", title: "Three incidents, three lessons", Component: Incidents },
    { id: "check", title: "Now, soon or later?", checkpoint: "dpdp-when", Component: WhenCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
