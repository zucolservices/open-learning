"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Avoided, ReadIt, CleanIt, MakeChange, Checklist, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "The module everyone avoids", Component: Avoided },
    { id: "read", title: "Read it like a detective", Component: ReadIt },
    {
      id: "clean",
      title: "Protect it with tests, then clean it in small steps",
      Component: CleanIt,
    },
    { id: "change", title: "Now the change is easy", Component: MakeChange },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    { id: "check", title: "In what order?", checkpoint: "clean-capstone", Component: CapCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
