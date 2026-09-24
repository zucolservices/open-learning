"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UrlState } from "./state";
import { KeyScheme, LoadTest, Numbers, PredictSpace, Redirect, Wrap } from "./steps";

export default defineModule<UrlState>({
  initialState,
  steps: [
    { id: "numbers", title: "Short links, big numbers", Component: Numbers },
    { id: "keys", title: "Pick a key scheme", Component: KeyScheme },
    { id: "keyspace", title: "How many keys?", checkpoint: "keyspace", Component: PredictSpace },
    { id: "load-test", title: "Design it, then load-test it", Component: LoadTest },
    { id: "redirect", title: "301 or 302?", checkpoint: "redirect", Component: Redirect },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
