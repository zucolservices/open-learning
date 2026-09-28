/**
 * End of Sprint 4 on the citizen portal: a Sprint Review with the Revenue Department's officials,
 * then the team's Retrospective. Anti-pattern names in quotes are Stefan Wolpers' (Scrum.org).
 * Consequences are illustrative.
 */

export type Verdict = "good" | "risky" | "harm";

export interface Choice {
  id: string;
  label: string;
  verdict: Verdict;
  consequence: string;
  /** What the team ends up learning (or not) from this choice. */
  learned: string;
}

export interface Decision {
  id: string;
  event: "Review" | "Retrospective";
  question: string;
  context: string;
  choices: Choice[];
}

export const DECISIONS: Decision[] = [
  {
    id: "format",
    event: "Review",
    question: "How do you run the Sprint Review?",
    context:
      "Two officials from the Revenue Department and a district clerk have come. The Sprint delivered status tracking for applications.",
    choices: [
      {
        id: "slides",
        label: "A tidy slide deck of what was built, then questions at the end",
        verdict: "risky",
        consequence:
          "The officials nod politely and leave. Nobody touched the product, so nobody found anything. Wolpers calls this “Death by PowerPoint”.",
        learned: "Nothing new about what users need.",
      },
      {
        id: "session",
        label:
          "Hand the officials a phone: let them track a real test application, then decide together what's next",
        verdict: "good",
        consequence:
          "The district clerk immediately asks where the application reference number is; citizens always quote it on the phone. That becomes the top item for next Sprint.",
        learned: "Clerks look applications up by reference number, which the team had never heard.",
      },
      {
        id: "signoff",
        label: "A formal sign-off: officials approve or reject each feature",
        verdict: "harm",
        consequence:
          "It turns the Review into a gate, which the guide says it should never be. Officials hesitate to sign anything, and feedback becomes a negotiation.",
        learned: "Only which features got “approved”.",
      },
    ],
  },
  {
    id: "undone",
    event: "Review",
    question:
      "The SMS alert isn't Done: it works, but hasn't been tested with Hindi messages. What do you do?",
    context: "The officials were especially keen on SMS alerts.",
    choices: [
      {
        id: "demo",
        label: "Demo it anyway; it's nearly there",
        verdict: "harm",
        consequence:
          "The officials announce SMS alerts to the district offices. Two weeks later Hindi messages arrive garbled. Wolpers: “Undone is the new ‘done’”.",
        learned: "A false picture of progress.",
      },
      {
        id: "honest",
        label: "Say plainly that it isn't Done yet, explain why, and show only what is",
        verdict: "good",
        consequence:
          "Disappointing for a moment, but trusted. The item goes back to the Product Backlog and the officials know exactly where things stand.",
        learned: "An honest picture of progress, and that Hindi support matters to the officials.",
      },
      {
        id: "hide",
        label: "Don't mention it at all",
        verdict: "risky",
        consequence:
          "The officials ask about it on the way out. Silence looks like hiding, and trust dips.",
        learned: "Nothing, and some trust lost.",
      },
    ],
  },
  {
    id: "request",
    event: "Review",
    question: "An official asks: “Can we also get a weekly report of pending applications?”",
    context: "It's a reasonable idea, and nobody had thought of it.",
    choices: [
      {
        id: "promise",
        label: "A developer promises it for next Sprint on the spot",
        verdict: "risky",
        consequence:
          "It skips the Product Owner, who hasn't weighed it against the reference-number fix. Next Sprint starts with a promise nobody ordered.",
        learned: "A new idea, but an order decided in a hurry.",
      },
      {
        id: "backlog",
        label:
          "The Product Owner discusses it with them and adds it to the Product Backlog in the right place",
        verdict: "good",
        consequence:
          "The Review works as intended: “attendees collaborate on what to do next. The Product Backlog may also be adjusted to meet new opportunities.”",
        learned: "A new, well-placed item in the Product Backlog.",
      },
      {
        id: "refuse",
        label: "Politely decline: it's out of scope",
        verdict: "risky",
        consequence:
          "The officials stop suggesting things. The next good idea never reaches the team.",
        learned: "Nothing, and stakeholders who stop talking.",
      },
    ],
  },
  {
    id: "setup",
    event: "Retrospective",
    question: "How do you set up the Retrospective?",
    context:
      "The Sprint had a painful moment: Thursday's release failed and had to be rolled back.",
    choices: [
      {
        id: "managers",
        label: "Invite the delivery manager and the officials so they see you take it seriously",
        verdict: "harm",
        consequence:
          "People go quiet and say only safe things. Wolpers lists “Line managers present” and “Stakeholder alert” as retro anti-patterns.",
        learned: "Only what felt safe to say in front of managers.",
      },
      {
        id: "team",
        label: "Just the Scrum Team, Product Owner included, starting with the Prime Directive",
        verdict: "good",
        consequence:
          "Reading the Prime Directive aloud (“everyone did the best job they could, given what they knew at the time…”) sets a tone where people can speak honestly.",
        learned: "The real story of Thursday, told openly.",
      },
      {
        id: "skip",
        label: "Skip it this time; everyone is busy",
        verdict: "harm",
        consequence:
          "The same release problem is waiting for the next Sprint. Skipping the event loses the chance to inspect and adapt how you work.",
        learned: "Nothing. The failure will repeat.",
      },
    ],
  },
  {
    id: "failure",
    event: "Retrospective",
    question:
      "Thursday's release failed because the SMS configuration was wrong in production. How do you discuss it?",
    context: "Everyone knows who changed the setting.",
    choices: [
      {
        id: "blame",
        label: "Establish who made the mistake so it doesn't happen again",
        verdict: "harm",
        consequence:
          "The person who changed it stops volunteering for releases, and the next mistake gets hidden rather than reported.",
        learned: "Who to blame, which fixes nothing.",
      },
      {
        id: "system",
        label:
          "Look at how it could happen: settings are copied by hand, and test and production differ",
        verdict: "good",
        consequence:
          "The team finds the real cause: there's no automated check of production settings. Anyone could have made the same slip.",
        learned: "The process gap behind the failure.",
      },
      {
        id: "move",
        label: "It's fixed now; move on to happier topics",
        verdict: "risky",
        consequence: "Pleasant, but the gap is still there for next time.",
        learned: "Very little.",
      },
    ],
  },
  {
    id: "actions",
    event: "Retrospective",
    question: "What does the team agree to change?",
    context: "The board is full of sticky notes.",
    choices: [
      {
        id: "nine",
        label: "Nine action items, one for everyone",
        verdict: "risky",
        consequence:
          "By the next Retrospective, one is done. The rest reappear: Wolpers' “Groundhog day”.",
        learned: "A long list, and little change.",
      },
      {
        id: "one",
        label:
          "One concrete change with an owner: an automated check of production settings, added to the next Sprint Backlog",
        verdict: "good",
        consequence:
          "The Scrum Guide: “The most impactful improvements are addressed as soon as possible. They may even be added to the Sprint Backlog for the next Sprint.”",
        learned: "One real improvement that will actually happen.",
      },
      {
        id: "vague",
        label: "“Communicate better”",
        verdict: "risky",
        consequence: "Everyone agrees; nobody knows what to do differently on Monday.",
        learned: "A slogan, not a change.",
      },
    ],
  },
];
