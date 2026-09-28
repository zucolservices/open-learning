"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChartsState } from "./state";
import { ChartMyths, FourCharts, Worm, Wrap } from "./steps";

export default defineModule<ChartsState>({
  initialState,
  steps: [
    { id: "worm", title: "Charts tell stories", Component: Worm },
    { id: "charts", title: "Four charts, four stories", Component: FourCharts },
    {
      id: "myths",
      title: "Reading or misreading?",
      checkpoint: "chart-myths",
      Component: ChartMyths,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
