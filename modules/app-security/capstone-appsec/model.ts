/** Capstone: securing a small payments app. Design choices, then the first quarter's incidents. */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
}

export const DESIGN: { id: string; prompt: string; choices: Choice[]; prevents: string }[] = [
  {
    id: "identity",
    prompt: "How do people log in, and how do you check what they may see?",
    choices: [
      {
        id: "mfa",
        label: "Passkeys or MFA, breached-password checks, and an ownership check on every request",
        good: true,
      },
      { id: "role", label: "Passwords, with a single role check at login", good: false },
    ],
    prevents: "stuffing",
  },
  {
    id: "carddata",
    prompt: "What do you do with customers' card numbers?",
    choices: [
      {
        id: "token",
        label: "Never store them: the payment provider tokenises cards, so you hold only tokens",
        good: true,
      },
      { id: "store", label: "Store the card numbers yourselves, encrypted", good: false },
    ],
    prevents: "cardleak",
  },
  {
    id: "scripts",
    prompt: "How do you handle scripts on the checkout page?",
    choices: [
      {
        id: "locked",
        label:
          "Inventory every script, pin and integrity-check them, use a strict CSP, and watch for changes",
        good: true,
      },
      {
        id: "widgets",
        label: "Add analytics and chat widgets from third parties as needed",
        good: false,
      },
    ],
    prevents: "magecart",
  },
  {
    id: "pipeline",
    prompt: "What runs in your delivery pipeline?",
    choices: [
      {
        id: "secured",
        label: "Secret scanning, dependency scanning with an SBOM, and SAST/DAST on every change",
        good: true,
      },
      { id: "fast", label: "Ship fast; add security scans once things settle down", good: false },
    ],
    prevents: "depflaw",
  },
  {
    id: "detect",
    prompt: "What happens after launch?",
    choices: [
      {
        id: "watched",
        label: "Log security events, alert on the dangerous ones, and rehearse an incident plan",
        good: true,
      },
      { id: "later", label: "Add logging and alerting once there's time", good: false },
    ],
    prevents: "slowbreach",
  },
];

export interface Incident {
  id: string;
  title: string;
  detail: string;
  fixes: Choice[];
  real: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "stuffing",
    title: "Logins from everywhere, overnight",
    detail:
      "Millions of username-and-password pairs leaked from other sites are tried against your login. Thousands succeed, because people reuse passwords, and some accounts get drained.",
    fixes: [
      {
        id: "mfa",
        label: "Add phishing-resistant MFA, breached-password checks and rate limiting",
        good: true,
      },
      { id: "reset", label: "Force every user to reset their password", good: false },
    ],
    real: "Credential stuffing (modules 9–10). A second factor and breached-password checks stop reused passwords from working; a mass reset just annoys users and they pick “Password2”.",
  },
  {
    id: "cardleak",
    title: "Card numbers in a leaked backup",
    detail:
      "A database backup is left readable, and it contains customers' card numbers. Even encrypted, you now face breach notifications, fines and lost trust.",
    fixes: [
      {
        id: "token",
        label:
          "Stop storing cards: let the payment provider tokenise them, and delete what you held",
        good: true,
      },
      { id: "encrypt", label: "Encrypt the backups more strongly", good: false },
    ],
    real: "The safest card data is the data you don't hold (module 17; PCI DSS). Tokenisation, required for saved cards in India since 2022, removes the target entirely.",
  },
  {
    id: "magecart",
    title: "A skimmer on the checkout page",
    detail:
      "A third-party script on your payment page is tampered with and quietly copies card details as customers type them. Nothing on your servers looks wrong.",
    fixes: [
      {
        id: "csp",
        label:
          "Inventory and integrity-check payment-page scripts, add a strict CSP, and alert on changes",
        good: true,
      },
      { id: "remove", label: "Remove that one script", good: false },
    ],
    real: "A Magecart attack, as hit British Airways in 2018 (£20M fine). PCI DSS now requires a script inventory and change detection on payment pages (modules 6, 15).",
  },
  {
    id: "depflaw",
    title: "A critical flaw in a logging library",
    detail:
      "A maximum-severity flaw is announced in a popular logging library. Is it in your app? Buried three dependencies deep, nobody is sure, and the clock is ticking.",
    fixes: [
      {
        id: "sbom",
        label: "Check the SBOM, patch, and keep scanning dependencies from now on",
        good: true,
      },
      { id: "grep", label: "Search the codebase once and hope you caught it", good: false },
    ],
    real: "Log4Shell, 2021 (module 19). An SBOM and dependency scanning answer “are we affected?” in minutes instead of weeks.",
  },
  {
    id: "slowbreach",
    title: "An intruder you didn't notice for weeks",
    detail:
      "An attacker got in through an admin account with no MFA and quietly read data for a month. You find out when a customer reports fraud.",
    fixes: [
      {
        id: "alert",
        label: "Add alerting on suspicious activity, MFA on admin, and a rehearsed incident plan",
        good: true,
      },
      { id: "logs", label: "Read the logs carefully after each incident", good: false },
    ],
    real: "Dwell time is measured in weeks (module 21). Collecting logs isn't enough; you have to alert on them and be ready to respond.",
  },
];
