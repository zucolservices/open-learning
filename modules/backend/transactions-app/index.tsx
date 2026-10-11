"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TxState } from "./state";
import { LastSeat, Race, Isolation, Idempotency, TxCheck, Wrap } from "./steps";

export default defineModule<TxState>({
  initialState,
  steps: [
    { id: "story", title: "The last seat on the bus", Component: LastSeat },
    { id: "race", title: "Two buyers, one chai", Component: Race },
    { id: "isolation", title: "Isolation levels and their defaults", Component: Isolation },
    { id: "idempotency", title: "Retries without double charges", Component: Idempotency },
    { id: "check", title: "Charged twice", checkpoint: "backend-transactions", Component: TxCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
