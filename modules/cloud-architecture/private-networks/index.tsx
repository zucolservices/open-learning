"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type NetState } from "./state";
import { AddressRanges, Carve, Firewalls, HousingSociety, Routes, SgOrNacl, Wrap } from "./steps";

export default defineModule<NetState>({
  initialState,
  steps: [
    { id: "society", title: "A housing society", Component: HousingSociety },
    { id: "ranges", title: "Address ranges, live", Component: AddressRanges },
    { id: "carve", title: "Carve the network", Component: Carve },
    { id: "routes", title: "Write the route tables", Component: Routes },
    { id: "firewalls", title: "Guards at the door", Component: Firewalls },
    {
      id: "sg-nacl",
      title: "Security group or network ACL?",
      checkpoint: "sg-nacl",
      Component: SgOrNacl,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
