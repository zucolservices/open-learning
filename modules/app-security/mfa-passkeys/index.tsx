"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MfaState } from "./state";
import { RightDoor, RelayAttack, Factors, HowPasskeys, PhishingResistant, Wrap } from "./steps";

export default defineModule<MfaState>({
  initialState,
  steps: [
    { id: "story", title: "A key that fits one door", Component: RightDoor },
    { id: "relay", title: "Phish three kinds of MFA", Component: RelayAttack },
    { id: "factors", title: "Know, have, are", Component: Factors },
    { id: "passkeys", title: "How a passkey works", Component: HowPasskeys },
    {
      id: "check",
      title: "Phishing-resistant or not?",
      checkpoint: "phishing-resistant",
      Component: PhishingResistant,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
