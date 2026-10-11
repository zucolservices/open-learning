/**
 * A rules-based simulation of defending a made-up café site's comment widget and sign-in. Attacks
 * are described in words only; no real payloads.
 */

export interface Decision {
  id: string;
  title: string;
  attack: string;
  options: { id: string; label: string; blocks: boolean; outcome: string }[];
}

export const DECISIONS: Decision[] = [
  {
    id: "render",
    title: "Showing visitors' comments",
    attack:
      "A visitor posts a comment that secretly contains a script tag designed to run in every reader's browser.",
    options: [
      {
        id: "raw",
        label: "Insert the comment as HTML (innerHTML / dangerouslySetInnerHTML)",
        blocks: false,
        outcome: "The hidden script runs for every reader: stored cross-site scripting.",
      },
      {
        id: "text",
        label: "Render it as text with the framework's normal escaping",
        blocks: true,
        outcome:
          "The tag is shown as harmless characters. React, Vue, Svelte and Angular escape text by default.",
      },
      {
        id: "sanitise",
        label: "Allow some formatting, but run it through a sanitiser first",
        blocks: true,
        outcome:
          "Bold and links survive; anything executable is stripped. Use a well-maintained sanitiser, never your own regex.",
      },
    ],
  },
  {
    id: "csp",
    title: "A second line of defence",
    attack: "Months later, a new feature accidentally inserts unescaped text somewhere else.",
    options: [
      {
        id: "none",
        label: "No Content Security Policy",
        blocks: false,
        outcome: "Nothing stops the injected script from running.",
      },
      {
        id: "allow",
        label: "A CSP listing trusted domains",
        blocks: false,
        outcome:
          "Domain allowlists are easy to get around and hard to maintain; MDN calls them insecure.",
      },
      {
        id: "strict",
        label: "A strict CSP with a random nonce per page, plus Trusted Types",
        blocks: true,
        outcome:
          "Scripts without the page's nonce are refused, and risky DOM writes need a vetted policy. The bug is contained.",
      },
    ],
  },
  {
    id: "token",
    title: "Where the sign-in session lives",
    attack: "If any script does run, it will try to read the session and send it elsewhere.",
    options: [
      {
        id: "local",
        label: "A token in localStorage",
        blocks: false,
        outcome:
          "Any script on the page can read localStorage. OWASP advises against storing session identifiers there.",
      },
      {
        id: "cookie",
        label: "A cookie marked HttpOnly, Secure and SameSite=Lax",
        blocks: true,
        outcome:
          "Scripts can't read an HttpOnly cookie, it's only sent over HTTPS, and SameSite limits cross-site use. Set SameSite explicitly: only Chromium browsers default to Lax.",
      },
    ],
  },
  {
    id: "deps",
    title: "Third-party code",
    attack:
      "A popular package your site depends on is taken over and a malicious version is published.",
    options: [
      {
        id: "latest",
        label: "Always install the latest version on every build",
        blocks: false,
        outcome: "Your next build ships the malicious version straight to visitors' browsers.",
      },
      {
        id: "lock",
        label:
          "Commit a lockfile, install with npm ci, review updates, wait a few days before adopting new versions",
        blocks: true,
        outcome:
          "The build keeps the known-good version; the bad release is pulled before you'd have adopted it.",
      },
    ],
  },
];

export const INCIDENTS: [string, string][] = [
  [
    "8 Sep 2025",
    "18 popular npm packages, including chalk and debug (over 2 billion weekly downloads together), published with code that swapped crypto wallet addresses in browsers, after a phishing email to a maintainer.",
  ],
  [
    "Mid-Sep 2025",
    "“Shai-Hulud”: a self-spreading worm stole developer tokens and used them to infect more than 500 packages.",
  ],
  ["24 Nov 2025", "A second wave hit about 800 packages, running during installation."],
  [
    "9 Dec 2025",
    "npm permanently revoked all classic access tokens and moved to short-lived, 2FA-protected publishing.",
  ],
  [
    "30–31 Mar 2026",
    "Malicious axios versions were live for a few hours after a maintainer account was hijacked.",
  ],
];
