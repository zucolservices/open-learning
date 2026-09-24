"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShardState } from "./state";
import {
  AddAServer,
  HotAndScattered,
  PhoneBook,
  PredictMove,
  RealSystems,
  ShardKeyCheck,
  Wrap,
} from "./steps";

export default defineModule<ShardState>({
  initialState,
  steps: [
    { id: "phone-book", title: "Split the phone book", Component: PhoneBook },
    { id: "ring", title: "Add a server", Component: AddAServer },
    { id: "predict", title: "How much moves?", checkpoint: "mod-move", Component: PredictMove },
    { id: "hot", title: "Hot keys and scattered queries", Component: HotAndScattered },
    { id: "key", title: "Pick the shard key", checkpoint: "shard-key", Component: ShardKeyCheck },
    { id: "systems", title: "Sharding you'll meet", Component: RealSystems },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
