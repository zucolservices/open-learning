"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WorkloadIdState } from "./state";
import { Badges, CiTrust, LeakedKey, NoKeys, People, SwapTheKey, Wrap } from "./steps";

export default defineModule<WorkloadIdState>({
  initialState,
  steps: [
    { id: "badges", title: "House keys and visitor badges", Component: Badges },
    { id: "leak", title: "Follow a leaked key", Component: LeakedKey },
    { id: "nokeys", title: "Credentials without keys", Component: NoKeys },
    { id: "ci", title: "A pipeline without secrets", Component: CiTrust },
    { id: "people", title: "One login for people", Component: People },
    { id: "swap", title: "Swap the key", checkpoint: "swap-the-key", Component: SwapTheKey },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
