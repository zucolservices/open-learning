"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GwState } from "./state";
import { Reception, BuildGateway, FirstCall, Landscape, WhereItGoes, Wrap } from "./steps";

export default defineModule<GwState>({
  initialState,
  steps: [
    { id: "reception", title: "The reception desk", Component: Reception },
    { id: "gateway", title: "Put up a gateway", Component: BuildGateway },
    { id: "firstcall", title: "Time to first call", Component: FirstCall },
    { id: "landscape", title: "Gateways, portals and agents", Component: Landscape },
    {
      id: "check",
      title: "Gateway or service?",
      checkpoint: "where-it-goes",
      Component: WhereItGoes,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
