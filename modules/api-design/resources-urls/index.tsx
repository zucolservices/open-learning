"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UrlState } from "./state";
import { Addresses, FixEndpoints, GuidesDisagree, Hypermedia, GoodOrFix, Wrap } from "./steps";

export default defineModule<UrlState>({
  initialState,
  steps: [
    { id: "addresses", title: "An address for every thing", Component: Addresses },
    { id: "fix", title: "Tidy the library", Component: FixEndpoints },
    { id: "guides", title: "When guides disagree", Component: GuidesDisagree },
    { id: "hypermedia", title: "Links, the part most skip", Component: Hypermedia },
    {
      id: "check",
      title: "Good URL or needs fixing?",
      checkpoint: "good-url",
      Component: GoodOrFix,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
