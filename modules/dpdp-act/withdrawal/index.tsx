"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WithdrawState } from "./state";
import {
  LeavingTheGym,
  StopSignal,
  ConsentManagers,
  ComparableEase,
  WithdrawCheck,
  Wrap,
} from "./steps";

export default defineModule<WithdrawState>({
  initialState,
  steps: [
    { id: "story", title: "Joining is one tap. Leaving?", Component: LeavingTheGym },
    { id: "signal", title: "Follow the stop signal", Component: StopSignal },
    { id: "managers", title: "One place to manage every yes", Component: ConsentManagers },
    { id: "ease", title: "Is the way out as easy as the way in?", Component: ComparableEase },
    {
      id: "check",
      title: "Stop or carry on?",
      checkpoint: "dpdp-withdraw",
      Component: WithdrawCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
