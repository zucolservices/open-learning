"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GwState } from "./state";
import { Reception, RouteRequests, ToGateway, WhoOwns, Wrap } from "./steps";

export default defineModule<GwState>({
  initialState,
  steps: [
    { id: "reception", title: "One reception desk", Component: Reception },
    { id: "route", title: "Route the requests", Component: RouteRequests },
    { id: "gateway", title: "From Ingress to Gateway", Component: ToGateway },
    { id: "check", title: "Who owns it?", checkpoint: "who-owns-gateway", Component: WhoOwns },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
