/** Response headers and the browser-side attacks each one blunts. */

export type Header = "csp" | "hsts" | "frame" | "nosniff" | "referrer" | "permissions";

export const HEADERS: { id: Header; line: string; plain: string }[] = [
  {
    id: "csp",
    line: "Content-Security-Policy: script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'",
    plain: "Only scripts carrying this response's secret nonce may run.",
  },
  {
    id: "hsts",
    line: "Strict-Transport-Security: max-age=31536000; includeSubDomains",
    plain: "For a year, only ever connect to this site over HTTPS.",
  },
  {
    id: "frame",
    line: "Content-Security-Policy: frame-ancestors 'none'",
    plain: "No other site may show this page inside a frame.",
  },
  {
    id: "nosniff",
    line: "X-Content-Type-Options: nosniff",
    plain: "Trust the declared file type; don't guess.",
  },
  {
    id: "referrer",
    line: "Referrer-Policy: strict-origin-when-cross-origin",
    plain: "Tell other sites only which site a visitor came from, not the full address.",
  },
  {
    id: "permissions",
    line: "Permissions-Policy: camera=(), microphone=(), geolocation=()",
    plain: "This page never uses the camera, microphone or location.",
  },
];

export const ATTACKS: { id: string; name: string; stoppedBy: Header; detail: string }[] = [
  {
    id: "xss",
    name: "An XSS bug slipped through code review",
    stoppedBy: "csp",
    detail: "The injected script has no nonce, so the browser refuses to run it.",
  },
  {
    id: "strip",
    name: "Café Wi-Fi downgrades a visit to plain HTTP",
    stoppedBy: "hsts",
    detail: "The browser upgrades to HTTPS itself, after the first visit.",
  },
  {
    id: "click",
    name: "A game page hides the bank's “Confirm” button under its own",
    stoppedBy: "frame",
    detail: "The bank page refuses to load inside the game's frame (clickjacking).",
  },
  {
    id: "sniff",
    name: "An uploaded “image” is really a script",
    stoppedBy: "nosniff",
    detail: "It's served as an image, so it never runs as a script.",
  },
  {
    id: "leak",
    name: "A password-reset link leaks to an analytics site",
    stoppedBy: "referrer",
    detail: "Only the site name is sent, not the full link with its token.",
  },
  {
    id: "camera",
    name: "An injected script asks for the camera",
    stoppedBy: "permissions",
    detail: "The feature is switched off for this page.",
  },
];

export type CspStyle = "allow" | "strict";
