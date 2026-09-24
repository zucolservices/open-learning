"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AzureState } from "./state";
import {
  AssembleAzure,
  AzureCost,
  AzureLayers,
  IdleCheck,
  MirrorCheck,
  Shortcuts,
  Wrap,
} from "./steps";

export default defineModule<AzureState>({
  initialState,
  steps: [
    { id: "layers", title: "The layers you know, Azure edition", Component: AzureLayers },
    { id: "assemble", title: "Assemble Brewline on Azure", Component: AssembleAzure },
    { id: "shortcuts", title: "Shortcuts: data without copies", Component: Shortcuts },
    {
      id: "mirror",
      title: "Databricks and Fabric, one set of tables",
      checkpoint: "azure-mirror",
      Component: MirrorCheck,
    },
    { id: "cost", title: "What will it cost?", Component: AzureCost },
    { id: "idle", title: "The idle capacity", checkpoint: "azure-idle", Component: IdleCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
