"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ExploreState } from "./state";
import { Detective, Session, TestingChecking, Heuristics, ExploreCheck, Wrap } from "./steps";

export default defineModule<ExploreState>({
  initialState,
  steps: [
    { id: "story", title: "The inspector and the detective", Component: Detective },
    { id: "session", title: "Run three time-boxed sessions", Component: Session },
    { id: "checking", title: "Testing versus checking", Component: TestingChecking },
    { id: "heuristics", title: "Heuristics: where bugs like to hide", Component: Heuristics },
    {
      id: "check",
      title: "Check or explore?",
      checkpoint: "testing-exploratory",
      Component: ExploreCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
