"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type BoundState } from "./state";
import { Socket, WrapSdk, Architectures, FunctionalCore, BoundCheck, Wrap } from "./steps";

export default defineModule<BoundState>({
  initialState,
  steps: [
    { id: "story", title: "A wall socket, not wiring", Component: Socket },
    {
      id: "wrap-sdk",
      title: "Put a port between checkout and the payment provider",
      Component: WrapSdk,
    },
    { id: "architectures", title: "One idea, several names", Component: Architectures },
    { id: "core", title: "Functional core, imperative shell", Component: FunctionalCore },
    { id: "check", title: "Core or edge?", checkpoint: "clean-boundaries", Component: BoundCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
