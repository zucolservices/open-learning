"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OwnState } from "./state";
import { Garden, Assign, Roles, Mesh, WhoDoesIt, Wrap } from "./steps";

export default defineModule<OwnState>({
  initialState,
  steps: [
    { id: "story", title: "The shared garden", Component: Garden },
    { id: "assign", title: "Assign owners, route incidents", Component: Assign },
    { id: "roles", title: "Owners, stewards and RACI", Component: Roles },
    { id: "mesh", title: "Ownership by domain", Component: Mesh },
    { id: "check", title: "Who does it?", checkpoint: "who-does-it", Component: WhoDoesIt },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
