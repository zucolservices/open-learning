/** A payments outage, decision by decision, with you as incident commander (illustrative). */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
  outcome: string;
  log: string;
}

export const DECISIONS: { time: string; prompt: string; choices: Choice[] }[] = [
  {
    time: "19:32",
    prompt:
      "UPI payments are failing for about 20% of customers. Two engineers are already poking at it in a chat thread. Do you declare an incident?",
    choices: [
      {
        id: "declare",
        label: "Yes: declare it now, open an incident channel and a live incident document",
        good: true,
        outcome:
          "Everyone knows where to go and who's in charge. If it turns out small, you close it early; that's cheap.",
        log: "19:32 Incident declared, SEV-2. IC: you.",
      },
      {
        id: "wait",
        label: "Not yet: give them half an hour to see if it's real",
        good: false,
        outcome:
          "At 20:05 it's worse, three teams are making changes without knowing about each other, and nobody has told support.",
        log: "20:05 Incident declared late, after confusion.",
      },
    ],
  },
  {
    time: "19:35",
    prompt: "Who does what?",
    choices: [
      {
        id: "roles",
        label:
          "Name an ops lead to drive the fix, a communications lead and a scribe; you coordinate",
        good: true,
        outcome:
          'You keep the big picture while others act. The SRE book: a clear separation of responsibilities gives people more autonomy, "since they need not second-guess their colleagues."',
        log: "19:35 Ops lead: Ravi. Comms: Meera. Scribe: Joe.",
      },
      {
        id: "solo",
        label: "Do it all yourself: you know the system best",
        good: false,
        outcome:
          "You're deep in a terminal while support, leadership and the bank all message you. Nothing gets your full attention.",
        log: "19:35 IC also debugging, answering messages, updating status.",
      },
    ],
  },
  {
    time: "19:50",
    prompt:
      "A senior engineer from another team says they'll just push a quick config change to the payment gateway.",
    choices: [
      {
        id: "throughops",
        label: "Thank them and route it through the ops lead, who decides and makes the change",
        good: true,
        outcome:
          "One group changes the system, so every change is known and logged. Their idea turns out to be part of the fix.",
        log: "19:52 Config change proposed, applied by ops lead.",
      },
      {
        id: "letthem",
        label: "Let them; every bit of help counts",
        good: false,
        outcome:
          "Their change and the ops lead's rollback collide. For ten minutes nobody knows which one made things better or worse.",
        log: "19:55 Two uncoordinated changes; state unclear.",
      },
    ],
  },
  {
    time: "20:00",
    prompt: "Customers are complaining online. The cause isn't known yet. What do you tell them?",
    choices: [
      {
        id: "update",
        label:
          "Post a status update now: what's affected, that you're working on it, and when the next update will come",
        good: true,
        outcome:
          "Support has something to point to and complaints calm down. Atlassian's advice: never go more than an hour without an update, and always say when the next one is due.",
        log: "20:00 Status page updated; next update by 20:30.",
      },
      {
        id: "silent",
        label: "Say nothing until you know the root cause",
        good: false,
        outcome:
          "Silence reads as indifference. Rumours spread, and support is flooded with the same question.",
        log: "20:00 No external update.",
      },
    ],
  },
  {
    time: "20:20",
    prompt: "The rollback worked: payments are back to normal. Is the incident over?",
    choices: [
      {
        id: "watch",
        label:
          "Watch for 30 minutes, post a resolved update, hand over cleanly and schedule the postmortem",
        good: true,
        outcome:
          "The fix holds, everyone knows it's over and the learning is booked in. Closed at 20:50.",
        log: "20:50 Resolved. Postmortem scheduled for Monday.",
      },
      {
        id: "close",
        label: "Close it immediately and everyone goes home",
        good: false,
        outcome:
          "At 21:10 errors creep back. Half the responders have left, and nobody wrote down what was changed.",
        log: "21:10 Errors return; incident reopened.",
      },
    ],
  },
];

export const SEVERITIES: [string, string][] = [
  ["SEV-1", "Critical issue that warrants public notification and liaison with executive teams."],
  ["SEV-2", "Critical system issue actively impacting many customers' ability to use the product."],
  [
    "SEV-3",
    "Stability or minor customer-impacting issues that require immediate attention from service owners.",
  ],
  [
    "SEV-4",
    "Minor issues requiring action, but not affecting customer ability to use the product.",
  ],
  ["SEV-5", "Cosmetic issues or bugs, not affecting customer ability to use the product."],
];
