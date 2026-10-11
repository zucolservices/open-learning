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
} satisfies Record<string, GlossaryEntry>;
