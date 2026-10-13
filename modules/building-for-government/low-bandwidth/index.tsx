"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BwState } from "./state";
import { Bus, Slim, Reality, Channels, BwCheck, Wrap } from "./steps";

export default defineModule<BwState>({
  initialState,
  steps: [
    { id: "story", title: "The last bus to the village", Component: Bus },
    { id: "slim", title: "Slim the page, add channels", Component: Slim },
    { id: "reality", title: "The connections people have", Component: Reality },
    { id: "channels", title: "Beyond the web", Component: Channels },
    {
      id: "check",
      title: "Does it reach a phone without data?",
      checkpoint: "gov-low-bandwidth",
      Component: BwCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
