"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type QueueState } from "./state";
import { TicketRail } from "./steps-story";
import { Landscape, Ordering, Poison, PredictGroup, QueueOrLog, TicketSale, Wrap } from "./steps";

export default defineModule<QueueState>({
  initialState,
  steps: [
    { id: "rail", title: "The ticket rail", Component: TicketRail },
    { id: "sale", title: "The ticket sale", Component: TicketSale },
    {
      id: "group",
      title: "How many sit idle?",
      checkpoint: "idle-consumers",
      Component: PredictGroup,
    },
    { id: "ordering", title: "Deposit before withdrawal", Component: Ordering },
    { id: "poison", title: "The poison message", Component: Poison },
    { id: "sort", title: "Queue or log?", checkpoint: "queue-or-log", Component: QueueOrLog },
    { id: "landscape", title: "Queues and logs you'll meet", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
