"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NavState } from "./state";
import { Building, Stacks, BackButton, Links, NavCheck, Wrap } from "./steps";

export default defineModule<NavState>({
  initialState,
  steps: [
    { id: "story", title: "Rooms and corridors", Component: Building },
    { id: "stacks", title: "Fix the back button", Component: Stacks },
    { id: "back", title: "Back on each platform", Component: BackButton },
    { id: "links", title: "Links into the app", Component: Links },
    {
      id: "check",
      title: "Which kind of link?",
      checkpoint: "mobile-deep-links",
      Component: NavCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
