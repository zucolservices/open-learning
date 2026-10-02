"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GateState } from "./state";
import { BothGreen, MachinesOrPeople, SetRules, WhoApproves, Wrap } from "./steps";

export default defineModule<GateState>({
  initialState,
  steps: [
    { id: "rules", title: "Set the rules for main", Component: SetRules },
    { id: "green", title: "Two changes, both green", Component: BothGreen },
    {
      id: "check",
      title: "Machines or people?",
      checkpoint: "machines-or-people",
      Component: MachinesOrPeople,
    },
    { id: "approve", title: "Who should approve?", Component: WhoApproves },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
