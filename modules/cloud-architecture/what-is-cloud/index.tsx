"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhatIsCloudState } from "./state";
import { CupboardToCloud } from "./steps-story";
import { OwnOrRent, SortServices, WhoManages, Wrap } from "./steps";

export default defineModule<WhatIsCloudState>({
  initialState,
  steps: [
    { id: "story", title: "From a cupboard to the cloud", Component: CupboardToCloud },
    { id: "layers", title: "Who manages what", Component: WhoManages },
    { id: "own-rent", title: "Own or rent?", Component: OwnOrRent },
    {
      id: "sort",
      title: "IaaS, PaaS or SaaS?",
      checkpoint: "service-models",
      Component: SortServices,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
