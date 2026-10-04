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
  "context-map": {
    term: "Context map",
    definition:
      "A picture of all the bounded contexts in a system and how each pair relates: who depends on whom, and how models are shared or translated between them.",
    module: "context-mapping",
  },
  "upstream-downstream": {
    term: "Upstream and downstream",
    definition:
      "A relationship where one team's changes (upstream) affect another (downstream), but not the other way round.",
    analogy: "Cities on a river: what the upstream city puts in, the downstream city drinks.",
    module: "context-mapping",
  },
  "anticorruption-layer": {
    term: "Anticorruption layer",
    definition:
      "A translating layer a downstream context builds around an upstream system, so it can use that system's functions in its own terms without the other model leaking in.",
    module: "context-mapping",
  },
  "open-host-service": {
    term: "Open-host service",
    definition:
      "An upstream context offering one documented protocol that every consumer can use, instead of a custom integration for each.",
    module: "context-mapping",
  },
  "published-language": {
    term: "Published language",
    definition:
      "A well-documented shared format for exchanging domain information between contexts, often an industry data standard.",
    module: "context-mapping",
  },
  entity: {
    term: "Entity",
    definition:
      "An object defined by a lasting identity rather than its attributes: a customer stays the same customer even if their name, address and phone all change.",
    module: "aggregates",
  },
  "value-object": {
    term: "Value object",
    definition:
      "An object described only by its attributes, such as an amount of money or a date range. Two with the same attributes are interchangeable; treat them as immutable.",
    analogy: "Any ₹500 note is as good as another.",
    module: "aggregates",
  },
  aggregate: {
    term: "Aggregate",
    definition:
      "A cluster of entities and value objects that must stay consistent together, loaded and saved as one unit, with a single root that outside code talks to.",
    module: "aggregates",
  },
  "aggregate-root": {
    term: "Aggregate root",
    definition:
      "The one entity in an aggregate that outside code may hold a reference to; it enforces the aggregate's rules.",
    module: "aggregates",
  },
  invariant: {
    term: "Invariant",
    definition:
      "A business rule that must always be true, such as \"an order's total never exceeds the customer's limit\".",
    module: "aggregates",
  },
  "optimistic-concurrency": {
    term: "Optimistic concurrency",
    definition:
      "Letting several people edit without locks, then rejecting a save if the data changed since it was read, usually by checking a version number.",
    module: "aggregates",
  },
  repository: {
    term: "Repository",
    definition:
      "In DDD, an object that loads and saves whole aggregates, giving code the feel of an in-memory collection.",
    module: "aggregates",
  },
  "domain-event": {
    term: "Domain event",
    definition:
      'A record of something that happened that domain experts care about, named in the past tense ("Order placed") and never changed afterwards.',
    module: "aggregates",
  },
  "event-storming": {
    term: "EventStorming",
    definition:
      "Alberto Brandolini's workshop format for exploring a business domain: developers and domain experts write past-tense events on sticky notes along a timeline, then add their causes, problems and boundaries.",
    module: "event-storming",
  },
  "hot-spot": {
    term: "Hot spot",
    definition:
      "In EventStorming, a sticky note marking a question, disagreement or problem on the wall, to come back to later.",
    module: "event-storming",
  },
  "es-policy": {
    term: "Policy (EventStorming)",
    definition:
      'An automatic reaction written as "whenever this happens, do that": an event triggers a command somewhere else.',
    module: "event-storming",
  },
  eip: {
    term: "Enterprise Integration Patterns",
    definition:
      "Gregor Hohpe and Bobby Woolf's 2003 book cataloguing 65 patterns for connecting systems, mostly through messaging. Its names are still the standard vocabulary for integration.",
    module: "integration-styles",
  },
  "integration-style": {
    term: "Integration style",
    definition:
      "One of four basic ways for systems to share data or behaviour: file transfer, shared database, remote procedure invocation (calls) or messaging.",
    module: "integration-styles",
  },
  messaging: {
    term: "Messaging",
    definition:
      "Systems exchanging small packets of data (messages) through a messaging system that stores and delivers them, so sender and receiver needn't be available at the same time.",
    analogy: "Dropping a note in someone's letterbox rather than phoning them.",
    module: "integration-styles",
  },
  coupling: {
    term: "Coupling",
    definition:
      "How much one system depends on another: tightly coupled systems break or must change together; loosely coupled ones can change independently.",
    module: "integration-styles",
  },
} satisfies Record<string, GlossaryEntry>;
