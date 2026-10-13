/** A service page's weight, part by part, and how long it takes on different connections (illustrative). */

export interface Part {
  id: string;
  label: string;
  kb: number;
  fixedKb: number;
  fix: string;
}

export const PARTS: Part[] = [
  {
    id: "hero",
    label: "Hero photo",
    kb: 1200,
    fixedKb: 60,
    fix: "Compress it and size it for small screens",
  },
  {
    id: "carousel",
    label: "Image carousel script",
    kb: 600,
    fixedKb: 0,
    fix: "Drop the carousel; show one clear message",
  },
  { id: "fonts", label: "Custom web fonts", kb: 400, fixedKb: 0, fix: "Use the phone's own fonts" },
  {
    id: "widgets",
    label: "Chat and analytics widgets",
    kb: 350,
    fixedKb: 30,
    fix: "Load only what's needed, after the page",
  },
  {
    id: "form",
    label: "Application form and its script",
    kb: 160,
    fixedKb: 90,
    fix: "Plain HTML form, with progressive enhancement",
  },
];

export const BASE_KB = 60;

export const NETS: [string, string, number][] = [
  ["2g", "2G", 64],
  ["slow", "Weak 3G", 1000],
  ["4g", "City 4G", 20000],
];

export const CHANNELS: [string, string, string][] = [
  ["sms", "SMS updates with a reference number", "Any phone, no data"],
  ["ivr", "A voice line with menus in local languages", "Any phone, and people who can't read"],
];

export function seconds(kb: number, kbps: number) {
  return (kb * 8) / kbps;
}
