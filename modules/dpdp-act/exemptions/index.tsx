"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ExState } from "./state";
import { AmbulanceStory, MatchExemption, DutyGrid, StateAndDebate, ExCheck, Wrap } from "./steps";

export default defineModule<ExState>({
  initialState,
  steps: [
    { id: "story", title: "The ambulance at the red light", Component: AmbulanceStory },
    { id: "match", title: "Which exemption, if any?", Component: MatchExemption },
    { id: "grid", title: "What each kind of exemption switches off", Component: DutyGrid },
    { id: "state", title: "The State's powers, and the debate", Component: StateAndDebate },
    { id: "check", title: "Exempt or not?", checkpoint: "dpdp-exemptions", Component: ExCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
