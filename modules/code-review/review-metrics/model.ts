/**
 * A made-up team picks up to three review metrics as targets for a quarter. Each target nudges
 * behaviour; some help, some get gamed. All numbers are illustrative.
 */

export interface Metric {
  id: string;
  label: string;
  kind: "flow" | "people" | "guardrail" | "survey";
}

export const METRICS: Metric[] = [
  { id: "first", label: "Time to first review (slowest 25%)", kind: "flow" },
  { id: "size", label: "Median pull request size", kind: "flow" },
  { id: "guard", label: "Time reviewers actually spend reading", kind: "guardrail" },
  { id: "survey", label: "Team survey: is review helpful?", kind: "survey" },
  { id: "comments", label: "Comments per reviewer, ranked", kind: "people" },
  { id: "bugs", label: "Bugs found per reviewer, ranked", kind: "people" },
  { id: "merged", label: "Pull requests merged per developer, ranked", kind: "people" },
];

export interface Quarter {
  wait: number;
  escaped: number;
  morale: number;
  effects: { good: boolean; text: string }[];
}

export function quarter(picked: string[]): Quarter {
  const has = (id: string) => picked.includes(id);
  let wait = 20;
  let escaped = 10;
  let morale = 60;
  const effects: Quarter["effects"] = [];
  if (has("first")) {
    wait -= 10;
    effects.push({
      good: true,
      text: "Reviewers check the queue between tasks; stuck changes get noticed.",
    });
    if (!has("guard")) {
      escaped += 4;
      effects.push({
        good: false,
        text: "Some approvals now take under two minutes: speed without reading.",
      });
    }
  }
  if (has("size")) {
    wait -= 4;
    escaped -= 2;
    effects.push({
      good: true,
      text: "Changes get smaller, so reviews are quicker and more careful.",
    });
  }
  if (has("guard") && has("first")) {
    escaped -= 1;
    effects.push({ good: true, text: "The reading-time guardrail keeps fast reviews honest." });
  } else if (has("guard")) {
    effects.push({
      good: true,
      text: "Reading time is steady, but it's a guardrail: on its own it doesn't improve anything.",
    });
  }
  if (has("survey")) {
    morale += 10;
    effects.push({
      good: true,
      text: "The survey surfaces a confusing review rule early, and the team fixes it.",
    });
  }
  if (has("comments")) {
    morale -= 20;
    wait += 3;
    effects.push({
      good: false,
      text: "Nitpicks triple as reviewers chase the leaderboard. Authors dread review.",
    });
  }
  if (has("bugs")) {
    morale -= 25;
    effects.push({
      good: false,
      text: "Reviewers argue over what counts as a bug; authors stop asking for early feedback.",
    });
  }
  if (has("merged")) {
    morale -= 10;
    wait += 2;
    effects.push({
      good: false,
      text: "Work is split into trivial pieces to raise counts. More changes, not more value.",
    });
  }
  return { wait, escaped, morale: Math.max(0, Math.min(100, morale)), effects };
}
