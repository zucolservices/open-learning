import type { GlossaryEntry } from "./types";

/** Enterprise Patterns track glossary. `module` slugs refer to this track. */
export const enterprisePatterns = {
  "system-of-record": {
    term: "System of record",
    definition:
      "The system that holds the official, authoritative version of a piece of data, such as a customer's address. Other systems keep copies and must be updated from it.",
    module: "why-enterprise",
  },
  "big-ball-of-mud": {
    term: "Big Ball of Mud",
    definition:
      "Foote and Yoder's 1997 name for a system with no clear structure, grown by years of quick fixes, where everything depends on everything else.",
    module: "why-enterprise",
  },
  "point-to-point": {
    term: "Point-to-point integration",
    definition:
      "Connecting systems directly to each other, one link per pair. Simple for a few systems; n systems can need up to n(n−1)/2 links, each of which can break when either end changes.",
    module: "why-enterprise",
  },
  "pace-layers": {
    term: "Pace layers",
    definition:
      "Gartner's 2012 way of sorting applications by how fast they should change: systems of record (slow), systems of differentiation (medium) and systems of innovation (fast).",
    module: "why-enterprise",
  },
  "legacy-system": {
    term: "Legacy system",
    definition:
      "An older system that is still essential to the business but hard to change, often because of outdated technology, missing documentation or scarce skills.",
    module: "why-enterprise",
  },
} satisfies Record<string, GlossaryEntry>;
