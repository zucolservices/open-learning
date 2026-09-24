"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GovernanceState } from "./state";
import { FourPeople, SideDoor, SideDoorCheck } from "./steps-access";
import { WhereDataGoes } from "./steps-story";
import {
  AnonymousSort,
  ControlsPlumbing,
  ErasureHunt,
  ErasurePlan,
  LawInBrief,
  Wrap,
} from "./steps-privacy";

export default defineModule<GovernanceState>({
  initialState,
  steps: [
    { id: "people", title: "One table, four people", Component: FourPeople },
    { id: "spread", title: "Where one person's data goes", Component: WhereDataGoes },
    { id: "side-door", title: "The side door", Component: SideDoor },
    {
      id: "side-door-check",
      title: "Where rules apply",
      checkpoint: "side-door",
      Component: SideDoorCheck,
    },
    { id: "controls", title: "Controls and plumbing", Component: ControlsPlumbing },
    { id: "law", title: "Privacy law, in brief", Component: LawInBrief },
    {
      id: "hunt",
      title: "Priya's erasure request",
      checkpoint: "erasure-hunt",
      Component: ErasureHunt,
    },
    { id: "plan", title: "The erasure plan", Component: ErasurePlan },
    {
      id: "anonymous",
      title: "Personal or anonymous?",
      checkpoint: "anonymous",
      Component: AnonymousSort,
    },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
