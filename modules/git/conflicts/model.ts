/**
 * One conflict in a made-up café's menu file, shown in Git's three marker styles. Formats match
 * real Git output (checked with git 2.48): merge, diff3 (adds the base) and zdiff3 (Git 2.35+,
 * moves lines both sides share out of the conflict).
 */

export type Style = "merge" | "diff3" | "zdiff3";

export const BEFORE = ["<h1>Menu</h1>", "<p>Masala chai ₹40</p>"];
export const AFTER = ["<p>Filter coffee ₹50</p>"];

export const OURS = ["<p>Open 7am–9pm</p>", "<p>Closed Mondays</p>"];
export const BASE = ["<p>Open 8am–9pm</p>", "<p>Closed Mondays</p>"];
export const THEIRS = ["<p>Open 8am–10pm</p>", "<p>Closed Mondays</p>"];

export function conflictLines(
  style: Style,
): { text: string; kind: "plain" | "marker" | "ours" | "base" | "theirs" }[] {
  const out: { text: string; kind: "plain" | "marker" | "ours" | "base" | "theirs" }[] = [];
  const plain = (t: string) => out.push({ text: t, kind: "plain" });
  BEFORE.forEach(plain);
  if (style === "zdiff3") {
    // nothing shared at the start here; the shared trailing line moves out of the conflict
    out.push({ text: "<<<<<<< HEAD", kind: "marker" });
    out.push({ text: OURS[0], kind: "ours" });
    out.push({ text: "||||||| 3f2c1a9", kind: "marker" });
    out.push({ text: BASE[0], kind: "base" });
    out.push({ text: "=======", kind: "marker" });
    out.push({ text: THEIRS[0], kind: "theirs" });
    out.push({ text: ">>>>>>> late-hours", kind: "marker" });
    plain(OURS[1]);
  } else {
    out.push({ text: "<<<<<<< HEAD", kind: "marker" });
    OURS.forEach((t) => out.push({ text: t, kind: "ours" }));
    if (style === "diff3") {
      out.push({ text: "||||||| 3f2c1a9", kind: "marker" });
      BASE.forEach((t) => out.push({ text: t, kind: "base" }));
    }
    out.push({ text: "=======", kind: "marker" });
    THEIRS.forEach((t) => out.push({ text: t, kind: "theirs" }));
    out.push({ text: ">>>>>>> late-hours", kind: "marker" });
  }
  AFTER.forEach(plain);
  return out;
}

export type Pick = "ours" | "theirs" | "both" | "combined" | "markers";

export const PICKS: { id: Pick; label: string; result: string[]; ok: boolean; why: string }[] = [
  {
    id: "ours",
    label: "Keep ours (main)",
    result: OURS,
    ok: true,
    why: "Valid, but the later closing time from late-hours is lost. Is that what the café wants?",
  },
  {
    id: "theirs",
    label: "Keep theirs (late-hours)",
    result: THEIRS,
    ok: true,
    why: "Valid, but the earlier opening time from main is lost.",
  },
  {
    id: "combined",
    label: "Combine both intentions",
    result: ["<p>Open 7am–10pm</p>", "<p>Closed Mondays</p>"],
    ok: true,
    why: "Both changes kept: earlier opening and later closing. Often the right answer, but only a person who understands the change can say.",
  },
  {
    id: "both",
    label: "Keep both blocks",
    result: [...OURS, ...THEIRS],
    ok: false,
    why: "Now the page lists two different opening hours and 'Closed Mondays' twice.",
  },
  {
    id: "markers",
    label: "Leave it as it is",
    result: [],
    ok: false,
    why: "The conflict markers are still in the file. Git 2.56's `git add --resolved` refuses this; plain `git add` would commit them.",
  },
];
