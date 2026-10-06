"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ForecastState } from "./state";
import { Milk, Forecasters, Decompose, Backtest, FairTest, Wrap } from "./steps";

export default defineModule<ForecastState>({
  initialState,
  steps: [
    { id: "story", title: "How much milk for next week?", Component: Milk },
    { id: "forecasters", title: "Race the forecasters", Component: Forecasters },
    { id: "decompose", title: "Trend, season and noise", Component: Decompose },
    { id: "backtest", title: "Test it like time runs forwards", Component: Backtest },
    { id: "check", title: "Fair test or peeking?", checkpoint: "fair-test", Component: FairTest },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
