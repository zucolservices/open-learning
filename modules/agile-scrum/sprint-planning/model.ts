/**
 * Plan a two-week Sprint for a five-person citizen-portal team. Capacity comes from recent actual
 * completions, trimmed for planned absences (the practice Henrik Kniberg recommends in Scrum and XP
 * from the Trenches, 2nd ed.). Sizes are in points, an optional practice. Illustrative numbers.
 */

export interface Goal {
  id: string;
  label: string;
  /** Items the goal can't be met without. */
  needs: string[];
}

export interface Item {
  id: string;
  label: string;
  size: number;
  goal?: string;
}

export const GOALS: Goal[] = [
  {
    id: "track",
    label: "Citizens can track their application's status",
    needs: ["status-page", "status-api"],
  },
  {
    id: "approve",
    label: "Officers can approve or reject applications online",
    needs: ["inbox", "decide"],
  },
  {
    id: "mobile",
    label: "Citizens can apply comfortably on a phone",
    needs: ["responsive", "photo"],
  },
];

export const ITEMS: Item[] = [
  { id: "status-page", label: "Status page for each application", size: 5, goal: "track" },
  { id: "status-api", label: "Read status from the department's system", size: 5, goal: "track" },
  { id: "sms", label: "SMS when the status changes", size: 3, goal: "track" },
  { id: "inbox", label: "Officer's inbox of pending applications", size: 5, goal: "approve" },
  { id: "decide", label: "Approve or reject, with a reason", size: 3, goal: "approve" },
  { id: "audit", label: "Audit log of officers' decisions", size: 3, goal: "approve" },
  { id: "responsive", label: "Mobile-friendly form layout", size: 5, goal: "mobile" },
  { id: "photo", label: "Compress document photos before upload", size: 3, goal: "mobile" },
  { id: "draft", label: "Save a half-filled form as a draft", size: 2, goal: "mobile" },
  { id: "contrast", label: "Fix low-contrast text (accessibility)", size: 2 },
  { id: "footer", label: "Correct the helpline number in the footer", size: 1 },
];

export const PEOPLE = 5;
export const DAYS = 10;
export const RECENT = [21, 24, 18]; // points completed in the last three Sprints
export const RECENT_DAYS = 45; // person-days the team had in those Sprints (on average)

export const ABSENCES: [string, number][] = [
  ["Gandhi Jayanti (2 October), a public holiday for all five", 5],
  ["Meena on leave for three days", 3],
  ["Support rotation: one person half-time on production support", 5],
];

export const CAPACITY = PEOPLE * DAYS - ABSENCES.reduce((a, [, d]) => a + d, 0);
const AVG = RECENT.reduce((a, b) => a + b, 0) / RECENT.length;
/** Forecast from recent actuals, scaled to this Sprint's available person-days. */
export const FORECAST = Math.round((AVG * CAPACITY) / RECENT_DAYS);
/** The "wishful" figure: the best recent Sprint, ignoring absences. */
export const WISHFUL = Math.max(...RECENT);

export interface Outcome {
  done: string[];
  notDone: string[];
  goalMet: boolean;
  offGoal: string[];
  planned: number;
}

/**
 * Run the Sprint: the team works goal items first (keeping the Sprint Goal in mind), then the rest
 * in the order chosen. One goal item turns out bigger than expected (+2), as work often does.
 */
export function runSprint(goalId: string, picked: string[]): Outcome {
  const goal = GOALS.find((g) => g.id === goalId)!;
  const items = picked.map((id) => ITEMS.find((i) => i.id === id)!);
  const ordered = [
    ...items.filter((i) => goal.needs.includes(i.id)),
    ...items.filter((i) => i.goal === goalId && !goal.needs.includes(i.id)),
    ...items.filter((i) => i.goal !== goalId),
  ];
  let left = FORECAST;
  const done: string[] = [];
  const notDone: string[] = [];
  let surprised = false;
  for (const it of ordered) {
    let size = it.size;
    if (!surprised && goal.needs.includes(it.id)) {
      size += 2;
      surprised = true;
    }
    if (size <= left) {
      left -= size;
      done.push(it.id);
    } else notDone.push(it.id);
  }
  return {
    done,
    notDone,
    goalMet: goal.needs.every((n) => done.includes(n)),
    offGoal: items.filter((i) => i.goal !== goalId).map((i) => i.id),
    planned: items.reduce((a, i) => a + i.size, 0),
  };
}
