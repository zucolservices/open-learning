"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DbtState } from "./state";
import { Kitchen, BuildProject, RefDag, DataTests, WhichLayer, Wrap } from "./steps";

export default defineModule<DbtState>({
  initialState,
  steps: [
    { id: "story", title: "From raw ingredients to dishes", Component: Kitchen },
    { id: "build", title: "Lay out a dbt project", Component: BuildProject },
    { id: "ref", title: "ref() builds the graph", Component: RefDag },
    { id: "tests", title: "Tests on every model", Component: DataTests },
    { id: "check", title: "Which layer?", checkpoint: "dbt-layer", Component: WhichLayer },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
