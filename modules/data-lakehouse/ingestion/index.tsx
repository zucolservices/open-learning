"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type IngestionState } from "./state";
import { EventJourney } from "./steps-story";
import { ThreeDeliveries, TriggerCheck, TuneWriter } from "./steps-sim";
import { CheckpointTrap, ExactlyOnce, Tools, Wrap } from "./steps-more";

export default defineModule<IngestionState>({
  initialState,
  steps: [
    { id: "journey", title: "One event's journey", Component: EventJourney },
    { id: "deliveries", title: "Three ways to deliver", Component: ThreeDeliveries },
    { id: "tune", title: "Tune a streaming writer", Component: TuneWriter },
    { id: "trigger", title: "Pick a trigger", checkpoint: "pick-trigger", Component: TriggerCheck },
    { id: "exactly-once", title: "Exactly once", Component: ExactlyOnce },
    {
      id: "checkpoint-trap",
      title: "The deleted checkpoint",
      checkpoint: "deleted-checkpoint",
      Component: CheckpointTrap,
    },
    { id: "tools", title: "The toolbox", Component: Tools },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
