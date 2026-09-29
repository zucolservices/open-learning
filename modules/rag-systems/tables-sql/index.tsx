"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TablesState } from "./state";
import {
  Leash,
  Ledger,
  RightQueryWrongAnswer,
  Route,
  SearchCantCount,
  WriteSql,
  Wrap,
} from "./steps";

export default defineModule<TablesState>({
  initialState,
  steps: [
    { id: "ledger", title: "The ledger, not the filing cabinet", Component: Ledger },
    { id: "count", title: "Search can't count", Component: SearchCantCount },
    { id: "sql", title: "Let the model write SQL", Component: WriteSql },
    { id: "route", title: "Route the question", checkpoint: "route-question", Component: Route },
    { id: "units", title: "Right query, wrong answer", Component: RightQueryWrongAnswer },
    { id: "leash", title: "Keep the SQL on a leash", Component: Leash },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
