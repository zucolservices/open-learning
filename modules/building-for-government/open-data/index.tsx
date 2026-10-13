"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OpenState } from "./state";
import { Noticeboard, Prepare, Portals, Rti, OpenCheck, Wrap } from "./steps";

export default defineModule<OpenState>({
  initialState,
  steps: [
    { id: "story", title: "The panchayat noticeboard", Component: Noticeboard },
    { id: "prepare", title: "Prepare a dataset for publication", Component: Prepare },
    { id: "portals", title: "Open data policy and portals", Component: Portals },
    { id: "rti", title: "Transparency by law", Component: Rti },
    {
      id: "check",
      title: "Publish or hold back?",
      checkpoint: "gov-open-data",
      Component: OpenCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
