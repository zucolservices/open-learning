"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DocState } from "./state";
import { Seal, Application, Locker, Signatures, DocCheck, Wrap } from "./steps";

export default defineModule<DocState>({
  initialState,
  steps: [
    { id: "story", title: "The notary's stamp", Component: Seal },
    { id: "application", title: "One application, two ways", Component: Application },
    { id: "locker", title: "How DigiLocker works", Component: Locker },
    { id: "signatures", title: "eSign and digital signatures", Component: Signatures },
    { id: "check", title: "Can it be e-signed?", checkpoint: "gov-esign", Component: DocCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
