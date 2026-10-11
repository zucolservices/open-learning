/** Five ways a made-up café app could sign customers in, step by step, and what a database leak reveals. */

export type Method = "plain" | "fast" | "argon" | "passkey" | "oidc";

export const METHODS: {
  id: Method;
  label: string;
  steps: string[];
  stored: string;
  leak: string;
  good: boolean;
}[] = [
  {
    id: "plain",
    label: "Password, stored as is",
    steps: [
      "Asha types their password",
      "The server compares it with the stored password",
      "Match: create a session",
    ],
    stored: "The password itself",
    leak: "Every password readable immediately, and many are reused on other sites.",
    good: false,
  },
  {
    id: "fast",
    label: "Password, fast hash",
    steps: [
      "Asha types their password",
      "The server hashes it with a fast general-purpose hash",
      "Compare with the stored hash; match: create a session",
    ],
    stored: "A fast hash (for example SHA-256)",
    leak: "Attackers can try billions of guesses a second on a graphics card; common passwords fall in minutes.",
    good: false,
  },
  {
    id: "argon",
    label: "Password, Argon2id",
    steps: [
      "Asha types their password",
      "The server runs Argon2id with their random salt: deliberately slow and memory-hungry",
      "Compare; match: create a new session ID",
    ],
    stored: "A salted, slow Argon2id hash",
    leak: "Each guess costs real time and memory, so only weak passwords are at risk. Still: check new passwords against breached lists.",
    good: true,
  },
  {
    id: "passkey",
    label: "Passkey",
    steps: [
      "The server sends a random challenge",
      "Asha's device signs it with a private key that never leaves it, after a fingerprint or PIN",
      "The server checks the signature with the stored public key; create a session",
    ],
    stored: "A public key",
    leak: "Nothing reusable: a public key can't be used to sign in. Passkeys are also tied to the real site, so they resist phishing.",
    good: true,
  },
  {
    id: "oidc",
    label: "Sign in with a provider",
    steps: [
      "The app redirects Asha to an identity provider they trust",
      "They sign in there; the provider redirects back with a one-time code",
      "The server exchanges the code for an ID token, checks it, and creates a session",
    ],
    stored: "The provider's user ID, no password",
    leak: "No passwords to leak; protecting the account is the provider's job.",
    good: true,
  },
];
