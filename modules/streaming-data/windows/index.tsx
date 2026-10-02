"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WinState } from "./state";
import { LateData, Names, TollPlaza, WhichWindow, WindowLab, Wrap } from "./steps";

export default defineModule<WinState>({
  initialState,
  steps: [
    { id: "toll", title: "Counting at a toll plaza", Component: TollPlaza },
    { id: "lab", title: "One clickstream, four windows", Component: WindowLab },
    { id: "late", title: "Late data and when to emit", Component: LateData },
    { id: "names", title: "Same windows, different names", Component: Names },
    { id: "check", title: "Which window?", checkpoint: "which-window", Component: WhichWindow },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
