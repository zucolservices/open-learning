"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OnlineState } from "./state";
import { AfterOpening, WatchProd, OfflineOnline, Privacy, WhichKind, Wrap } from "./steps";

export default defineModule<OnlineState>({
  initialState,
  steps: [
    { id: "story", title: "After opening night", Component: AfterOpening },
    { id: "watch", title: "Watch production", Component: WatchProd },
    { id: "offline-online", title: "Offline and online, together", Component: OfflineOnline },
    { id: "privacy", title: "Logs hold people's words", Component: Privacy },
    {
      id: "check",
      title: "Offline or online?",
      checkpoint: "offline-online",
      Component: WhichKind,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
