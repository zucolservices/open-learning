"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TlsState } from "./state";
import { Postcard, CafeWifi, Handshake, CryptoChoices, StrongCrypto, Wrap } from "./steps";

export default defineModule<TlsState>({
  initialState,
  steps: [
    { id: "story", title: "Postcard or sealed letter", Component: Postcard },
    { id: "wifi", title: "On the café Wi-Fi", Component: CafeWifi },
    { id: "handshake", title: "How TLS sets up", Component: Handshake },
    { id: "crypto", title: "Good and broken choices", Component: CryptoChoices },
    {
      id: "check",
      title: "Strong or broken?",
      checkpoint: "crypto-choice",
      Component: StrongCrypto,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
