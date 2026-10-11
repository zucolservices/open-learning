"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NamingState } from "./state";
import { Labels, Rename, Guidelines, Evidence, NamingCheck, Wrap } from "./steps";

export default defineModule<NamingState>({
  initialState,
  steps: [
    { id: "story", title: "Jars without labels", Component: Labels },
    { id: "rename", title: "Rename until the questions disappear", Component: Rename },
    { id: "habits", title: "Habits of good names", Component: Guidelines },
    { id: "evidence", title: "What the research says", Component: Evidence },
    { id: "check", title: "Pick the name", checkpoint: "clean-naming", Component: NamingCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
