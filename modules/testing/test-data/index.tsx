"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DataState } from "./state";
import { SharedKitchen, Convert, Patterns, Privacy, DataCheck, Wrap } from "./steps";

export default defineModule<DataState>({
  initialState,
  steps: [
    { id: "story", title: "The shared fridge", Component: SharedKitchen },
    { id: "convert", title: "Swap the shared fixture for builders", Component: Convert },
    { id: "patterns", title: "Mothers, builders and factories", Component: Patterns },
    { id: "privacy", title: "Keep real people out of your tests", Component: Privacy },
    { id: "check", title: "Good habit or trap?", checkpoint: "testing-data", Component: DataCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
