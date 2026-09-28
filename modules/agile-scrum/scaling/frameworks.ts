/** Four scaling frameworks, reduced to where each puts coordination. Wording checked against each guide (Sept 2026). */

export type Fw = "nexus" | "less" | "safe" | "sas";

export interface Part {
  id: string;
  name: string;
  note: string;
}

export interface Framework {
  id: Fw;
  name: string;
  by: string;
  size: string;
  teams: number;
  line: string;
  rows: [string, Part[]][];
}

export const FRAMEWORKS: Framework[] = [
  {
    id: "nexus",
    name: "Nexus",
    by: "Scrum.org (Ken Schwaber); guide January 2021",
    size: "“approximately three to nine Scrum Teams”",
    teams: 5,
    line: "Scrum plus an integration team that makes sure the teams' work fits together every Sprint.",
    rows: [
      [
        "Who orders the work",
        [
          {
            id: "n-po",
            name: "One Product Owner",
            note: "One Product Owner and one Product Backlog for the whole Nexus.",
          },
        ],
      ],
      [
        "Where coordination lives",
        [
          {
            id: "n-nit",
            name: "Nexus Integration Team",
            note: "The Product Owner, a Scrum Master and members from the teams. Accountable for a working, integrated Increment every Sprint: it spots dependencies and integration problems early.",
          },
        ],
      ],
      [
        "Shared events",
        [
          {
            id: "n-plan",
            name: "Nexus Sprint Planning",
            note: "Representatives agree the Nexus Sprint Goal and who does what; then each team plans.",
          },
          {
            id: "n-daily",
            name: "Nexus Daily Scrum",
            note: "Representatives inspect integration issues daily. Teams still hold their own Daily Scrums.",
          },
          {
            id: "n-review",
            name: "One Nexus Sprint Review",
            note: "“A Nexus Sprint Review replaces individual Scrum Team Sprint Reviews”: stakeholders see one integrated product.",
          },
        ],
      ],
      [
        "Output",
        [
          {
            id: "n-inc",
            name: "Integrated Increment",
            note: "All teams' work, combined and meeting the Definition of Done, every Sprint.",
          },
        ],
      ],
    ],
  },
  {
    id: "less",
    name: "LeSS",
    by: "Craig Larman and Bas Vodde; rules November 2024",
    size: "2 to about 8 teams (Basic LeSS); LeSS Huge beyond",
    teams: 6,
    line: "“Scrum applied to many teams working together on one product”, with as little added as possible.",
    rows: [
      [
        "Who orders the work",
        [
          {
            id: "l-po",
            name: "One Product Owner",
            note: "One Product Owner, one Product Backlog, one Definition of Done and one Sprint for all teams.",
          },
          {
            id: "l-apo",
            name: "Area Product Owners (Huge)",
            note: "In LeSS Huge (8+ teams), work is grouped into Requirement Areas, each with an Area Product Owner and 4–8 teams.",
          },
        ],
      ],
      [
        "Where coordination lives",
        [
          {
            id: "l-teams",
            name: "Teams talk directly",
            note: "No extra coordination role: teams coordinate with each other directly, and all teams are expected to be feature teams. Motto: “more with less”.",
          },
        ],
      ],
      [
        "Shared events",
        [
          {
            id: "l-sp1",
            name: "Sprint Planning One",
            note: "Attended by the Product Owner and the teams together; then each team does its own Sprint Planning Two.",
          },
          {
            id: "l-review",
            name: "One Sprint Review",
            note: "One shared Sprint Review for the whole product.",
          },
          {
            id: "l-retro",
            name: "Overall Retrospective",
            note: "After the team retrospectives, an Overall Retrospective improves the whole system.",
          },
        ],
      ],
      [
        "Output",
        [
          {
            id: "l-inc",
            name: "One integrated product",
            note: "Each Sprint “results in an integrated whole product”.",
          },
        ],
      ],
    ],
  },
  {
    id: "safe",
    name: "SAFe",
    by: "Scaled Agile, Inc.; core version 6.0 (2023)",
    size: "Agile Release Trains of 50–125 people; several trains possible",
    teams: 10,
    line: "A detailed framework with roles and events at team, train and portfolio levels.",
    rows: [
      [
        "Who orders the work",
        [
          {
            id: "s-pm",
            name: "Product Management",
            note: "Owns the train's backlog of features; Product Owners work with each team. Business Owners take part at key moments.",
          },
        ],
      ],
      [
        "Where coordination lives",
        [
          {
            id: "s-art",
            name: "Agile Release Train",
            note: "A long-lived team of agile teams, “generally made up of 50–125 people”, that plans and delivers together.",
          },
          {
            id: "s-rte",
            name: "Release Train Engineer",
            note: "Facilitates the train's events and helps remove impediments: a Scrum Master for the train. A System Architect guides technical direction.",
          },
        ],
      ],
      [
        "Shared events",
        [
          {
            id: "s-pip",
            name: "PI Planning",
            note: "Every Planning Interval, “a timebox of 8–12 weeks”, the whole train plans together, typically over two days.",
          },
          {
            id: "s-sync",
            name: "ART Sync",
            note: "Regular syncs: a Coach Sync and a PO Sync keep the train on track.",
          },
          {
            id: "s-demo",
            name: "System Demo",
            note: "The integrated work of all teams is shown at the end of each iteration.",
          },
          {
            id: "s-ia",
            name: "Inspect & Adapt",
            note: "At the end of each PI: a demo, measures and a problem-solving workshop.",
          },
        ],
      ],
      [
        "Output",
        [
          {
            id: "s-out",
            name: "Configurations",
            note: "Essential, Large Solution, Portfolio and Full configurations add layers as needed. In June 2026 Scaled Agile added “AI-Native SAFe” alongside the core model.",
          },
        ],
      ],
    ],
  },
  {
    id: "sas",
    name: "Scrum@Scale",
    by: "Jeff Sutherland; guide v2.1, February 2022",
    size: "Scrums of Scrums of 4 or 5 teams, repeated as needed",
    teams: 5,
    line: "Treat a group of teams as if it were one Scrum team, and repeat the pattern: a “minimum viable bureaucracy”.",
    rows: [
      [
        "Who orders the work",
        [
          {
            id: "a-cpo",
            name: "Chief Product Owner",
            note: "Leads the team of Product Owners for a Scrum of Scrums; they order a shared backlog in a MetaScrum.",
          },
          {
            id: "a-ems",
            name: "Executive MetaScrum",
            note: "Leadership's forum for the “what”: stakeholders express preferences, negotiate priorities and budgets, at least once per Sprint.",
          },
        ],
      ],
      [
        "Where coordination lives",
        [
          {
            id: "a-sos",
            name: "Scrum of Scrums",
            note: "A team of teams, ideally 4 or 5, with its own Scrum of Scrums Master. Larger groups form a Scrum of Scrums of Scrums.",
          },
          {
            id: "a-eat",
            name: "Executive Action Team",
            note: "Leadership's group for the “how”: it fulfils the Scrum Master accountabilities for the whole organisation and removes impediments.",
          },
        ],
      ],
      [
        "Shared events",
        [
          {
            id: "a-sds",
            name: "Scaled Daily Scrum",
            note: "Representatives meet daily to spot impediments and dependencies across teams.",
          },
        ],
      ],
      [
        "Output",
        [
          {
            id: "a-inc",
            name: "Integrated Increment",
            note: "The teams in a Scrum of Scrums are responsible for “a fully integrated set of potentially shippable increments of product at the end of every Sprint”.",
          },
        ],
      ],
    ],
  },
];
