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
  "cyclomatic-complexity": {
    term: "Cyclomatic complexity",
    definition:
      "A count of the independent paths through a function: its decisions plus one. Proposed by Thomas McCabe in 1976; roughly how many tests it needs.",
    module: "complexity",
  },
  "cognitive-complexity": {
    term: "Cognitive complexity",
    definition:
      "A score designed to track how hard code is to understand, charging extra for nesting. Introduced by SonarSource in 2017.",
    module: "complexity",
  },
  "guard-clause": {
    term: "Guard clause",
    definition:
      "An early check at the top of a function that handles a special case and returns, so the main logic isn't nested inside conditions.",
    module: "complexity",
  },
  cohesion: {
    term: "Cohesion",
    definition:
      "How closely the things inside a module belong together. High cohesion means a module is about one thing, so changes to that thing stay inside it.",
    module: "cohesion-coupling",
  },
  coupling: {
    term: "Coupling",
    definition:
      "How much one part of the code depends on the details of another. Loose coupling lets each part change without forcing changes elsewhere.",
    module: "cohesion-coupling",
  },
  solid: {
    term: "SOLID",
    definition:
      "Five object-oriented design principles: single responsibility, open–closed, Liskov substitution, interface segregation and dependency inversion. Useful guides, not laws.",
    module: "solid",
  },
  inheritance: {
    term: "Inheritance",
    definition:
      "Creating a new class by extending an existing one, so it gets the parent's code and can override parts. The child depends on the parent's internals.",
    module: "composition",
  },
  composition: {
    term: "Composition",
    definition:
      "Building an object out of smaller objects that each do one job, and combining them, instead of extending a parent class.",
    module: "composition",
  },
  boundary: {
    term: "Boundary",
    definition:
      "The line between your business rules and the outside world (databases, frameworks, vendors), crossed through small interfaces your code owns.",
    module: "boundaries",
  },
  "ports-and-adapters": {
    term: "Ports and adapters",
    definition:
      "A design where the core application talks to the world through interfaces it owns (ports), and technology-specific code plugs into them (adapters). Also called hexagonal architecture.",
    module: "boundaries",
  },
  "error-handling": {
    term: "Error handling",
    definition:
      "How code detects, reports and recovers from things going wrong. Clean error handling keeps failures visible and deals with them where something useful can be done.",
    module: "error-handling",
  },
  "fail-fast": {
    term: "Fail fast",
    definition:
      "Stopping as soon as something is wrong, such as invalid input, so the problem shows up close to its cause instead of causing damage later.",
    module: "error-handling",
  },
  null: {
    term: "Null",
    definition:
      "A special value meaning “nothing here”. In many languages any reference might be null, and using it as if it held a value crashes the program.",
    module: "null-safety",
  },
  "optional-type": {
    term: "Optional type",
    definition:
      "A type that says a value may be missing, such as string | undefined, String? or Option<T>, so the compiler makes you handle the empty case.",
    module: "null-safety",
  },
} satisfies Record<string, GlossaryEntry>;
