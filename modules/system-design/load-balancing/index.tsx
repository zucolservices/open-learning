"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LbState } from "./state";
import { Algorithms, HostAtTheDoor, SlowServerCheck } from "./steps-basics";
import { HealthChecks, OnEachCloud, Redundancy, StickyCheck, Wrap } from "./steps-more";

export default defineModule<LbState>({
  initialState,
  steps: [
    { id: "host", title: "The host at the door", Component: HostAtTheDoor },
    { id: "algorithms", title: "Round robin, or something smarter?", Component: Algorithms },
    { id: "slow", title: "One slow server", checkpoint: "slow-server", Component: SlowServerCheck },
    { id: "health", title: "How fast is a failure noticed?", Component: HealthChecks },
    { id: "redundancy", title: "Who balances the balancer?", Component: Redundancy },
    { id: "sticky", title: "Sticky sessions", checkpoint: "sticky", Component: StickyCheck },
    { id: "clouds", title: "Load balancers you'll meet", Component: OnEachCloud },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
