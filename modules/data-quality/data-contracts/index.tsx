"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContractState } from "./state";
import { Tenancy, WriteContract, Origins, DbtContracts, InContract, Wrap } from "./steps";

export default defineModule<ContractState>({
  initialState,
  steps: [
    { id: "story", title: "The tenancy agreement", Component: Tenancy },
    { id: "write", title: "Write a contract", Component: WriteContract },
    { id: "origins", title: "Where contracts came from", Component: Origins },
    { id: "dbt", title: "Contracts inside a project", Component: DbtContracts },
    {
      id: "check",
      title: "In the contract or not?",
      checkpoint: "in-contract",
      Component: InContract,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
