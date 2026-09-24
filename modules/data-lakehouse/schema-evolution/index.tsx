"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SchemaState } from "./state";
import { FrontDesk } from "./steps-desk";
import { MondayIncident } from "./steps-incident";
import { ChangeMenu, SemiStructured, TypeSort, Wrap } from "./steps-more";

export default defineModule<SchemaState>({
  initialState,
  steps: [
    { id: "desk", title: "The front desk", Component: FrontDesk },
    {
      id: "incident",
      title: "The Monday incident",
      checkpoint: "diagnose",
      Component: MondayIncident,
    },
    { id: "changes", title: "The change menu", Component: ChangeMenu },
    { id: "types", title: "Safe type changes", checkpoint: "type-changes", Component: TypeSort },
    { id: "semi", title: "Semi-structured data", Component: SemiStructured },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
