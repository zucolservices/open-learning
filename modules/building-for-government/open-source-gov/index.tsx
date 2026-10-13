"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OssState } from "./state";
import { Recipes, FiveYears, Policy, Goods, OssCheck, Wrap } from "./steps";

export default defineModule<OssState>({
  initialState,
  steps: [
    { id: "story", title: "The shared recipe book", Component: Recipes },
    { id: "years", title: "Build, buy or reuse: five years on", Component: FiveYears },
    { id: "policy", title: "India's open source policies", Component: Policy },
    { id: "goods", title: "Digital public goods", Component: Goods },
    { id: "check", title: "Myth or fact?", checkpoint: "gov-open-source", Component: OssCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
