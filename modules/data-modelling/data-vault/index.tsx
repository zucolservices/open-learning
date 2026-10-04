"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DVState } from "./state";
import { Ledger, LoadVault, HashKeys, VaultThenMarts, HubLinkSat, Wrap } from "./steps";

export default defineModule<DVState>({
  initialState,
  steps: [
    { id: "story", title: "Never rub anything out", Component: Ledger },
    { id: "load", title: "Load a vault", Component: LoadVault },
    { id: "hash", title: "Why hash keys?", Component: HashKeys },
    { id: "layers", title: "Vault, then marts", Component: VaultThenMarts },
    {
      id: "check",
      title: "Hub, link or satellite?",
      checkpoint: "hub-link-sat",
      Component: HubLinkSat,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
