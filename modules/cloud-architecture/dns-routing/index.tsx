"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DnsState } from "./state";
import { Enquiry, FailoverTime, PickPolicy, PrivateAndEdge, RouteUsers, Wrap } from "./steps";

export default defineModule<DnsState>({
  initialState,
  steps: [
    { id: "enquiry", title: "The enquiry counter", Component: Enquiry },
    { id: "route", title: "Send users to a region", Component: RouteUsers },
    { id: "failover", title: "How long does failover take?", Component: FailoverTime },
    { id: "private", title: "Private names and the edge", Component: PrivateAndEdge },
    {
      id: "pick",
      title: "Which routing policy?",
      checkpoint: "routing-policy",
      Component: PickPolicy,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
