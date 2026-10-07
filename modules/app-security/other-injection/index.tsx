"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InjState } from "./state";
import { Messenger, FixThree, Interpreters, Cases, RootOrPatch, Wrap } from "./steps";

export default defineModule<InjState>({
  initialState,
  steps: [
    { id: "story", title: "One messenger, many languages", Component: Messenger },
    { id: "fix", title: "Fix three injections", Component: FixThree },
    { id: "interpreters", title: "Same mistake, everywhere", Component: Interpreters },
    { id: "cases", title: "When it went wrong", Component: Cases },
    {
      id: "check",
      title: "Root fix or patch?",
      checkpoint: "root-or-patch",
      Component: RootOrPatch,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
