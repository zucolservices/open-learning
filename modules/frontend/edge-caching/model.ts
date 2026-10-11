/**
 * Three responses from a made-up café site and the Cache-Control header chosen for each. The
 * outcomes follow RFC 9111 semantics, simplified.
 */

export type Header = "no-store" | "no-cache" | "max-age" | "immutable" | "private" | "smaxage";

export const HEADERS: { id: Header; value: string }[] = [
  { id: "no-store", value: "no-store" },
  { id: "no-cache", value: "no-cache" },
  { id: "max-age", value: "max-age=86400" },
  { id: "immutable", value: "public, max-age=31536000, immutable" },
  { id: "private", value: "private, no-cache" },
  { id: "smaxage", value: "s-maxage=300, stale-while-revalidate=60" },
];

export type Res = "js" | "html" | "api";

export const RESOURCES: { id: Res; path: string; desc: string; best: Header[] }[] = [
  {
    id: "js",
    path: "/assets/app.3f9a1c.js",
    desc: "Script with a content hash in its name: every deploy gets a new name.",
    best: ["immutable"],
  },
  {
    id: "html",
    path: "/menu (HTML)",
    desc: "The page itself. Same for everyone, changes when you deploy.",
    best: ["no-cache", "smaxage"],
  },
  {
    id: "api",
    path: "/api/my-orders",
    desc: "A signed-in customer's own order history.",
    best: ["private", "no-store"],
  },
];

export type Outcome = { text: string; tone: "good" | "ok" | "bad" };

export function outcome(r: Res, h: Header, scenario: "repeat" | "deploy" | "other"): Outcome {
  const shared = h === "max-age" || h === "immutable" || h === "smaxage";
  const browserFresh = h === "max-age" || h === "immutable";
  if (scenario === "repeat") {
    if (h === "no-store")
      return {
        text: "Downloaded again from the origin every time",
        tone: r === "api" ? "ok" : "bad",
      };
    if (h === "no-cache" || h === "private")
      return { text: "Quick check with the server: 304 Not Modified, no body", tone: "ok" };
    if (h === "smaxage") return { text: "Served by the nearby CDN", tone: "good" };
    return { text: "Served instantly from the browser's own cache", tone: "good" };
  }
  if (scenario === "deploy") {
    if (r === "js")
      return { text: "Irrelevant: the new deploy uses a new file name", tone: "good" };
    if (browserFresh)
      return {
        text: "Stale: returning visitors keep the old version for up to a day or more",
        tone: "bad",
      };
    if (h === "smaxage")
      return { text: "CDN may serve the old copy for up to five minutes", tone: "ok" };
    return { text: "New version picked up on the next visit", tone: "good" };
  }
  if (r === "api" && shared)
    return { text: "Leak: the CDN can hand one customer's orders to another", tone: "bad" };
  if (r === "api") return { text: "Each customer only ever sees their own data", tone: "good" };
  return { text: "Shared safely: the same for everyone", tone: shared ? "good" : "ok" };
}
