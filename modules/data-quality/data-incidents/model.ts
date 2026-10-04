/** A data incident, decision by decision: Monday's revenue is doubled (illustrative). */

export interface Choice {
  id: string;
  label: string;
  good: boolean;
  outcome: string;
  log: string;
}

export const DECISIONS: { time: string; prompt: string; choices: Choice[] }[] = [
  {
    time: "09:10",
    prompt:
      "The head of sales posts in #analytics: “Sunday's revenue on the dashboard is double what the tills say.” You check: fct_orders has twice the usual rows for Sunday. What now?",
    choices: [
      {
        id: "declare",
        label: "Declare a data incident: open a channel and a live incident document",
        good: true,
        outcome:
          "Users can see it and it touches finance, so it qualifies. Everyone now knows where to look and who's in charge.",
        log: "09:12 Data incident declared, SEV-2. IC: you. Doc: #inc-sunday-revenue.",
      },
      {
        id: "quiet",
        label: "Quietly start digging; no need to alarm anyone yet",
        good: false,
        outcome:
          "Three analysts find the same problem separately. Finance, unaware, starts preparing the weekly report from the bad numbers.",
        log: "09:40 Three people investigating separately; finance unaware.",
      },
    ],
  },
  {
    time: "09:15",
    prompt: "Who does what?",
    choices: [
      {
        id: "roles",
        label:
          "You coordinate; the orders pipeline owner investigates and is the only one changing data; an analyst handles updates",
        good: true,
        outcome: "One person changes the data, so every change is known. You keep the big picture.",
        log: "09:15 Ops: Asha (pipeline owner). Comms: Leo. IC coordinates.",
      },
      {
        id: "all",
        label: "Everyone who can, jump in and try fixes",
        good: false,
        outcome:
          "Someone deletes rows by hand while someone else reruns the job. Nobody's sure what state Sunday is in.",
        log: "09:30 Two uncoordinated changes to fct_orders.",
      },
    ],
  },
  {
    time: "09:25",
    prompt: "Asha thinks it'll take an hour or two to find the cause. Meanwhile?",
    choices: [
      {
        id: "contain",
        label: "Stop the spread: banner on the dashboard, pause the nightly finance export",
        good: true,
        outcome:
          "Nobody else consumes the bad numbers while the fix happens. Mitigation needs to know where the problem is, not why.",
        log: "09:27 Dashboard flagged 'known issue'. Finance export paused.",
      },
      {
        id: "fixfirst",
        label: "Leave everything running; it'll be fixed soon",
        good: false,
        outcome:
          "At 10:00 the finance export sends doubled revenue to the accounting system, which now needs fixing too.",
        log: "10:00 Bad data exported to accounting.",
      },
    ],
  },
  {
    time: "09:35",
    prompt: "What do you tell the people who use this data?",
    choices: [
      {
        id: "update",
        label:
          "What's affected (Sunday, fct_orders and its reports), what to do (don't use it), next update at 10:30",
        good: true,
        outcome:
          "Sales and finance stop asking in five channels. They know what's safe and when they'll hear more.",
        log: "09:36 Update 1 posted to consumers. Next: 10:30.",
      },
      {
        id: "silence",
        label: "Nothing until you know the cause",
        good: false,
        outcome:
          "Rumours spread that 'the data is broken'. People stop trusting reports that were fine.",
        log: "10:15 Five questions in five channels; trust slipping.",
      },
    ],
  },
  {
    time: "10:40",
    prompt:
      "Cause found: the load timed out, was retried, and the retry appended Sunday's orders a second time. How do you repair it?",
    choices: [
      {
        id: "backfill",
        label: "Re-run Sunday as a backfill that replaces the whole day's partition",
        good: true,
        outcome:
          "The day is rebuilt from source in one known step, and running it again would give the same result.",
        log: "10:55 Sunday partition replaced by backfill. Row count matches source.",
      },
      {
        id: "hand",
        label: "Delete the duplicate rows by hand in production",
        good: false,
        outcome:
          "There are no unique IDs to tell copies apart, so the delete guesses. Sunday is now 3% short.",
        log: "11:10 Manual delete; Sunday now under-counted.",
      },
    ],
  },
  {
    time: "Tue",
    prompt: "The data is right again. What happens next?",
    choices: [
      {
        id: "review",
        label: "A blameless review: timeline, impact, causes, and owned follow-ups",
        good: true,
        outcome:
          "Follow-ups: make the load idempotent, add a unique test on order_id, add a volume monitor. The retry wasn't anyone's fault; the design allowed it.",
        log: "Tue: Review held. 3 follow-ups with owners and dates.",
      },
      {
        id: "blame",
        label: "Find out who triggered the retry and make sure they don't again",
        good: false,
        outcome:
          "People learn to hide mistakes. The load is still not idempotent, and it happens again next month.",
        log: "Tue: Person blamed. No changes to the pipeline.",
      },
    ],
  },
];

export const SEVERITIES: [string, string, string][] = [
  [
    "SEV-1",
    "Wrong data reaching customers, regulators or money movements; data lost",
    "Wake people up; all hands",
  ],
  [
    "SEV-2",
    "Key internal reports wrong or late; several teams affected",
    "Respond now, in working hours",
  ],
  ["SEV-3", "One dataset degraded; a workaround exists", "Fix in the normal queue"],
];
