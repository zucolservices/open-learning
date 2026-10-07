/** A lookalike-site relay attack against different second factors. Domains are .example placeholders. */

export type Method = "none" | "sms" | "app" | "push" | "number" | "passkey";

export const METHODS: { id: Method; name: string }[] = [
  { id: "none", name: "Password only" },
  { id: "sms", name: "SMS code" },
  { id: "app", name: "Authenticator app code" },
  { id: "push", name: "Push “Approve?”" },
  { id: "number", name: "Push with number matching" },
  { id: "passkey", name: "Passkey" },
];

export interface Run {
  steps: [string, "ok" | "bad" | "stop"][];
  verdict: string;
  phished: boolean;
}

export function attack(m: Method): Run {
  const start: [string, "ok" | "bad" | "stop"][] = [
    ["Asha clicks a link to yourbank-login.example, a perfect copy of yourbank.example", "bad"],
  ];
  if (m === "passkey") {
    return {
      steps: [
        ...start,
        ["The fake page asks the browser for Asha's passkey", "ok"],
        ["The browser has passkeys only for yourbank.example, so it offers nothing here", "stop"],
      ],
      verdict:
        "Nothing to steal: the passkey only works on the real site, and Asha never typed a secret.",
      phished: false,
    };
  }
  const steps: [string, "ok" | "bad" | "stop"][] = [
    ...start,
    ["Asha types the password; the fake site relays it to the real bank instantly", "bad"],
  ];
  if (m === "none") {
    steps.push(["The real bank logs the attacker in", "bad"]);
    return { steps, verdict: "Account taken over with the password alone.", phished: true };
  }
  if (m === "sms" || m === "app") {
    steps.push([
      `The bank asks for a code; Asha reads it from the ${m === "sms" ? "SMS" : "app"} and types it into the fake page`,
      "bad",
    ]);
    steps.push([
      "The fake site relays the code within its 30-second window and keeps the session cookie",
      "bad",
    ]);
    return {
      steps,
      verdict:
        m === "sms"
          ? "Phished. SMS also adds SIM-swap risk: a criminal can talk the carrier into moving Asha's number."
          : "Phished. Codes stop password reuse, but anything a person types can be relayed.",
      phished: true,
    };
  }
  if (m === "push") {
    steps.push([
      "Asha's phone shows “Approve sign-in?” while Asha is on what looks like the bank",
      "bad",
    ]);
    steps.push(["Asha taps Approve; the attacker's session is the one approved", "bad"]);
    return {
      steps,
      verdict:
        "Phished. Push without context also invites “MFA fatigue”: prompts until someone taps yes.",
      phished: true,
    };
  }
  steps.push([
    "The fake page shows the number the bank displayed to the attacker; Asha types it into the app",
    "bad",
  ]);
  steps.push(["Approved: number matching stops random prompts, but not a live relay", "bad"]);
  return {
    steps,
    verdict:
      "Phished. Number matching beats fatigue attacks, yet it still isn't phishing-resistant.",
    phished: true,
  };
}

export const PASSKEY_STEPS: [string, string][] = [
  [
    "Sign up",
    "Asha's device creates a key pair for yourbank.example. The private key stays on that device or password manager; the bank stores only the public key.",
  ],
  [
    "Sign in",
    "The bank sends a random challenge. The device signs it after a fingerprint, face or PIN; the browser adds which site asked.",
  ],
  [
    "Check",
    "The bank verifies the signature with the public key. No shared secret ever crossed the network.",
  ],
  [
    "Lookalike site",
    "yourbank-login.example asks for a passkey. None exists for that name, so the browser offers nothing.",
  ],
];
