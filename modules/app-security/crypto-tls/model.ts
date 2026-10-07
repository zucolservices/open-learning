/** What a network eavesdropper sees over plain HTTP vs HTTPS, a TLS handshake, and crypto choices. */

export interface Line {
  label: string;
  http: string;
  https: string;
}

export const TRAFFIC: Line[] = [
  { label: "Site you're visiting", http: "yourbank.example", https: "yourbank.example" },
  { label: "Page and form fields", http: "/login  user=asha  pass=hunter2", https: "⟨encrypted⟩" },
  { label: "Session cookie", http: "sid=8f3c91…", https: "⟨encrypted⟩" },
  { label: "What you downloaded", http: "balance: ₹48,210", https: "⟨encrypted⟩" },
];

export const HANDSHAKE: [string, string][] = [
  [
    "Hello",
    "Your browser lists the TLS versions and ciphers it supports and sends a random number.",
  ],
  [
    "Certificate",
    "The server sends its certificate: its name, its public key, and a signature from a certificate authority the browser trusts.",
  ],
  [
    "Check the certificate",
    "The browser checks the signature chain, that the name matches, and that it hasn't expired. A mismatch is where you'd see a warning.",
  ],
  [
    "Agree a key",
    "Using the certificate's key material, both sides derive the same secret session key, which an eavesdropper can't work out from what crossed the wire.",
  ],
  [
    "Encrypted from here",
    "Everything after this, page, cookies, form data, is encrypted with that session key. TLS 1.3 does all this in one round trip.",
  ],
];

export type Choice = "aes" | "ecb" | "tls13" | "tls10" | "own" | "le";

export const CRYPTO: { id: Choice; label: string; good: boolean; why: string }[] = [
  {
    id: "aes",
    label: "Encrypt data with AES-GCM or ChaCha20-Poly1305",
    good: true,
    why: "Modern authenticated ciphers: encrypt and detect tampering.",
  },
  {
    id: "ecb",
    label: "Encrypt with AES in ECB mode",
    good: false,
    why: "ECB leaks patterns: identical blocks look identical (the “ECB penguin”). Adobe's 2013 leak of ~153M records did this.",
  },
  {
    id: "tls13",
    label: "Serve the site over TLS 1.3 (1.2 as fallback)",
    good: true,
    why: "The current version; removes weak key exchanges.",
  },
  {
    id: "tls10",
    label: "Keep TLS 1.0 enabled for old clients",
    good: false,
    why: "TLS 1.0 and 1.1 were deprecated in 2021 (RFC 8996).",
  },
  {
    id: "own",
    label: "Write your own encryption routine",
    good: false,
    why: "Home-made crypto almost always has subtle, fatal flaws. Use reviewed libraries.",
  },
  {
    id: "le",
    label: "Free auto-renewing certificates (e.g. Let's Encrypt)",
    good: true,
    why: "Certificates are getting short-lived, so automate renewal.",
  },
];
