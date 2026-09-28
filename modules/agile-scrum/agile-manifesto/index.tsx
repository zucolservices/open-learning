"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ManifestoState } from "./state";
import {
  FourValues,
  Principles,
  Reflections,
  Snowbird,
  WhichPrinciple,
  Wrap,
  SaysOrMyth,
} from "./steps";

export default defineModule<ManifestoState>({
  initialState,
  steps: [
    { id: "snowbird", title: "Seventeen people at a ski lodge", Component: Snowbird },
    { id: "values", title: "Four values, weighed", Component: FourValues },
    { id: "principles", title: "Twelve principles", Component: Principles },
    { id: "myths", title: "Says it, or myth?", checkpoint: "says-or-myth", Component: SaysOrMyth },
    {
      id: "which",
      title: "Which principle is it?",
      checkpoint: "which-principle",
      Component: WhichPrinciple,
    },
    { id: "reflections", title: "What the authors said later", Component: Reflections },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
