"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConnectState } from "./state";
import { Bridges, MeshOrHub, Office, WhichConnection, Wrap } from "./steps";

export default defineModule<ConnectState>({
  initialState,
  steps: [
    { id: "bridges", title: "Bridges between islands", Component: Bridges },
    { id: "mesh", title: "Every pair, or a hub?", Component: MeshOrHub },
    { id: "office", title: "Reaching the office", Component: Office },
    {
      id: "which",
      title: "Which connection?",
      checkpoint: "which-connection",
      Component: WhichConnection,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
