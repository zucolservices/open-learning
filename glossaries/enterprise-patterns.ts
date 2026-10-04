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
  "conways-law": {
    term: "Conway's law",
    definition:
      "Melvin Conway's 1968 observation that organisations design systems which copy their own communication structures: the parts of a system tend to match the teams that build them.",
    module: "conways-law",
  },
  "inverse-conway": {
    term: "Inverse Conway manoeuvre",
    definition:
      "Deliberately shaping teams and how they communicate in order to get the software architecture you want.",
    module: "conways-law",
  },
  "team-topologies": {
    term: "Team Topologies",
    definition:
      "Skelton and Pais's model for organising technology teams: four team types (stream-aligned, platform, enabling, complicated-subsystem) and three interaction modes (collaboration, X-as-a-Service, facilitating).",
    module: "conways-law",
  },
  "stream-aligned-team": {
    term: "Stream-aligned team",
    definition:
      "A team aligned to a flow of work from one part of the business, owning it end to end: building, running and changing it.",
    module: "conways-law",
  },
  "cognitive-load": {
    term: "Cognitive load",
    definition:
      "How much a team has to keep in its head: tools, domains and responsibilities. Overloaded teams slow down and make poor decisions.",
    module: "conways-law",
  },
  "domain-driven-design": {
    term: "Domain-driven design (DDD)",
    definition:
      "An approach to software, from Eric Evans's 2003 book, that models the code closely on the business: a language shared with domain experts, explicit boundaries between models, and focus on the core domain.",
    module: "domain-language",
  },
  domain: {
    term: "Domain",
    definition:
      'The subject area a piece of software serves, such as insurance claims or parcel delivery. Evans: "a sphere of knowledge, influence, or activity".',
    module: "domain-language",
  },
  "ubiquitous-language": {
    term: "Ubiquitous language",
    definition:
      "A vocabulary agreed between developers and domain experts and used everywhere within one bounded context: in conversation, documents and the code itself.",
    module: "domain-language",
  },
  "domain-expert": {
    term: "Domain expert",
    definition:
      "Someone who knows a business area deeply, such as an underwriter, a nurse or a dispatcher, and helps the team understand and name things correctly.",
    module: "domain-language",
  },
  "bounded-context": {
    term: "Bounded context",
    definition:
      "A boundary, usually a subsystem or one team's work, inside which a single model and its language apply consistently. Different contexts can model the same thing, such as a customer, differently.",
    analogy:
      '"Meter" means one thing to the billing office and another to the engineer who fits it.',
    module: "bounded-contexts",
  },
  "core-domain": {
    term: "Core domain",
    definition:
      "The part of the business that makes it valuable and different, where the best people and most design effort should go.",
    module: "bounded-contexts",
  },
  "generic-subdomain": {
    term: "Generic subdomain",
    definition:
      "A part of the business every organisation needs, such as accounting or sending email, best bought or used as a service rather than built.",
    module: "bounded-contexts",
  },
  "supporting-subdomain": {
    term: "Supporting subdomain",
    definition:
      "A part specific to the business but not where it competes; build it simply or outsource it. The term comes from Vaughn Vernon's three-way split.",
    module: "bounded-contexts",
  },
} satisfies Record<string, GlossaryEntry>;
