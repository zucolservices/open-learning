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
  "three-way-merge": {
    term: "Three-way merge",
    definition:
      "Combining two versions by comparing each with their common ancestor, so changes made on only one side are kept automatically.",
    module: "merging",
  },
  "merge-base": {
    term: "Merge base",
    definition:
      "The most recent commit that two branches share; the starting point a three-way merge compares against.",
    module: "merging",
  },
  "fast-forward": {
    term: "Fast-forward",
    definition:
      "A merge where one branch simply moves forward to the other's commit, because it had no new commits of its own.",
    module: "merging",
  },
  "merge-conflict": {
    term: "Merge conflict",
    definition:
      "When two branches changed the same part of a file differently, so Git stops and asks a person to choose the result.",
    module: "conflicts",
  },
  "conflict-markers": {
    term: "Conflict markers",
    definition:
      "The <<<<<<<, ======= and >>>>>>> lines Git writes into a file to show both sides of a conflict. They must be removed before committing.",
    module: "conflicts",
  },
  rebase: {
    term: "Rebase",
    definition:
      "Replaying a branch's commits on top of another branch, creating new commits with new IDs and a straight history.",
    module: "rebase",
  },
  "force-push": {
    term: "Force push",
    definition:
      "Pushing a branch whose history was rewritten, replacing the remote's version. --force-with-lease refuses if someone else pushed in the meantime.",
    module: "rebase",
  },
  "cherry-pick": {
    term: "Cherry-pick",
    definition:
      "Applying the change from one specific commit onto the current branch, as a new commit.",
    module: "cherry-pick-revert",
  },
  revert: {
    term: "Revert",
    definition:
      "Undoing a commit by adding a new commit that makes the opposite change, without rewriting history.",
    module: "cherry-pick-revert",
  },
  remote: {
    term: "Remote",
    definition:
      "Another copy of the repository that yours can fetch from and push to, usually on a server and named origin.",
    module: "remotes",
  },
  fetch: {
    term: "Fetch",
    definition:
      "Downloading new commits from a remote and updating remote-tracking branches like origin/main, without changing your own branches.",
    module: "remotes",
  },
  pull: {
    term: "Pull",
    definition:
      "Fetching from a remote and then merging or rebasing the result into your current branch.",
    module: "remotes",
  },
  push: {
    term: "Push",
    definition:
      "Sending your commits to a remote and moving its branch to match. It's rejected if the remote has commits you don't.",
    module: "remotes",
  },
  "remote-tracking-branch": {
    term: "Remote-tracking branch",
    definition:
      "A read-only pointer like origin/main that records where a remote's branch was the last time you fetched.",
    module: "remotes",
  },
  "pull-request": {
    term: "Pull request",
    definition:
      "A hosting-platform feature that proposes merging one branch into another, with discussion, review and automated checks first. GitLab calls it a merge request.",
    module: "pull-requests",
  },
  fork: {
    term: "Fork",
    definition:
      "A copy of someone else's repository under your own account on a hosting platform, used to propose changes when you can't push to the original.",
    module: "pull-requests",
  },
  codeowners: {
    term: "CODEOWNERS",
    definition:
      "A file listing who owns which paths in a repository, so the platform can automatically request their review.",
    module: "pull-requests",
  },
} satisfies Record<string, GlossaryEntry>;
