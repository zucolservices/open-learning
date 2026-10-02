"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DesiredState } from "./state";
import { ComeBack, Heal, SpecStatus, Thermostat, Wrap } from "./steps";

export default defineModule<DesiredState>({
  initialState,
  steps: [
    { id: "thermostat", title: "The thermostat", Component: Thermostat },
    { id: "heal", title: "Break it, watch it heal", Component: Heal },
    { id: "spec", title: "Spec and status", Component: SpecStatus },
    { id: "check", title: "Will it come back?", checkpoint: "come-back", Component: ComeBack },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
