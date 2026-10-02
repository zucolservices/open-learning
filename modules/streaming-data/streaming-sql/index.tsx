"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SqlState } from "./state";
import { AppendOrUpdate, Engines, Live, Scoreboard, Wrap } from "./steps";

export default defineModule<SqlState>({
  initialState,
  steps: [
    { id: "scoreboard", title: "A scoreboard, not a scorecard", Component: Scoreboard },
    { id: "live", title: "A query that never finishes", Component: Live },
    { id: "engines", title: "Streaming SQL engines", Component: Engines },
    {
      id: "check",
      title: "Append or update?",
      checkpoint: "append-or-update",
      Component: AppendOrUpdate,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
