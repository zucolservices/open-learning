import { branch, commit, init, mergeBase, switchTo, type Repo } from "../_shared/repo";

/** Three starting shapes for a merge of `specials` into `main`. */
export type Shape = "ff" | "diverged" | "uptodate";

export function shape(s: Shape): Repo {
  let r = commit(init("First menu"), "Add prices");
  r = switchTo(branch(r, "specials"), "specials");
  r = commit(commit(r, "Monsoon specials"), "Specials photos");
  r = switchTo(r, "main");
  if (s === "diverged") r = commit(r, "Update hours");
  if (s === "uptodate") {
    r = switchTo(r, "specials");
    r = switchTo(branch(r, "tmp"), "main");
    r = { ...r, branches: { main: r.branches.specials, specials: r.branches.main } };
    const lanes = { main: 0, specials: 1 };
    r = { ...r, lanes, head: { branch: "main" } };
  }
  return r;
}

export const baseOf = (r: Repo) => mergeBase(r, r.branches.main, r.branches.specials);

/** A three-way merge, line by line. */
export const LINES: { base: string; ours: string; theirs: string }[] = [
  { base: "Masala chai ₹40", ours: "Masala chai ₹40", theirs: "Masala chai ₹40" },
  { base: "Filter coffee ₹50", ours: "Filter coffee ₹55", theirs: "Filter coffee ₹50" },
  { base: "Lemon soda ₹30", ours: "Lemon soda ₹30", theirs: "Ginger lemon soda ₹35" },
  { base: "Open 8am–9pm", ours: "Open 7am–9pm", theirs: "Open 8am–10pm" },
];

export function decide(l: { base: string; ours: string; theirs: string }): {
  result: string;
  why: string;
  conflict: boolean;
} {
  if (l.ours === l.theirs) return { result: l.ours, why: "Both sides agree.", conflict: false };
  if (l.ours === l.base)
    return { result: l.theirs, why: "Only their side changed it: take theirs.", conflict: false };
  if (l.theirs === l.base)
    return { result: l.ours, why: "Only our side changed it: keep ours.", conflict: false };
  return {
    result: "⚠ conflict",
    why: "Both changed it differently: a person must decide.",
    conflict: true,
  };
}
