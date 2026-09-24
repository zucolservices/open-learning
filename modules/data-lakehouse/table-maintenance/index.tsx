"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MaintenanceState } from "./state";
import { MaintenancePolicy, PhotoLibrary } from "./steps-sim";
import { SixMonths } from "./steps-story";
import { FourJobs, LetThePlatform, RetentionCheck, StorageBill, Wrap } from "./steps-more";

export default defineModule<MaintenanceState>({
  initialState,
  steps: [
    { id: "phone", title: "Why is my phone full?", Component: PhotoLibrary },
    { id: "six-months", title: "Six months in a table's life", Component: SixMonths },
    { id: "policy", title: "Set the policy", Component: MaintenancePolicy },
    { id: "jobs", title: "The four jobs", Component: FourJobs },
    {
      id: "bill",
      title: "The bill that tripled",
      checkpoint: "storage-bill",
      Component: StorageBill,
    },
    { id: "retention", title: "How far back?", checkpoint: "retention", Component: RetentionCheck },
    { id: "platform", title: "Let the platform do it", Component: LetThePlatform },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
