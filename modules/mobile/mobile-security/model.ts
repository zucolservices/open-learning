/**
 * A rules-based security review of the café app. Each finding is described in words only, with
 * possible responses and feedback. No real secrets, payloads or attack steps.
 */

export type Tone = "good" | "ok" | "bad";

export interface Finding {
  id: string;
  area: string;
  note: string;
  options: { id: string; label: string; tone: Tone; feedback: string }[];
}

export const FINDINGS: Finding[] = [
  {
    id: "secret",
    area: "Credentials",
    note: "The payment provider's secret key is written into the app, so the app can create charges itself.",
    options: [
      {
        id: "obfuscate",
        label: "Obfuscate the key so it's harder to find",
        tone: "bad",
        feedback:
          "Obfuscation slows people down; it doesn't stop them. Anything shipped in an app can be extracted.",
      },
      {
        id: "server",
        label: "Move charging to the server; the app gets a one-off token per order",
        tone: "good",
        feedback:
          "Right. Real secrets stay on servers you control; the app only ever holds short-lived, per-user tokens.",
      },
      {
        id: "keychain",
        label: "Store the key in the Keychain or Keystore",
        tone: "bad",
        feedback:
          "Those protect secrets created on the device. A key that ships inside the app is already exposed.",
      },
    ],
  },
  {
    id: "token",
    area: "Storage",
    note: "The sign-in token is saved in ordinary settings storage.",
    options: [
      {
        id: "secure",
        label: "Move it to the Keychain, or encrypt it with a Keystore key",
        tone: "good",
        feedback: "Right. Secure storage, as in module 10.",
      },
      {
        id: "encode",
        label: "Encode it so it isn't readable at a glance",
        tone: "bad",
        feedback: "Encoding isn't encryption; anyone can reverse it.",
      },
      {
        id: "leave",
        label: "Leave it: the app sandbox protects it",
        tone: "bad",
        feedback: "The sandbox doesn't cover backups or a compromised device.",
      },
    ],
  },
  {
    id: "trust",
    area: "Authorisation",
    note: "The server gives a Gold-member discount whenever the app says the customer is a Gold member.",
    options: [
      {
        id: "server",
        label: "The server looks up membership itself and ignores the app's claim",
        tone: "good",
        feedback:
          "Right. The app is in the customer's hands; treat everything it sends as a request, not a fact.",
      },
      {
        id: "hide",
        label: "Hide the Gold flag better inside the app",
        tone: "bad",
        feedback: "Someone can still change what the app sends.",
      },
      {
        id: "root",
        label: "Block rooted and jailbroken phones",
        tone: "ok",
        feedback:
          "That raises the bar a little, but anyone can still send a modified request. Decide on the server.",
      },
    ],
  },
  {
    id: "logs",
    area: "Privacy",
    note: "Release builds write full order details, including phone numbers, to the device log.",
    options: [
      {
        id: "strip",
        label: "Remove or redact detailed logs in release builds",
        tone: "good",
        feedback:
          "Right. Logs leak more than people expect; log what you need, without personal data.",
      },
      {
        id: "keep",
        label: "Keep them: logs help support",
        tone: "bad",
        feedback: "Use crash reporting with personal data removed instead.",
      },
    ],
  },
  {
    id: "pinning",
    area: "Network",
    note: "The app pins one exact server certificate, with no backup pins and no expiry.",
    options: [
      {
        id: "harder",
        label: "Pin even more strictly",
        tone: "bad",
        feedback:
          "When that certificate changes, every installed copy stops connecting until people update.",
      },
      {
        id: "balance",
        label: "Rely on platform TLS checks, or add backup pins and an expiry",
        tone: "good",
        feedback:
          "Right. Android's docs now advise against pinning for most apps; if you pin, plan for change.",
      },
    ],
  },
  {
    id: "sdk",
    area: "Supply chain",
    note: "A new analytics SDK was added without checking what it collects or who maintains it.",
    options: [
      {
        id: "review",
        label: "Review its data use and maintenance; record it in your dependency list",
        tone: "good",
        feedback:
          "Right. SDKs run with your app's permissions, and you're responsible for what they collect.",
      },
      {
        id: "trust",
        label: "It's popular, so it must be fine",
        tone: "bad",
        feedback: "Popular SDKs have shipped problems too, and the stores hold you responsible.",
      },
    ],
  },
];
