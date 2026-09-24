"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReplicationState } from "./state";
import { LagCheck, SyncOrAsync, WhereDidItGo } from "./steps-lag";
import { Failover, Topologies } from "./steps-failover";
import { FailoverCheck, Managed, Wrap } from "./steps-more";

export default defineModule<ReplicationState>({
  initialState,
  steps: [
    { id: "lag", title: "Where did my change go?", Component: WhereDidItGo },
    { id: "sync", title: "Wait for the copy, or not?", Component: SyncOrAsync },
    {
      id: "photo",
      title: "The disappearing photo",
      checkpoint: "disappearing-photo",
      Component: LagCheck,
    },
    { id: "failover", title: "When the leader dies", Component: Failover },
    { id: "topologies", title: "Three shapes of replication", Component: Topologies },
    {
      id: "missing",
      title: "The missing orders",
      checkpoint: "missing-orders",
      Component: FailoverCheck,
    },
    { id: "managed", title: "Replication you'll meet", Component: Managed },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
