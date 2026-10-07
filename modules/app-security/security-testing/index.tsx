"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TestState } from "./state";
import { Inspections, Pipeline, LayersFacts, PeopleTests, CatchIt, Wrap } from "./steps";

export default defineModule<TestState>({
  initialState,
  steps: [
    { id: "story", title: "Different inspectors", Component: Inspections },
    { id: "pipeline", title: "Build a testing pipeline", Component: Pipeline },
    { id: "layers", title: "Why layer them", Component: LayersFacts },
    { id: "people", title: "Where people still win", Component: PeopleTests },
    { id: "check", title: "Which test catches it?", checkpoint: "which-test", Component: CatchIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
