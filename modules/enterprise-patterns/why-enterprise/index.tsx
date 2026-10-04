"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WhyState } from "./state";
import { AddressChange } from "./steps-story";
import { WireThem, ThreeSpeeds, ByNumbers, WhichLayer, Wrap } from "./steps";

export default defineModule<WhyState>({
  initialState,
  steps: [
    { id: "story", title: "One address change", Component: AddressChange },
    { id: "wire", title: "Wire them together", Component: WireThem },
    { id: "speeds", title: "Three speeds of change", Component: ThreeSpeeds },
    { id: "numbers", title: "By the numbers", Component: ByNumbers },
    { id: "check", title: "Which layer?", checkpoint: "which-layer", Component: WhichLayer },
    { id: "wrap", title: "What's ahead", Component: Wrap },
  ],
});
