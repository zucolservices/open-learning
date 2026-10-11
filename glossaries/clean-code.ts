import type { GlossaryEntry } from "./types";

/** Clean Code track glossary. `module` slugs refer to this track. */
export const cleanCodeTrack = {
  "clean-code": {
    term: "Clean code",
    definition:
      "Code that the next person can understand quickly and change safely. Also the title of a well-known 2008 book by Robert C. Martin.",
    module: "why-readable",
  },
  readability: {
    term: "Readability",
    definition:
      "How easily a person can understand what code does and why, without running it or asking its author.",
    module: "why-readable",
  },
  "cognitive-load": {
    term: "Cognitive load",
    definition:
      "How much a reader has to hold in their head at once to follow the code. Working memory holds only a few chunks, so every extra detail costs.",
    module: "why-readable",
  },
  yagni: {
    term: "YAGNI",
    definition:
      "“You aren't gonna need it”: don't build features for imagined future needs. It never means skipping tests or refactoring.",
    module: "simplicity",
  },
  abstraction: {
    term: "Level of abstraction",
    definition:
      "How close code is to the big idea (place an order) versus the low-level detail (loop over bytes). A clear function keeps its steps at one level.",
    module: "functions",
  },
  "magic-number": {
    term: "Magic number",
    definition:
      "A literal value in code, like 3 or 0.9, whose meaning isn't explained. Replacing it with a named constant states the rule.",
    module: "naming",
  },
  "doc-comment": {
    term: "Doc comment",
    definition:
      "A comment attached to a function or class that describes what callers can rely on, such as a Python docstring or a Javadoc block. Tools turn them into reference documentation.",
    module: "comments",
  },
} satisfies Record<string, GlossaryEntry>;
