import type { GlossaryEntry } from "./types";

/** Git track glossary. `module` slugs refer to this track. */
export const gitTrack = {
  "version-control": {
    term: "Version control",
    definition:
      "A system that records every change to a set of files, who made it and why, so you can go back to any version and work in parallel.",
    module: "why-git",
  },
  git: {
    term: "Git",
    definition:
      "The free, open-source, distributed version control system created by Linus Torvalds in 2005 and used by almost every software team.",
    module: "why-git",
  },
  repository: {
    term: "Repository",
    definition:
      "A project's files together with their complete history. In Git every clone is a full repository; the history lives in a hidden .git folder.",
    module: "why-git",
  },
  commit: {
    term: "Commit",
    definition:
      "A saved snapshot of the whole project, with an author, a timestamp, a message and a link to the commit before it.",
    module: "why-git",
  },
  snapshot: {
    term: "Snapshot",
    definition:
      "A record of every file as it was at one moment. Each Git commit is a snapshot of the whole project, not a list of changes.",
    module: "snapshots",
  },
  "content-hash": {
    term: "Content hash",
    definition:
      "A fixed-length fingerprint computed from data. Git names every object by the SHA-1 (or SHA-256) hash of its content, so the same content always gets the same name.",
    module: "snapshots",
  },
  blob: {
    term: "Blob",
    definition: "The Git object that stores one file's content, without its name.",
    module: "snapshots",
  },
  tree: {
    term: "Tree",
    definition:
      "The Git object that stands for a folder: a list of names, each pointing to a blob or another tree.",
    module: "snapshots",
  },
  "working-tree": {
    term: "Working tree",
    definition:
      "The ordinary files of a project that you see and edit, as opposed to the history stored in .git.",
    module: "three-areas",
  },
  index: {
    term: "Index (staging area)",
    definition:
      "Git's list of exactly what will go into the next commit. git add puts changes into it.",
    module: "three-areas",
  },
  staging: {
    term: "Staging",
    definition: "Choosing which changes go into the next commit by adding them to the index.",
    module: "three-areas",
  },
  hunk: {
    term: "Hunk",
    definition:
      "One block of changed lines in a file. git add -p lets you stage changes hunk by hunk.",
    module: "three-areas",
  },
  "parent-commit": {
    term: "Parent commit",
    definition:
      "The commit a new commit was made on top of. Each commit stores its parent's ID; a merge commit has two.",
    module: "commits-history",
  },
  head: {
    term: "HEAD",
    definition:
      "Git's marker for where you are: usually the name of the current branch, or a commit ID when detached.",
    module: "commits-history",
  },
  "detached-head": {
    term: "Detached HEAD",
    definition:
      "When HEAD points straight at a commit instead of a branch, for example after checking out an old commit.",
    module: "commits-history",
  },
  branch: {
    term: "Branch",
    definition:
      "A name that points to a commit and moves forward when you commit on it. Creating one copies nothing.",
    module: "branches",
  },
} satisfies Record<string, GlossaryEntry>;
