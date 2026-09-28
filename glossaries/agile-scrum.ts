import type { GlossaryEntry } from "./types";

/** Agile & Scrum track glossary. `module` slugs refer to this track. */
export const agileScrum = {
  "plan-driven": {
    term: "Plan-driven (waterfall) delivery",
    definition:
      "Doing a project in one pass of phases: gather all requirements, design, build, test, then release. Each phase finishes before the next starts, and users see the result only at the end. Also called predictive or \u201cwaterfall\u201d.",
    module: "why-plans-break",
  },
  "iterative-development": {
    term: "Iterative development",
    definition:
      "Building a product in repeated short cycles, each producing something working that people can try, so that what is learned in one cycle shapes the next.",
    analogy: "Cooking by tasting as you go, instead of following a recipe blind until the end.",
    module: "why-plans-break",
  },
  "feedback-loop": {
    term: "Feedback loop",
    definition:
      "The cycle of doing something, seeing the result and adjusting. The shorter the loop, the sooner mistakes are found and the cheaper they are to fix.",
    module: "why-plans-break",
  },
  "big-bang-release": {
    term: "Big-bang release",
    definition:
      "Launching a whole new system to everyone at once, often on a fixed date, instead of piloting it or rolling it out in stages. Any surprise hits every user at the same time.",
    module: "why-plans-break",
  },
  "agile-manifesto": {
    term: "Agile Manifesto",
    definition:
      "The Manifesto for Agile Software Development (2001): four values and twelve principles written by seventeen software practitioners. It prefers individuals and interactions, working software, customer collaboration and responding to change, while still valuing processes, documentation, contracts and plans.",
    module: "agile-manifesto",
  },
  "sustainable-pace": {
    term: "Sustainable pace",
    definition:
      "Working at a pace the team, sponsors and users could keep up indefinitely, without relying on overtime. Principle 8 of the Agile Manifesto.",
    module: "agile-manifesto",
  },
  empiricism: {
    term: "Empiricism",
    definition:
      "Deciding from what is actually observed rather than from what was assumed or planned. The Scrum Guide: \u201cknowledge comes from experience and making decisions based on what is observed.\u201d",
    module: "inspect-adapt",
  },
  "three-pillars": {
    term: "Transparency, inspection, adaptation",
    definition:
      "Scrum's three pillars of empiricism. Make the real state of the work visible; look at it frequently to spot problems; change course as soon as a problem is found. Each enables the next.",
    module: "inspect-adapt",
  },
  "empirical-process-control": {
    term: "Defined vs empirical process control",
    definition:
      "Two ways of controlling a process. A defined process is well understood and gives the same result every time, so it can simply be followed. An empirical process is too complex or unpredictable for that, so it is controlled by frequent inspection and adjustment.",
    module: "inspect-adapt",
  },
  scrum: {
    term: "Scrum",
    definition:
      "\u201cA lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems\u201d (Scrum Guide 2020). A small team works in fixed-length Sprints, with three accountabilities, five events and three artifacts.",
    module: "scrum-on-one-page",
  },
  accountability: {
    term: "Accountability (Scrum)",
    definition:
      "What the Scrum Guide calls its three responsibilities: Product Owner, Scrum Master and Developers. They are accountabilities within one team, not job titles or a hierarchy.",
    module: "scrum-on-one-page",
  },
  "scrum-artifact": {
    term: "Artifact (Scrum)",
    definition:
      "Something that makes work or value visible: the Product Backlog, the Sprint Backlog and the Increment. Each has a commitment: the Product Goal, the Sprint Goal and the Definition of Done.",
    module: "scrum-on-one-page",
  },
  sprint: {
    term: "Sprint",
    definition:
      "A fixed-length period of one month or less in which a Scrum Team turns ideas into a usable Increment. It contains all the other Scrum events, and a new Sprint starts as soon as the previous one ends.",
    module: "scrum-on-one-page",
  },
  timebox: {
    term: "Timebox",
    definition:
      "A fixed maximum length for an event or piece of work. In Scrum every event is timeboxed; ending early is fine once the purpose is met.",
    module: "scrum-on-one-page",
  },
  "product-owner": {
    term: "Product Owner",
    definition:
      "The one person accountable for maximising the value of the product: sets the Product Goal and orders the Product Backlog. Others who want changes persuade the Product Owner.",
    module: "who-decides",
  },
  "scrum-master": {
    term: "Scrum Master",
    definition:
      "Accountable for establishing Scrum and for the team's effectiveness: coaches, makes sure impediments get removed and keeps events useful. Serves the team and organisation; does not direct the work.",
    module: "who-decides",
  },
  developers: {
    term: "Developers (Scrum)",
    definition:
      "Everyone in the Scrum Team who creates the Increment, whatever their skill: programmers, testers, designers, analysts. They plan the Sprint, size the work and decide how to do it.",
    module: "who-decides",
  },
  "self-managing": {
    term: "Self-managing team",
    definition:
      "A team that decides internally who does what, when and how, rather than being assigned tasks by a manager.",
    module: "who-decides",
  },
  "sprint-planning": {
    term: "Sprint Planning",
    definition:
      "The event that starts a Sprint. The Scrum Team agrees why the Sprint is valuable (the Sprint Goal), the Developers select what can be Done, and they plan how. At most eight hours for a one-month Sprint; usually shorter for shorter Sprints.",
    module: "sprint-planning",
  },
  "story-points": {
    term: "Story points",
    definition:
      "A relative size for a backlog item (bigger number, more work or uncertainty), used by many teams for forecasting. An optional practice: the Scrum Guide doesn't mention it.",
    module: "sprint-planning",
  },
  velocity: {
    term: "Velocity",
    definition:
      "How much work (often in story points) a team actually finished in recent Sprints, used by that team to forecast. Optional, not in the Scrum Guide, and not a measure of productivity or a way to compare teams.",
    module: "sprint-planning",
  },
  "daily-scrum": {
    term: "Daily Scrum",
    definition:
      "A 15-minute event for the Developers, at the same time and place every working day, to inspect progress towards the Sprint Goal and adjust the plan. The Developers choose its format. Often called the stand-up, a name from Extreme Programming.",
    module: "daily-scrum",
  },
  "walk-the-board": {
    term: "Walking the board",
    definition:
      "Running a stand-up by going through the work items on the team's board from nearest-done to newest (usually right to left), asking what each needs to move on, instead of asking each person for a report.",
    module: "daily-scrum",
  },
  "sprint-review": {
    term: "Sprint Review",
    definition:
      "The second-to-last event of a Sprint: the Scrum Team and key stakeholders inspect what was built and decide together what to do next. A working session, not a presentation or a sign-off gate.",
    module: "review-retro",
  },
  retrospective: {
    term: "Sprint Retrospective",
    definition:
      "The event that concludes a Sprint: the Scrum Team looks at how it worked (people, interactions, processes, tools and the Definition of Done) and picks the most helpful improvements.",
    module: "review-retro",
  },
  "psychological-safety": {
    term: "Psychological safety",
    definition:
      "Amy Edmondson's term for \u201ca shared belief held by members of a team that the team is safe for interpersonal risk taking\u201d: people can admit mistakes, ask questions and disagree without fear.",
    module: "review-retro",
  },
  "definition-of-done": {
    term: "Definition of Done",
    definition:
      "The formal quality bar an Increment must meet, shared by everyone working on the product. Work that doesn't meet all of it isn't Done, can't be released, and goes back to the Product Backlog.",
    module: "artifacts",
  },
  "product-goal": {
    term: "Product Goal",
    definition:
      "A future state of the product that the Scrum Team plans against: the long-term objective, and the Product Backlog's commitment. The team fulfils (or abandons) one before taking on the next.",
    module: "artifacts",
  },
  refinement: {
    term: "Backlog refinement",
    definition:
      "Breaking down and further defining Product Backlog items (adding description, order and size) until they can be Done within a Sprint. An ongoing activity, not an event.",
    module: "artifacts",
  },
  "user-story": {
    term: "User story",
    definition:
      "A short description of something a person needs and why, often written \u201cAs a…, I want…, so that…\u201d. A placeholder for a conversation, confirmed by acceptance criteria. A popular practice, not part of Scrum itself.",
    module: "user-stories",
  },
  invest: {
    term: "INVEST",
    definition:
      "Bill Wake's checklist for good stories (2003): Independent, Negotiable, Valuable, Estimable, Small, Testable.",
    module: "user-stories",
  },
  "acceptance-criteria": {
    term: "Acceptance criteria",
    definition:
      "The conditions one backlog item must meet to be accepted, often written as Given/When/Then scenarios. Specific to that item; the Definition of Done applies to every item.",
    module: "user-stories",
  },
  "vertical-slice": {
    term: "Vertical slice",
    definition:
      "A piece of work that delivers a small, usable change through every technical layer it needs (screens, logic, data), rather than one layer of a big feature.",
    analogy: "A slice of layer cake cut top to bottom, instead of just the icing.",
    module: "splitting-stories",
  },
  "walking-skeleton": {
    term: "Walking skeleton",
    definition:
      "Alistair Cockburn's term for a tiny implementation of a system that performs a small end-to-end function, linking the main parts together. Often the best first slice of a new feature.",
    module: "splitting-stories",
  },
  spike: {
    term: "Spike",
    definition:
      "A timeboxed investigation to answer a question (usually technical) so that other work can be sized. From Extreme Programming; best used sparingly.",
    module: "splitting-stories",
  },
  "cost-of-delay": {
    term: "Cost of delay",
    definition:
      "What it costs to have something later rather than sooner, usually expressed as value lost per week of waiting. Don Reinertsen: \u201cIf you only quantify one thing, quantify the cost of delay.\u201d",
    module: "ordering-backlog",
  },
  wsjf: {
    term: "WSJF / CD3",
    definition:
      "Weighted Shortest Job First: order work by cost of delay divided by duration (also called CD3), so short, valuable items go first. From Don Reinertsen; SAFe uses a relative-points version.",
    module: "ordering-backlog",
  },
  moscow: {
    term: "MoSCoW",
    definition:
      "Sorting requirements into Must Have, Should Have, Could Have and Won't Have this time (DSDM; Dai Clegg, 1994). Useful for agreeing scope; it doesn't set an order within or across the groups.",
    module: "ordering-backlog",
  },
  kanban: {
    term: "Kanban",
    definition:
      "\u201cA strategy for optimizing the flow of value through a process\u201d (Kanban Guide): define and visualise the workflow, actively manage the items in it, and improve it. Its roots are in Toyota's production system.",
    module: "kanban-wip",
  },
  wip: {
    term: "Work in progress (WIP)",
    definition:
      "Items that have been started but not finished. Teams explicitly control it, usually with WIP limits: a maximum number of items allowed in a column or stage.",
    module: "kanban-wip",
  },
  "littles-law": {
    term: "Little's Law",
    definition:
      "Average cycle time = average work in progress \u00f7 average throughput, over a period. It describes past averages (and the future only for a stable system); it can't forecast when one item will finish.",
    module: "kanban-wip",
  },
  burndown: {
    term: "Burndown chart",
    definition:
      "A chart of work remaining (up) against time (across), often for one Sprint, with an \u201cideal\u201d straight line to zero. Plateaus suggest blockers; late cliffs suggest work closed in a batch.",
    module: "reading-charts",
  },
  burnup: {
    term: "Burnup chart",
    definition:
      "A chart with two lines over time: work completed and total scope. Where they meet, the work is done. It shows scope growth separately from progress.",
    module: "reading-charts",
  },
  cfd: {
    term: "Cumulative flow diagram (CFD)",
    definition:
      "Stacked bands showing how many items have reached each workflow state over time. A band's height is roughly the work in that state, its width roughly the average time there, and the Done line's slope is throughput.",
    module: "reading-charts",
  },
  scrumban: {
    term: "Scrumban",
    definition:
      "A family of hybrids that add Kanban practices (visual flow, pull, WIP limits) to Scrum-style teams. The name comes from Corey Ladas's 2008 essay and 2009 book; it isn't an official framework with a guide.",
    module: "choose-a-way",
  },
  "technical-debt": {
    term: "Technical debt",
    definition:
      "Shortcuts and unfinished work in a product that make every later change slower, like interest on a loan. Ward Cunningham introduced the debt metaphor in 1992. Some debt is a sensible trade if it's visible and paid back soon.",
    module: "done-means-done",
  },
  wcag: {
    term: "WCAG",
    definition:
      "Web Content Accessibility Guidelines, the W3C standard for making websites usable by people with disabilities. Level AA is the usual target; India's GIGW 3.0 guidelines for government websites require WCAG 2.1 Level AA.",
    module: "done-means-done",
  },
  "batch-size": {
    term: "Batch size",
    definition:
      "How much work moves through a step together: for example, how many changes go into one release. Smaller batches mean faster feedback and lower risk, as long as the cost of each batch stays low.",
    module: "small-batches",
  },
  "continuous-integration": {
    term: "Continuous integration (CI)",
    definition:
      "Everyone merges their changes into the shared code at least daily, and an automated build with tests checks each merge. Kent Beck's Extreme Programming made it a standard practice.",
    module: "small-batches",
  },
  xp: {
    term: "Extreme Programming (XP)",
    definition:
      "An agile method created by Kent Beck in the late 1990s (book, 1999). It is best known for its engineering practices: test-driven development, pair programming, refactoring, continuous integration and small releases.",
    module: "small-batches",
  },
  tdd: {
    term: "Test-driven development (TDD)",
    definition:
      "Write a small failing test first (red), write just enough code to pass it (green), then tidy the code (refactor), and repeat. Popularised by Kent Beck.",
    module: "small-batches",
  },
  refactoring: {
    term: "Refactoring",
    definition:
      "In Martin Fowler's words, “a change made to the internal structure of software to make it easier to understand and cheaper to modify without changing its observable behavior”.",
    module: "small-batches",
  },
  "pair-programming": {
    term: "Pair programming",
    definition:
      "Two developers working together at one screen, one typing and one reviewing and thinking ahead, swapping roles often. Research finds modest quality gains for more total effort, depending on the task.",
    module: "small-batches",
  },
  "trunk-based": {
    term: "Trunk-based development",
    definition:
      "Developers merge small changes into one main line (the “trunk”) at least daily, with very few short-lived branches, instead of long-running feature branches.",
    module: "small-batches",
  },
  "feature-flag": {
    term: "Feature flag",
    definition:
      "A switch in the code that turns a feature on or off without a new release. It lets unfinished work be merged safely. Old flags should be removed, since forgotten ones cause bugs.",
    module: "small-batches",
  },
  "dora-metrics": {
    term: "DORA metrics",
    definition:
      "Software delivery measures from the DevOps Research and Assessment (DORA) programme at Google: change lead time, deployment frequency, failed deployment recovery time, change fail rate and deployment rework rate.",
    module: "small-batches",
  },
  "proxy-product-owner": {
    term: "Proxy Product Owner",
    definition:
      "Not a Scrum Guide role: a stand-in (often an onsite or offshore coordinator) who relays for the client's real decision-maker. Without real authority it becomes a bottleneck; the real Product Owner stays accountable.",
    module: "client-distributed",
  },
  "scaling-framework": {
    term: "Scaling framework",
    definition:
      "A set of roles, events and rules for coordinating several agile teams working on one product. Examples: Nexus, LeSS, SAFe and Scrum@Scale.",
    module: "scaling",
  },
  nexus: {
    term: "Nexus",
    definition:
      "Scrum.org's scaling framework for “approximately three to nine Scrum Teams” on one product. It adds a Nexus Integration Team accountable for an integrated Increment every Sprint.",
    module: "scaling",
  },
  less: {
    term: "LeSS (Large-Scale Scrum)",
    definition:
      "Craig Larman and Bas Vodde's framework: “Scrum applied to many teams working together on one product”, with one Product Owner, one Product Backlog and one Sprint. Motto: “more with less”.",
    module: "scaling",
  },
  safe: {
    term: "SAFe (Scaled Agile Framework)",
    definition:
      "Scaled Agile, Inc.'s framework. Teams form Agile Release Trains of 50–125 people that plan together every 8–12 weeks in PI Planning, with roles and events at team, train and portfolio levels.",
    module: "scaling",
  },
  "scrum-at-scale": {
    term: "Scrum@Scale",
    definition:
      "Jeff Sutherland's framework: groups of 4 or 5 teams form a Scrum of Scrums, repeated as needed, with an Executive Action Team and an Executive MetaScrum at the top.",
    module: "scaling",
  },
  "feature-team": {
    term: "Feature team",
    definition:
      "A long-lived team that can build a whole customer feature across every layer (screens, logic, data), instead of owning one component or layer.",
    module: "scaling",
  },
  "product-backlog": {
    term: "Product Backlog",
    definition:
      "The Scrum Guide's “emergent, ordered list of what is needed to improve the product”. The Product Owner is accountable for ordering it. Every agile tool has one, under some name.",
    module: "tools",
  },
  "work-item": {
    term: "Work item",
    definition:
      "A generic name for one tracked piece of work (a story, task or bug) in tools such as Azure Boards, GitLab and, since 2025, Jira, which used to call them “issues”.",
    module: "tools",
  },
  "anti-pattern": {
    term: "Anti-pattern",
    definition:
      "A common response to a problem that looks sensible but usually makes things worse, for example making velocity a target or holding “hardening Sprints”.",
    module: "anti-patterns",
  },
  "goodharts-law": {
    term: "Goodhart's law",
    definition:
      "Economist Charles Goodhart's 1975 observation, popularly phrased by Marilyn Strathern (1997): “When a measure becomes a target, it ceases to be a good measure.”",
    module: "anti-patterns",
  },
  "zombie-scrum": {
    term: "Zombie Scrum",
    definition:
      "Scrum that “looks like Scrum from a distance but lacks a beating heart”: the events happen, but there's no working product, no user contact, no drive to improve and no autonomy. Named by Verwijs, Schartau and Overeem.",
    module: "anti-patterns",
  },
  "work-item-age": {
    term: "Work Item Age",
    definition:
      "“The elapsed time between when a work item started and the current date” (Kanban Guide, 2025). You can read it before an item finishes, so old items are an early warning.",
    module: "struggling-team",
  },
  "theory-of-constraints": {
    term: "Theory of Constraints",
    definition:
      "Eliyahu Goldratt's idea (The Goal, 1984, with Jeff Cox) that every system has one constraint limiting its output. Improve it and another becomes the constraint.",
    module: "struggling-team",
  },
} satisfies Record<string, GlossaryEntry>;
