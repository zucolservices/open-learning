/**
 * Three Daily Scrums that go wrong, on the citizen-portal team. Smell and pattern names are from
 * Jason Yip, "It's Not Just Standing Up: Patterns for Daily Standup Meetings" (martinfowler.com,
 * 2016). The transcripts are illustrative.
 */

export interface Line {
  who: string;
  text: string;
}

export interface Option {
  id: string;
  label: string;
  right?: boolean;
  feedback: string;
}

export interface Standup {
  id: string;
  title: string;
  setting: string;
  lines: Line[];
  smells: Option[];
  fixes: Option[];
  better: Line[];
  source: string;
}

export const STANDUPS: Standup[] = [
  {
    id: "leader",
    title: "Day 3: everyone faces the manager",
    setting:
      "9:30, by the team's screen. The vendor's delivery manager, Anita, has started attending.",
    lines: [
      { who: "Anita", text: "Okay, let's go round. Ravi?" },
      {
        who: "Ravi",
        text: "Anita, yesterday I finished the status page layout. Today I'll wire up the API.",
      },
      { who: "Anita", text: "Good. Priya?" },
      { who: "Priya", text: "Anita, I'm still on the SMS integration. Should be done soon." },
      { who: "Anita", text: "Soon is when? I need to tell the client. …Okay, next." },
    ],
    smells: [
      {
        id: "leader",
        label: "People are reporting to the manager, not talking to each other",
        right: true,
        feedback:
          "That's Yip's smell “Reporting to the Leader”: team members face and talk to the manager, so the stand-up becomes hers, when “it is actually supposed to be for the team.”",
      },
      {
        id: "long",
        label: "It's taking too long",
        feedback: "It's short. The problem is who it's for: nobody is replanning together.",
      },
      {
        id: "detail",
        label: "People aren't giving enough detail",
        feedback:
          "More detail for Anita would make it worse. The Developers need to coordinate with each other, not report upwards.",
      },
    ],
    fixes: [
      {
        id: "team",
        label:
          "The Developers run it for themselves, talking to each other about the Sprint Goal; Anita gets status some other way (the board, the Sprint Review)",
        right: true,
        feedback:
          "Yes. The Daily Scrum is “a 15-minute event for the Developers”. Yip's fixes include “Rotate the Facilitator” and “Break Eye Contact”, so nobody speaks to one person.",
      },
      {
        id: "ban",
        label: "Ban managers from the building",
        feedback:
          "Stakeholders can be welcome elsewhere; the fix is making this event serve the Developers, not excluding people from the company.",
      },
      {
        id: "form",
        label: "Replace it with a daily status form Anita reviews",
        feedback: "That removes the team's daily replanning altogether.",
      },
    ],
    better: [
      {
        who: "Ravi",
        text: "Status page is up. I need Priya's SMS hook to finish the flow. Priya, what's left?",
      },
      { who: "Priya", text: "The gateway rejects Hindi messages. I could use a hand after this." },
      { who: "Karan", text: "I've fixed that encoding before. Let's pair straight after." },
      {
        who: "Ravi",
        text: "Then we're on track for the goal. I'll take the audit bit off the board for now.",
      },
    ],
    source: "Yip: “Reporting to the Leader”, “Rotate the Facilitator”, “Break Eye Contact”",
  },
  {
    id: "debug",
    title: "Day 6: the 25-minute stand-up",
    setting: "Everyone standing. Karan has hit a hard bug.",
    lines: [
      {
        who: "Karan",
        text: "So the SMS gateway times out, but only for some numbers, and I thought it was DNS, so I checked…",
      },
      {
        who: "Karan",
        text: "…then I tried increasing the timeout, which helped a bit, but then the retry logic…",
      },
      {
        who: "Ravi",
        text: "Did you check whether it's the carrier? Last year on another project we had…",
      },
      { who: "Karan", text: "No, but it could be the queue. Let me show you the logs…" },
      { who: "Meena", text: "(checking the time, quietly) We're at 25 minutes." },
    ],
    smells: [
      {
        id: "solve",
        label: "Two people are solving a problem while everyone else waits",
        right: true,
        feedback:
          "Yip calls these smells “Story Telling” (“Tell the headline, not the whole story”) and “Problem Solving”: the stand-up is “a time to raise issues and surface ideas, not a time for in-depth problem-solving.”",
      },
      {
        id: "stand",
        label: "They should have sat down",
        feedback:
          "Sitting would make it even longer. The issue is what they're doing, not their posture.",
      },
      {
        id: "karan",
        label: "Karan shouldn't have mentioned the bug",
        feedback:
          "Raising the impediment is exactly right. Solving it in front of everyone is the problem.",
      },
    ],
    fixes: [
      {
        id: "offline",
        label:
          "Karan gives the headline (“SMS timeouts are blocking the goal”), and whoever can help takes it offline straight after",
        right: true,
        feedback:
          "Yes: Yip's pattern “Take it Offline”. The Scrum Guide adds that Developers “often meet throughout the day for more detailed discussions”.",
      },
      {
        id: "longer",
        label: "Make the Daily Scrum 45 minutes to fit problems in",
        feedback:
          "It's “a 15-minute event”. Longer meetings for everyone don't fix a problem that needs two people.",
      },
      {
        id: "email",
        label: "Tell Karan to email everyone about it instead",
        feedback:
          "That hides a blocker the team should know about. Raise it briefly, then solve it with the right people.",
      },
    ],
    better: [
      {
        who: "Karan",
        text: "Headline: SMS timeouts for some numbers. It's blocking status updates, so it's on the goal.",
      },
      {
        who: "Ravi",
        text: "I've seen carrier issues cause that. Take it offline with me right after?",
      },
      { who: "Karan", text: "Yes. Meena, can you pick up the draft-save item meanwhile?" },
      { who: "Meena", text: "Sure. That's everything; done in eight minutes." },
    ],
    source:
      "Yip: “Story Telling”, “Problem Solving”, “Take it Offline”; Agile Alliance on the “parking lot”",
  },
  {
    id: "questions",
    title: "Day 8: three questions, nobody looks at the goal",
    setting:
      "Two days left in the Sprint. The Sprint Goal: citizens can track their application's status.",
    lines: [
      { who: "Ravi", text: "Yesterday: code review. Today: more review. No blockers." },
      { who: "Priya", text: "Yesterday: SMS tests. Today: SMS tests. No blockers." },
      { who: "Karan", text: "Yesterday: the audit log. Today: the audit log. No blockers." },
      { who: "Meena", text: "Yesterday: helped Karan. Today: will help whoever. No blockers." },
      {
        who: "(board)",
        text: "“Read status from the department's system” has sat in Review for three days.",
      },
    ],
    smells: [
      {
        id: "runners",
        label: "Everyone reports on themselves; nobody looks at the work that's stuck",
        right: true,
        feedback:
          "Yip's smell: “Focused on the Runners, not the Baton”. The item the goal depends on has been stuck for three days and nobody mentions it.",
      },
      {
        id: "blockers",
        label: "Someone is lying about blockers",
        feedback:
          "Probably not. Each person honestly has no personal blocker. The work is blocked, and the format hides it.",
      },
      {
        id: "short",
        label: "It was too short",
        feedback: "Short is fine. It just focused on the wrong thing.",
      },
    ],
    fixes: [
      {
        id: "walk",
        label:
          "Walk the board right to left: start with the items nearest Done, ask what it takes to finish them, and replan towards the goal",
        right: true,
        feedback:
          "Yes: Yip's “Walk the Board” (“from end of process to start of process (e.g., right-to-left)”) and “Work Items Attend”: people speak for the work, not for themselves.",
      },
      {
        id: "fourth",
        label: "Add a fourth question: “Are you really sure there are no blockers?”",
        feedback:
          "More questions about people won't surface a stuck item. Look at the work itself.",
      },
      {
        id: "manager",
        label: "Ask a manager to check the board each evening",
        feedback: "The Developers need to see and act on it themselves, every day.",
      },
    ],
    better: [
      {
        who: "Ravi",
        text: "Right to left. Nothing's Done yet. In Review: “read status”, stuck three days. Who can review it today?",
      },
      { who: "Karan", text: "Me. The audit log isn't on the goal; I'll park it." },
      { who: "Priya", text: "Once that's merged I can connect SMS to it tomorrow." },
      {
        who: "Ravi",
        text: "Then the goal is still reachable. Let's tell the Product Owner the audit log slips.",
      },
    ],
    source: "Yip: “Focused on the Runners, not the Baton”, “Walk the Board”, “Work Items Attend”",
  },
];
