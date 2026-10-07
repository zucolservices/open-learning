/** Ways a session gets stolen, and the cookie and session settings that stop each one. */

export type Guard = "httponly" | "secure" | "rotate" | "timeout" | "bound";

export const GUARDS: { id: Guard; name: string; detail: string }[] = [
  { id: "httponly", name: "HttpOnly", detail: "Page scripts can't read the cookie." },
  { id: "secure", name: "Secure (HTTPS only)", detail: "Never sent over plain HTTP." },
  {
    id: "rotate",
    name: "New session ID at login",
    detail: "Any ID planted beforehand becomes useless.",
  },
  {
    id: "timeout",
    name: "Idle and absolute timeouts",
    detail: "Sessions end after inactivity and after a fixed time.",
  },
  {
    id: "bound",
    name: "Device-bound session",
    detail: "The session needs a key held in this device's hardware.",
  },
];

export const THREATS: {
  id: string;
  name: string;
  how: string;
  stoppedBy: Guard[];
  note: string;
}[] = [
  {
    id: "xss",
    name: "Injected script reads the cookie",
    how: "An XSS bug lets a script read document.cookie and send it away.",
    stoppedBy: ["httponly"],
    note: "HttpOnly hides the cookie, though the script can still act on the open page. Fix the XSS too.",
  },
  {
    id: "wifi",
    name: "Café Wi-Fi eavesdropper",
    how: "One request goes over plain HTTP and the cookie travels in the clear.",
    stoppedBy: ["secure"],
    note: "Secure keeps the cookie on HTTPS only.",
  },
  {
    id: "fixation",
    name: "Session fixation",
    how: "The attacker gets the victim to log in with a session ID the attacker already knows.",
    stoppedBy: ["rotate"],
    note: "A fresh ID at login breaks the attacker's copy.",
  },
  {
    id: "shared",
    name: "Shared computer, days later",
    how: "A library PC still holds a logged-in session from last week.",
    stoppedBy: ["timeout"],
    note: "Server-side timeouts end forgotten sessions.",
  },
  {
    id: "malware",
    name: "Malware copies browser cookies",
    how: "An infostealer copies every session token from the browser in seconds.",
    stoppedBy: ["bound"],
    note: "A device-bound session can't be replayed from the attacker's machine; timeouts shorten the window.",
  },
];

export function setCookie(on: Guard[], sameSite: "None" | "Lax" | "Strict") {
  const parts = [on.includes("secure") ? "__Host-sid=r4nd0m…" : "sid=r4nd0m…", "Path=/"];
  if (on.includes("secure")) parts.push("Secure");
  if (on.includes("httponly")) parts.push("HttpOnly");
  parts.push(`SameSite=${sameSite}`);
  if (on.includes("timeout")) parts.push("Max-Age=28800");
  return `Set-Cookie: ${parts.join("; ")}`;
}
