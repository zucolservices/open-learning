"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AwsState } from "./state";
import { AssembleAws, AwsCost, AwsLayers, BillCheck, CatalogCheck, Wrap } from "./steps";

export default defineModule<AwsState>({
  initialState,
  steps: [
    { id: "layers", title: "The layers you know, AWS edition", Component: AwsLayers },
    { id: "assemble", title: "Assemble Brewline on AWS", Component: AssembleAws },
    {
      id: "catalog",
      title: "Many engines, one set of tables",
      checkpoint: "aws-catalog",
      Component: CatalogCheck,
    },
    { id: "cost", title: "What will it cost?", Component: AwsCost },
    { id: "bill", title: "The surprising bill", checkpoint: "aws-bill", Component: BillCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
