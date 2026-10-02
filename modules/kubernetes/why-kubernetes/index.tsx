"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { TwentyServers } from "./steps-story";
import { IsIsnt, WhoWorks, WorthIt, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "Twenty servers", Component: TwentyServers },
    { id: "work", title: "Who does the work?", Component: WhoWorks },
    { id: "is", title: "What it is, and isn't", Component: IsIsnt },
    { id: "check", title: "Worth it?", checkpoint: "worth-it", Component: WorthIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
