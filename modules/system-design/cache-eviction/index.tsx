"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type EvictionState } from "./state";
import { RedisOomCheck, WhatToThrowOut } from "./steps-evict";
import { HerdCheck, HotKeys, Jitter, ThunderingHerd, Tools, Wrap } from "./steps-stampede";

export default defineModule<EvictionState>({
  initialState,
  steps: [
    { id: "evict", title: "What to throw out?", Component: WhatToThrowOut },
    {
      id: "oom",
      title: "Why did Redis stop accepting writes?",
      checkpoint: "redis-oom",
      Component: RedisOomCheck,
    },
    { id: "herd", title: "The thundering herd", Component: ThunderingHerd },
    { id: "jitter", title: "Everything expires at once", Component: Jitter },
    { id: "hot", title: "Hot keys", Component: HotKeys },
    { id: "defence", title: "Pick the defence", checkpoint: "herd-defence", Component: HerdCheck },
    { id: "tools", title: "Caches you'll meet", Component: Tools },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
