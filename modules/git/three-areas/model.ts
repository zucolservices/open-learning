/**
 * The three areas as counts of change "hunks" per file: hunks made in the working tree, and how
 * many of them are staged in the index. Status codes follow `git status --short`: X compares the
 * index with HEAD, Y compares the working tree with the index; "??" is untracked.
 */

export interface FileState {
  name: string;
  /** Hunks changed in the working tree since the last commit. */
  edits: number;
  /** Of those, how many are staged. */
  staged: number;
  /** Never committed yet. */
  isNew: boolean;
  /** Not yet added at all. */
  untracked: boolean;
}

export const START: FileState[] = [
  { name: "menu.html", edits: 0, staged: 0, isNew: false, untracked: false },
  { name: "prices.txt", edits: 0, staged: 0, isNew: false, untracked: false },
  { name: "notes.txt", edits: 1, staged: 0, isNew: true, untracked: true },
];

export type Action = "edit" | "addP" | "add" | "unstage" | "discard";

export function apply(f: FileState, a: Action): FileState {
  switch (a) {
    case "edit":
      return { ...f, edits: Math.min(3, f.edits + 1) };
    case "addP":
      return f.edits > f.staged ? { ...f, staged: f.staged + 1, untracked: false } : f;
    case "add":
      return { ...f, staged: f.edits, untracked: false };
    case "unstage":
      return { ...f, staged: 0, untracked: f.isNew };
    case "discard":
      return f.untracked ? f : { ...f, edits: f.staged };
  }
}

export function commitAll(files: FileState[]): FileState[] {
  return files.map((f) =>
    f.staged > 0
      ? { ...f, edits: f.edits - f.staged, staged: 0, isNew: false, untracked: false }
      : f,
  );
}

export function code(f: FileState): string {
  if (f.untracked) return "??";
  const x = f.staged > 0 ? (f.isNew ? "A" : "M") : " ";
  const y = f.edits > f.staged ? "M" : " ";
  return x + y;
}

export function meaning(c: string): string {
  if (c === "??") return "untracked: Git isn't recording this file yet";
  if (c === "  ") return "clean: nothing to commit";
  const parts: string[] = [];
  if (c[0] === "A") parts.push("new file staged");
  if (c[0] === "M") parts.push("changes staged");
  if (c[1] === "M") parts.push("more changes not staged");
  return parts.join(", ");
}
