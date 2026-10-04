"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PlanState } from "./state";
import { Wedding, Strategies, TodoList, CheckPlans, PlanOrNot, Wrap } from "./steps";

export default defineModule<PlanState>({
  initialState,
  steps: [
    { id: "story", title: "Planning a wedding", Component: Wedding },
    { id: "strategies", title: "Plan first or as you go", Component: Strategies },
    { id: "todo", title: "The living to-do list", Component: TodoList },
    { id: "check-plans", title: "Plans need checking", Component: CheckPlans },
    { id: "check", title: "Plan up front?", checkpoint: "plan-or-not", Component: PlanOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
