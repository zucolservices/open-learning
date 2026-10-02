"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CryptoState } from "./state";
import { Envelope, LockedBoxes, RotateRevoke, Secrets, WhatOpens, WhoHolds, Wrap } from "./steps";

export default defineModule<CryptoState>({
  initialState,
  steps: [
    { id: "boxes", title: "Boxes, keys and the bank", Component: LockedBoxes },
    { id: "envelope", title: "Encrypt a file like the cloud does", Component: Envelope },
    { id: "rotate", title: "Rotate, disable, delete", Component: RotateRevoke },
    { id: "who", title: "Who holds the key?", Component: WhoHolds },
    { id: "secrets", title: "Where secrets belong", Component: Secrets },
    { id: "opens", title: "What still opens?", checkpoint: "what-opens", Component: WhatOpens },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
