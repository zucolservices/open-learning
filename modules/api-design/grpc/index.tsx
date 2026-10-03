"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GrpcState } from "./state";
import { NumberedBoxes, Evolve, FourCalls, AroundGrpc, SafeChange, Wrap } from "./steps";

export default defineModule<GrpcState>({
  initialState,
  steps: [
    { id: "boxes", title: "A form with numbered boxes", Component: NumberedBoxes },
    { id: "evolve", title: "Change the message", Component: Evolve },
    { id: "calls", title: "Four kinds of call", Component: FourCalls },
    { id: "around", title: "Browsers, tools and CI", Component: AroundGrpc },
    { id: "check", title: "Safe change?", checkpoint: "proto-safe", Component: SafeChange },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
