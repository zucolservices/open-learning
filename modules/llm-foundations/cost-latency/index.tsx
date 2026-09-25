"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CostState } from "./state";
import {
  Calculator,
  FirstMove,
  LatencyBudget,
  Levers,
  PredictBill,
  RentOrPay,
  TwoMeters,
  Wrap,
} from "./steps";

export default defineModule<CostState>({
  initialState,
  steps: [
    { id: "meters", title: "Two meters running", Component: TwoMeters },
    {
      id: "predict",
      title: "Estimate a monthly bill",
      checkpoint: "monthly-bill",
      Component: PredictBill,
    },
    { id: "calculator", title: "What will the feature cost?", Component: Calculator },
    { id: "levers", title: "Cutting the bill", Component: Levers },
    { id: "latency", title: "Will it feel fast?", Component: LatencyBudget },
    { id: "rent", title: "Rent GPUs or pay per token?", Component: RentOrPay },
    { id: "first", title: "The first move", checkpoint: "first-move", Component: FirstMove },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
