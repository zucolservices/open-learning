/** Verbatim text from agilemanifesto.org (checked 2026-09-28). American spelling kept inside quotes. */

export const LEAD_IN =
  "We are uncovering better ways of developing software by doing it and helping others do it. Through this work we have come to value:";
export const CLOSING =
  "That is, while there is value in the items on the right, we value the items on the left more.";

export interface Value {
  left: string;
  right: string;
  means: string;
  example: string;
  notMeans: string;
}

export const VALUES: Value[] = [
  {
    left: "Individuals and interactions",
    right: "processes and tools",
    means:
      "Good people talking to each other solve more than any process or tool can. Processes and tools should serve the team, not replace conversation.",
    example:
      "The portal's tester spots a confusing form. She walks over and sorts it out with the developer in ten minutes, instead of raising a ticket that waits three days for triage.",
    notMeans:
      "It doesn't mean no process or no tools. Teams still use boards, pipelines and agreed ways of working.",
  },
  {
    left: "Working software",
    right: "comprehensive documentation",
    means:
      "The best evidence of progress is something that actually works. Documents describe; working software proves.",
    example:
      "Instead of a 60-page design for the certificate flow, the team shows a working first version to a district office after three weeks.",
    notMeans:
      "It doesn't mean no documentation. The manifesto's history page: “We embrace documentation, but not hundreds of pages of never-maintained and rarely-used tomes.”",
  },
  {
    left: "Customer collaboration",
    right: "contract negotiation",
    means:
      "Work with the customer as a partner throughout, not only at the start (to sign) and the end (to argue about what was signed).",
    example:
      "The department's officer joins a review every two weeks and helps decide what comes next, instead of waiting for a formal change request.",
    notMeans: "It doesn't mean no contracts. Contracts still matter; collaboration matters more.",
  },
  {
    left: "Responding to change",
    right: "following a plan",
    means:
      "When you learn something new, adjust. A plan is a tool for thinking ahead, not a promise to ignore what you find out.",
    example:
      "Users turn out to apply on phones, not desktops. The team re-plans the next weeks around a mobile form rather than finishing the desktop version first.",
    notMeans:
      "It doesn't mean no planning. The history page: “We plan, but recognize the limits of planning in a turbulent environment.”",
  },
];

export const PRINCIPLES: string[] = [
  "Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.",
  "Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage.",
  "Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.",
  "Business people and developers must work together daily throughout the project.",
  "Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.",
  "The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.",
  "Working software is the primary measure of progress.",
  "Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.",
  "Continuous attention to technical excellence and good design enhances agility.",
  "Simplicity—the art of maximizing the amount of work not done—is essential.",
  "The best architectures, requirements, and designs emerge from self-organizing teams.",
  "At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.",
];

/** Our grouping (not the manifesto's), to make twelve principles easier to hold in mind. */
export const THEMES: { id: string; label: string; items: number[]; gist: string }[] = [
  {
    id: "value",
    label: "Deliver value early",
    items: [1, 3, 7],
    gist: "Put working software in people's hands early and often, and judge progress by it.",
  },
  {
    id: "change",
    label: "Welcome change",
    items: [2],
    gist: "Late learning is an advantage if you can act on it.",
  },
  {
    id: "people",
    label: "People & collaboration",
    items: [4, 5, 6, 11],
    gist: "Motivated people, trusted, working closely with the business, organising themselves.",
  },
  {
    id: "craft",
    label: "Craft & simplicity",
    items: [9, 10],
    gist: "Good technical work keeps you able to change; do only what's needed.",
  },
  {
    id: "pace",
    label: "Sustainable pace",
    items: [8],
    gist: "A pace everyone can keep up forever, not sprints of overtime.",
  },
  {
    id: "improve",
    label: "Keep improving",
    items: [12],
    gist: "Stop regularly, look at how you work, and change it.",
  },
];

export const AUTHORS = [
  "Kent Beck",
  "Mike Beedle",
  "Arie van Bennekum",
  "Alistair Cockburn",
  "Ward Cunningham",
  "Martin Fowler",
  "James Grenning",
  "Jim Highsmith",
  "Andrew Hunt",
  "Ron Jeffries",
  "Jon Kern",
  "Brian Marick",
  "Robert C. Martin",
  "Steve Mellor",
  "Ken Schwaber",
  "Jeff Sutherland",
  "Dave Thomas",
];

export const REFLECTIONS = [
  {
    who: "Dave Thomas",
    when: "2014",
    title: "“Agile is Dead (Long Live Agility)”",
    quote: "Agile is not a noun, it's an adjective",
    gist: "The word had become a product to sell. He urged people to act with agility (take small steps, adjust from feedback) rather than buy “Agile”.",
  },
  {
    who: "Andy Hunt",
    when: "2015",
    title: "“The Failure of Agile”",
    quote: "sloganized; meaningless at best, jingoist at worst",
    gist: "Teams followed rituals by rote instead of adapting and experimenting, which was the whole point.",
  },
  {
    who: "Ron Jeffries",
    when: "2018",
    title: "“Developers Should Abandon Agile”",
    quote: "demands to “go faster”",
    gist: "Many developers experienced “agile” as imposed process and pressure, not the ideas the authors wrote down.",
  },
  {
    who: "Martin Fowler",
    when: "2018",
    title: "“The State of Agile Software in 2018”",
    quote: "faux-agile",
    gist: "He criticised an “Agile Industrial Complex” imposing methods on teams, the opposite of teams choosing how they work.",
  },
];
