/**
 * A two-week Sprint, 12–23 October 2026, for a clinic chain's appointment app. Dussehra
 * (Tuesday 20 October) is a holiday, so there are nine working days. Five Developers each finish
 * about 0.48 points a day (a velocity of about 24 over ten days). Illustrative numbers.
 *
 * Priority: an urgent bug first, then Sprint Goal items, then the rest. But a badly overloaded
 * Sprint spreads effort over everything at once, so the goal items finish late.
 */

export const DAYS = [
  "Mon 12",
  "Tue 13",
  "Wed 14",
  "Thu 15",
  "Fri 16",
  "Mon 19",
  "Wed 21",
  "Thu 22",
  "Fri 23",
];
export const HOLIDAY_AFTER = 5; // Dussehra falls between day 5 (Mon 19) and day 6 (Wed 21)
const DEVS = 5;
const RATE = 0.48;
export const FORECAST = Math.round(DAYS.length * DEVS * RATE * 10) / 10; // 21.6
const GOAL = 13;
const SICK_DAYS = [5, 6, 7];

export interface Choice {
  id: string;
  label: string;
  fit: "good" | "care" | "poor";
  result: string;
}

export interface Event {
  id: "plan" | "side" | "sick" | "bug" | "review" | "retro";
  day: number; // happens at the start of this working day (DAYS.length = after the last day)
  title: string;
  text: string;
  choices: Choice[];
}

export const EVENTS: Event[] = [
  {
    id: "plan",
    day: 0,
    title: "Sprint Planning, Monday 12 October",
    text: "Sprint Goal: “Patients can reschedule an appointment online.” The goal needs 13 points (reschedule screen 5, slot API 5, SMS confirmation 3). Other candidates: doctor photos 3, login accessibility fixes 3, clinic export 5, dark mode 3. Last three Sprints: 24, 22 and 26 points in ten working days. This Sprint has nine: Tuesday 20th is Dussehra.",
    choices: [
      {
        id: "all",
        label: "Take everything: 27 points. We did 26 last time.",
        fit: "poor",
        result:
          "That's the best Sprint ever, in a shorter Sprint. A forecast should use the average and the days actually available.",
      },
      {
        id: "fit",
        label: "Goal items plus photos and accessibility: 19 points, below the ~21.6 forecast",
        fit: "good",
        result: "Average pace × nine days ≈ 21.6 points; 19 leaves a little room for surprises.",
      },
      {
        id: "goal",
        label: "Goal items only: 13 points, to be safe",
        fit: "care",
        result:
          "Safe, and the team can pull more work later if it runs ahead. But it's a cautious use of the Sprint.",
      },
    ],
  },
  {
    id: "side",
    day: 2,
    title: "Wednesday 14: a side request",
    text: "The client's operations head messages a developer: “Can you also do the clinic export by Friday? Only 5 points, surely.”",
    choices: [
      {
        id: "quiet",
        label: "Just add it; they're the client",
        fit: "poor",
        result: "Five more points appear in the Sprint with nobody weighing the trade-off.",
      },
      {
        id: "route",
        label: "Thank them and route it to the Product Owner",
        fit: "good",
        result:
          "The PO talks to the client and puts the export at the top of the Product Backlog for the next Sprint. The Sprint Goal is safe.",
      },
      {
        id: "refuse",
        label: "Reply: “Not in this Sprint, sorry.”",
        fit: "care",
        result:
          "Right outcome, abrupt route. The client feels brushed off; the PO hears about it second-hand.",
      },
    ],
  },
  {
    id: "sick",
    day: 5,
    title: "Monday 19: a sick day",
    text: "Ravi calls in with a fever and will be out until Friday: three working days. The team will lose about 1.4 points of capacity.",
    choices: [
      {
        id: "weekend",
        label: "Ask everyone to work Saturday to make up for it",
        fit: "poor",
        result:
          "One extra day of work, but a tired team works slower for the rest of the Sprint, and it sets a habit. The Manifesto asks for a pace teams can “maintain… indefinitely”.",
      },
      {
        id: "negotiate",
        label: "Tell the PO; agree that doctor photos can move to the next Sprint",
        fit: "good",
        result:
          "“Scope may be clarified and renegotiated with the Product Owner as more is learned.” The goal stays intact.",
      },
      {
        id: "skip",
        label: "Skip the automated tests on the SMS feature to catch up",
        fit: "poor",
        result:
          "“Quality does not decrease”, says the Scrum Guide. The SMS feature isn't Done, and the debt waits for later.",
      },
    ],
  },
  {
    id: "bug",
    day: 6,
    title: "Wednesday 21: production is broken",
    text: "After the holiday, support reports that online payments fail for some patients on older Android phones. A proper fix is about 4 points.",
    choices: [
      {
        id: "later",
        label: "Log it for the next Sprint; protect the plan",
        fit: "poor",
        result:
          "Patients can't pay for another week or more. Protecting a plan isn't the point; delivering value is.",
      },
      {
        id: "swarm",
        label:
          "Developers and PO agree: two people fix it now, accessibility fixes move to the next Sprint, the fix ships as soon as it's Done",
        fit: "good",
        result:
          "The Developers decide what they can take on; the PO decides what makes way. The Review is “never… a gate to releasing value”, so the fix ships today.",
      },
      {
        id: "hotfix",
        label: "Patch it straight in production, no review or tests",
        fit: "poor",
        result:
          "Quick, but the patch isn't Done and could break something else. That's debt with interest.",
      },
    ],
  },
  {
    id: "review",
    day: DAYS.length,
    title: "Friday 23: the Sprint Review",
    text: "The clinic's product lead and two receptionists join. What does the team show?",
    choices: [
      {
        id: "done",
        label: "What's Done, then a working discussion about what to do next",
        fit: "good",
        result:
          "Unfinished work goes back to the Product Backlog; the group adjusts it together. That's the Review's purpose.",
      },
      {
        id: "all",
        label: "Everything, including unfinished work presented as “nearly done”",
        fit: "poor",
        result:
          "Work that doesn't meet the Definition of Done “cannot be… presented at the Sprint Review”. “Nearly done” hides the real state.",
      },
      {
        id: "email",
        label: "Skip it and email a status report",
        fit: "poor",
        result:
          "No feedback, no adaptation. The receptionists would have spotted what the email can't.",
      },
    ],
  },
  {
    id: "retro",
    day: DAYS.length,
    title: "The Sprint Retrospective",
    text: "Pick one improvement to try next Sprint. (There's no single right answer.)",
    choices: [
      {
        id: "buffer",
        label: "Leave some capacity free at Planning for urgent bugs",
        fit: "good",
        result:
          "A common practice for teams that get interrupted. Check next Retro whether it helped.",
      },
      {
        id: "route",
        label: "Agree with the client how side requests reach the PO",
        fit: "good",
        result: "A working agreement that protects both the Sprint and the relationship.",
      },
      {
        id: "tests",
        label: "Add Android-version tests to the Definition of Done",
        fit: "good",
        result: "Turns this Sprint's bug into a lasting quality improvement.",
      },
    ],
  },
];

export type Picks = Partial<Record<Event["id"], string>>;

export interface DayState {
  remaining: number; // points left in the Sprint Backlog at the end of the day
  scope: number; // Sprint Backlog size that day
}

export interface Outcome {
  days: DayState[];
  start: number;
  scope: number;
  done: number;
  goalMet: boolean;
  debt: number;
  weekend: boolean;
  bugWaits: boolean;
}

/** Runs the Sprint up to (and including) `upTo` working days with the choices so far. */
export function run(p: Picks, upTo = DAYS.length): Outcome {
  const start = p.plan === "all" ? 27 : p.plan === "goal" ? 13 : 19;
  let scope = start;
  let bug = 0;
  let debt = 0;
  let extra = 0;
  let fatigue = 1;
  const has = { photos: start >= 19, access: start >= 19 };
  const days: DayState[] = [];
  let done = 0;
  for (let d = 0; d < upTo; d++) {
    if (d === 2 && p.side === "quiet") scope += 5;
    if (d === 5) {
      if (p.sick === "weekend") {
        extra = DEVS * RATE;
        fatigue = 0.85;
      } else if (p.sick === "negotiate" && has.photos) {
        scope -= 3;
        has.photos = false;
      } else if (p.sick === "skip") {
        scope -= 1;
        debt += 2;
      }
    }
    if (d === 6) {
      if (p.bug === "swarm") {
        bug = 4;
        scope += 4;
        if (has.access) {
          scope -= 3;
          has.access = false;
        }
      } else if (p.bug === "hotfix") {
        bug = 1;
        scope += 1;
        debt += 3;
      }
    }
    const devs = DEVS - (SICK_DAYS.includes(d) ? 1 : 0);
    done += devs * RATE * fatigue + (d === 5 ? extra : 0);
    days.push({ remaining: Math.max(0, scope - done), scope });
  }
  const finished = Math.min(done, scope);
  // An overloaded Sprint starts everything at once; goal items finish in proportion.
  const overloaded = start > FORECAST * 1.1 || scope > FORECAST * 1.15;
  const goalDone = overloaded ? (finished / scope) * (GOAL + bug) : finished;
  return {
    days,
    start,
    scope,
    done: finished,
    // Skipping tests leaves the SMS goal item short of the Definition of Done.
    goalMet: goalDone >= GOAL + bug - 0.01 && p.sick !== "skip",
    debt,
    weekend: p.sick === "weekend",
    bugWaits: p.bug === "later",
  };
}
