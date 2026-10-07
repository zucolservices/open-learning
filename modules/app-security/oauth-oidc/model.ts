/** The OAuth 2.0 authorization code flow with PKCE, step by step, and three common mistakes. */

export type Lane = 0 | 1 | 2 | 3; // browser, app, sign-in server, API
export const LANES = ["Browser", "Food app", "Sign-in server", "Photos API"];

export interface Step {
  from: Lane;
  to: Lane;
  label: string;
  text: string;
}

export const STEPS: Step[] = [
  {
    from: 0,
    to: 1,
    label: "“Sign in with Example ID”",
    text: "Asha clicks the button on the food-delivery app.",
  },
  {
    from: 1,
    to: 2,
    label: "redirect: client_id, redirect_uri, scope, state, code_challenge",
    text: "The app makes a random secret (the PKCE verifier), keeps it, and sends the browser to the sign-in server with only a hash of it (the challenge), plus a random state value.",
  },
  {
    from: 0,
    to: 2,
    label: "log in + approve “name, email”",
    text: "Asha logs in on the sign-in server's own page, never on the app, and approves exactly what the app asked for.",
  },
  {
    from: 2,
    to: 1,
    label: "redirect back: code + state",
    text: "The server sends the browser back to the registered redirect address with a short-lived, one-time code.",
  },
  {
    from: 1,
    to: 2,
    label: "code + code_verifier (server to server)",
    text: "The app checks the state matches, then swaps the code for tokens, proving with the verifier that it started this flow.",
  },
  {
    from: 2,
    to: 1,
    label: "ID token + access token",
    text: "The ID token tells the app who signed in. The access token lets it call an API, within the approved scope.",
  },
  {
    from: 1,
    to: 3,
    label: "API call with access token",
    text: "The app uses the access token. It never saw Asha's password.",
  },
];

export type Mistake = "redirect" | "state" | "implicit";

export const MISTAKES: { id: Mistake; name: string; atStep: number; what: string; fix: string }[] =
  [
    {
      id: "redirect",
      name: "Loose redirect URI matching",
      atStep: 3,
      what: "The server accepts any address that starts with the app's domain, so a crafted link sends the code to a page the attacker controls.",
      fix: "Register redirect URIs and compare them by exact string match (RFC 9700). With PKCE the stolen code is also useless without the verifier.",
    },
    {
      id: "state",
      name: "No state or PKCE check",
      atStep: 4,
      what: "An attacker slips their own code into Asha's browser; she ends up logged in to the attacker's account and saves her card there (login CSRF).",
      fix: "Check state, and use PKCE, so the app only accepts responses to flows it started.",
    },
    {
      id: "implicit",
      name: "Implicit flow (token in the URL)",
      atStep: 3,
      what: "The access token comes back in the browser address, where it can leak through history, logs and other scripts.",
      fix: "Use the authorization code flow with PKCE. RFC 9700 says the implicit grant should not be used.",
    },
  ];

export const ATTACKS: [string, string][] = [
  [
    "Sign in with Apple, 2020",
    "A researcher found Apple's server would issue genuinely signed ID tokens for any email address. Apple paid a $100,000 bounty and found no misuse.",
  ],
  [
    "Microsoft, January 2024",
    "Attackers guessed the password of a test account without MFA, then abused a forgotten test OAuth app to read corporate mailboxes.",
  ],
  [
    "Salesloft Drift, August 2025",
    "Attackers used stolen OAuth tokens for a sales chatbot integration to pull data from many companies' Salesforce instances.",
  ],
  [
    "Device-code phishing, 2025",
    "Victims were tricked into typing a code on a real sign-in page, granting the attacker's device access to their account.",
  ],
];
