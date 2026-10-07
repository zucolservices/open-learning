/**
 * An image-preview feature that fetches a URL the user supplies. Targets and defences are described;
 * no real metadata addresses or payloads appear anywhere in this module.
 */

export type Target = "image" | "internal" | "metadata";
export type Fix = "allowlist" | "imds2" | "redirects";

export const TARGETS: { id: Target; label: string; what: string }[] = [
  { id: "image", label: "A normal image URL", what: "A picture on the public web." },
  {
    id: "internal",
    label: "An internal admin dashboard",
    what: "A service reachable only from inside the company network.",
  },
  {
    id: "metadata",
    label: "The cloud metadata service",
    what: "A local address every cloud server can ask for facts about itself, including temporary credentials.",
  },
];

export interface Result {
  blocked: boolean;
  text: string;
  severe?: boolean;
}

export function fetchAs(target: Target, fixes: Fix[]): Result {
  if (fixes.includes("allowlist") && target !== "image") {
    return {
      blocked: true,
      text: "Refused: the destination isn't on the allow-list of image hosts.",
    };
  }
  if (target === "metadata" && fixes.includes("imds2")) {
    return {
      blocked: true,
      text: "The hardened metadata service refuses a plain fetch: it needs a special header and request a simple SSRF can't add.",
    };
  }
  if (target === "image")
    return { blocked: false, text: "The preview loads. Normal use.", severe: false };
  if (target === "internal")
    return {
      blocked: false,
      text: "The server fetches an internal page the attacker could never reach directly. Its contents come back in the preview.",
      severe: true,
    };
  return {
    blocked: false,
    text: "The server fetches its own temporary cloud credentials and shows them in the preview. This is how the 2019 Capital One breach reached data on about 106 million people.",
    severe: true,
  };
}

export const FIXES: { id: Fix; name: string; detail: string }[] = [
  {
    id: "allowlist",
    name: "Allow-list of image hosts",
    detail:
      "Only fetch from known, approved domains; check the resolved IP and connect only to it.",
  },
  {
    id: "imds2",
    name: "Harden the metadata service",
    detail: "Require a token and a header (IMDSv2 on AWS; similar on Google Cloud and Azure).",
  },
  {
    id: "redirects",
    name: "Follow no redirects",
    detail: "A safe-looking URL can't bounce the server to an internal one.",
  },
];

export const DEFENCES: [string, string][] = [
  [
    "Allow-list, not deny-list",
    "List the few destinations you permit. Blocking “bad” addresses is easy to slip past.",
  ],
  [
    "Check the real IP",
    "Resolve the name, confirm it's external, and connect to that exact IP (stops DNS rebinding).",
  ],
  [
    "No redirects, no raw replies",
    "Don't follow redirects, and don't hand the fetched response straight back to the user.",
  ],
  [
    "Lock down the network",
    "Put the fetching service in its own segment with deny-by-default outbound rules.",
  ],
];
