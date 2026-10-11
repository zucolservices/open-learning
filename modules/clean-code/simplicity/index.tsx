"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SimpleState } from "./state";
import { Kitchen, ThreeDesigns, SimpleEasy, Gall, SimpleCheck, Wrap } from "./steps";

export default defineModule<SimpleState>({
  initialState,
  steps: [
    { id: "story", title: "The kitchen built for a banquet", Component: Kitchen },
    {
      id: "designs",
      title: "Build happy hour three ways, then change it",
      Component: ThreeDesigns,
    },
    { id: "easy", title: "Simple is not the same as easy", Component: SimpleEasy },
    { id: "gall", title: "Start simple, grow from there", Component: Gall },
    {
      id: "check",
      title: "Needed now, or YAGNI?",
      checkpoint: "clean-simple",
      Component: SimpleCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
