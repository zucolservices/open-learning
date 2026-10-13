/** Four made-up services and how strongly each should verify people. */

export const LEVELS: [string, string, number][] = [
  ["none", "No sign-in at all", 0],
  ["simple", "A simple sign-in: mobile OTP or the national single sign-on", 1],
  ["aadhaar-alt", "Aadhaar authentication, with other ways offered", 2],
  ["aadhaar-only", "Aadhaar authentication, no alternatives", 3],
];

export interface Service {
  id: string;
  title: string;
  answer: string;
  feedback: Record<string, string>;
}

export const SERVICES: Service[] = [
  {
    id: "form",
    title: "Downloading a blank application form",
    answer: "none",
    feedback: {
      none: "Right. Public information needs no identity; collecting it would only add risk.",
      simple: "Unnecessary friction for public information, and personal data you don't need.",
      "aadhaar-alt": "Far too much for a public download.",
      "aadhaar-only": "Excessive, and it shuts out people without Aadhaar.",
    },
  },
  {
    id: "library",
    title: "A state digital library account",
    answer: "simple",
    feedback: {
      none: "Readers need an account to borrow and keep track of loans.",
      simple:
        "Right. A simple sign-in is enough; the library doesn't need to know exactly who someone is.",
      "aadhaar-alt": "More than the service needs. Collect only what the purpose requires.",
      "aadhaar-only": "Unjustified, and excludes people who can't authenticate.",
    },
  },
  {
    id: "pension",
    title: "A state pension paid from public funds",
    answer: "aadhaar-alt",
    feedback: {
      none: "Public money must reach the right person.",
      simple: "Too weak: anyone with the phone could claim someone else's pension.",
      "aadhaar-alt":
        "Right. Section 7 of the Aadhaar Act allows Aadhaar for benefits from public funds, but alternatives must exist for people without it or when authentication fails.",
      "aadhaar-only":
        "Biometric checks can fail for older people and manual workers whose fingerprints have worn. Without alternatives, eligible people lose their pension.",
    },
  },
  {
    id: "bank",
    title: "Opening a bank account",
    answer: "aadhaar-alt",
    feedback: {
      none: "Banks are legally required to know their customers.",
      simple: "Not enough for know-your-customer rules.",
      "aadhaar-alt":
        "Right. Since 2019, banks may use Aadhaar eKYC only voluntarily, with consent; other documents must be accepted.",
      "aadhaar-only":
        "In 2018 the Supreme Court struck down mandatory Aadhaar linking for bank accounts.",
    },
  },
];
