"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DpiState } from "./state";
import { Roads, Loan, World, Scale, DpiCheck, Wrap } from "./steps";

export default defineModule<DpiState>({
  initialState,
  steps: [
    { id: "story", title: "Roads, not cars", Component: Roads },
    { id: "loan", title: "Assemble a loan from shared rails", Component: Loan },
    { id: "world", title: "DPI around the world", Component: World },
    { id: "scale", title: "Scale, and the cautions", Component: Scale },
    { id: "check", title: "Rail or vehicle?", checkpoint: "gov-dpi", Component: DpiCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
