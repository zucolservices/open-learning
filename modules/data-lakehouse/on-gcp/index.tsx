"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GcpState } from "./state";
import {
  AssembleGcp,
  GcpCost,
  GcpLayers,
  NamesCheck,
  TableCheck,
  TwoIcebergs,
  Wrap,
} from "./steps";

export default defineModule<GcpState>({
  initialState,
  steps: [
    { id: "layers", title: "The layers you know, Google Cloud edition", Component: GcpLayers },
    { id: "assemble", title: "Assemble Brewline on Google Cloud", Component: AssembleGcp },
    { id: "iceberg", title: "Two kinds of Iceberg table", Component: TwoIcebergs },
    { id: "table", title: "Which kind of table?", checkpoint: "gcp-table", Component: TableCheck },
    { id: "cost", title: "What will it cost?", Component: GcpCost },
    {
      id: "names",
      title: "Reading an old blog post",
      checkpoint: "gcp-names",
      Component: NamesCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
