"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CfgState } from "./state";
import { ChangeSetting, SameImage, WhatProtects, WhereGoes, Wrap } from "./steps";

export default defineModule<CfgState>({
  initialState,
  steps: [
    { id: "image", title: "Same image, every environment", Component: SameImage },
    { id: "change", title: "Change a setting", Component: ChangeSetting },
    { id: "protect", title: "What a Secret really protects", Component: WhatProtects },
    { id: "check", title: "Where does it go?", checkpoint: "where-config", Component: WhereGoes },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
