"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SvcState } from "./state";
import { FindByName, FollowLabels, PhoneNumber, ServiceTypes, WhichType, Wrap } from "./steps";

export default defineModule<SvcState>({
  initialState,
  steps: [
    { id: "phone", title: "One phone number", Component: PhoneNumber },
    { id: "labels", title: "Follow the labels", Component: FollowLabels },
    { id: "dns", title: "Find it by name", Component: FindByName },
    { id: "types", title: "Five kinds of Service", Component: ServiceTypes },
    { id: "check", title: "Which type?", checkpoint: "which-service-type", Component: WhichType },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
