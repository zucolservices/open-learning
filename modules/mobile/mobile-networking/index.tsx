"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NetState } from "./state";
import { Courier, Menu, Data, Secure, NetCheck, Wrap } from "./steps";

export default defineModule<NetState>({
  initialState,
  steps: [
    { id: "story", title: "The courier on a scooter", Component: Courier },
    { id: "menu", title: "Load the menu on a bad connection", Component: Menu },
    { id: "data", title: "Respecting the user's data", Component: Data },
    { id: "secure", title: "Secure by default", Component: Secure },
    { id: "check", title: "A safe retry", checkpoint: "mobile-retry", Component: NetCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
