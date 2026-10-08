"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GrievState } from "./state";
import { Refund, FollowComplaint, Nomination, PeoplesDuties, OrderCheck, Wrap } from "./steps";

export default defineModule<GrievState>({
  initialState,
  steps: [
    { id: "story", title: "The refund that never came", Component: Refund },
    { id: "path", title: "Follow a complaint to the Board", Component: FollowComplaint },
    { id: "nomination", title: "Someone to act for you", Component: Nomination },
    { id: "duties", title: "Duties run both ways", Component: PeoplesDuties },
    {
      id: "check",
      title: "Put the path in order",
      checkpoint: "dpdp-grievance",
      Component: OrderCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
