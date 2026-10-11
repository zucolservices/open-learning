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
  formatter: {
    term: "Formatter",
    definition:
      "A tool that rewrites code's layout (spacing, line breaks, quotes) to one consistent style without changing what it does, such as Prettier, Black or gofmt.",
    module: "formatting",
  },
  linter: {
    term: "Linter",
    definition:
      "A tool that reads code and flags patterns that are likely mistakes or confusing, such as unused variables or risky comparisons. ESLint, Ruff and Clippy are linters.",
    module: "formatting",
  },
  duplication: {
    term: "Duplication",
    definition:
      "The same piece of knowledge, such as a tax rate or a validation rule, written in more than one place, so a change must be made everywhere. DRY (don't repeat yourself) means giving each fact one home.",
    module: "duplication",
  },
  "wrong-abstraction": {
    term: "Wrong abstraction",
    definition:
      "Shared code built on a bad guess about what is common, which then grows flags and special cases for each caller. Often cheaper to undo than to keep patching.",
    module: "duplication",
  },
} satisfies Record<string, GlossaryEntry>;
