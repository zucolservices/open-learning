/** Six team symptoms, each with its anti-pattern name and possible fixes. Illustrative teams. */

export interface Case {
  id: string;
  symptom: string;
  name: string;
  names: string[]; // options, including the right one
  why: string;
  fixes: { label: string; good: boolean; result: string }[];
}

export const CASES: Case[] = [
  {
    id: "velocity",
    symptom:
      "Management set a target: velocity up 10% every quarter. It's working: points per Sprint have nearly doubled. Yet releases come no faster and users see no difference.",
    name: "Velocity as a target",
    names: ["Velocity as a target", "Zombie Scrum", "Water-Scrum-Fall"],
    why: "Estimates quietly inflate to hit the number. “When a measure becomes a target, it ceases to be a good measure.”",
    fixes: [
      {
        label:
          "Keep velocity inside the team for planning; judge progress by outcomes such as lead time and user results",
        good: true,
        result:
          "Velocity goes back to being an honest planning aid, and management looks at what users actually get.",
      },
      {
        label: "Normalise story points across teams so velocity can be compared fairly",
        good: false,
        result:
          "Now teams are ranked by it, and the pressure to inflate grows. Martin Fowler: “it's stupid to compare teams based on their velocities.”",
      },
      {
        label: "Audit every estimate to stop the inflation",
        good: false,
        result: "More overhead, less trust, and the target that caused the problem is still there.",
      },
    ],
  },
  {
    id: "wsf",
    symptom:
      "Requirements for the next six months are signed off up front. The teams run two-week Sprints. Everything goes live together after a two-month acceptance-testing phase.",
    name: "Water-Scrum-Fall",
    names: ["Mini-waterfall", "Water-Scrum-Fall", "Velocity as a target"],
    why: "Forrester's Dave West named it in 2011 as the everyday reality for many organisations: Sprints in the middle, big up-front plans and big-bang releases on either side. The cost is that users give feedback only at the very end.",
    fixes: [
      {
        label:
          "Release a small, usable slice to real users early, and move acceptance testing into the Definition of Done",
        good: true,
        result:
          "Feedback arrives in weeks, not months, and the plan can change with what's learned.",
      },
      {
        label: "Make the Sprints shorter",
        good: false,
        result:
          "Shorter Sprints inside the same six-month plan still deliver nothing to users until the end.",
      },
      {
        label: "Add more detail to the up-front requirements so the testing phase finds less",
        good: false,
        result:
          "More up-front certainty about a future nobody can predict. That's the problem, not the fix.",
      },
    ],
  },
  {
    id: "zombie",
    symptom:
      "Every Scrum event happens on time. But no business person has come to a Sprint Review in months, nothing reached users this quarter, and the same retro actions keep reappearing.",
    name: "Zombie Scrum",
    names: ["Dark Scrum", "Zombie Scrum", "Hardening Sprints"],
    why: "Zombie Scrum “looks like Scrum from a distance but lacks a beating heart” (Scrum.org). Its authors list four symptoms: no contact with the outside world, no working product, no drive to improve, no autonomy.",
    fixes: [
      {
        label:
          "Invite one real user or stakeholder to the next Review, and aim to ship one small thing this Sprint",
        good: true,
        result: "Small, concrete steps that bring back feedback and purpose.",
      },
      {
        label: "Make the events stricter and check attendance",
        good: false,
        result:
          "The events already happen. The missing heart is purpose and feedback, not ceremony.",
      },
      {
        label: "Replace Scrum with a different framework",
        good: false,
        result: "The same habits would follow into any framework.",
      },
    ],
  },
  {
    id: "status",
    symptom:
      "The Daily Scrum takes 40 minutes. Each developer reports yesterday's work to the manager, who then hands out today's tasks.",
    name: "Daily Scrum as a status report",
    names: ["Daily Scrum as a status report", "Mini-waterfall", "Zombie Scrum"],
    why: "The Daily Scrum is for the Developers to inspect progress towards the Sprint Goal and plan their next day. It's 15 minutes, and nobody assigns their work.",
    fixes: [
      {
        label:
          "Developers run it, around the board and the Sprint Goal, in 15 minutes; the manager can listen afterwards if needed",
        good: true,
        result:
          "The team plans its own day and spots problems together; status is visible on the board anyway.",
      },
      {
        label: "Keep the format but use a timer",
        good: false,
        result: "A shorter status report is still a status report.",
      },
      {
        label: "Replace it with written updates to the manager",
        good: false,
        result: "The team loses its daily chance to adapt together.",
      },
    ],
  },
  {
    id: "hardening",
    symptom:
      "Every fourth Sprint is a “hardening Sprint”: no new features, just testing, bug fixing and getting ready to release.",
    name: "Hardening Sprints",
    names: ["Hardening Sprints", "Water-Scrum-Fall", "Dark Scrum"],
    why: "A Scrum.org article: “There is no such thing as a hardening Sprint in Scrum.” Needing one means the earlier Increments weren't really Done.",
    fixes: [
      {
        label: "Strengthen the Definition of Done so every Increment is tested and releasable",
        good: true,
        result:
          "Less new work per Sprint at first, but no more quarterly clean-ups. (Module 16's simulation shows why.)",
      },
      {
        label: "Make the hardening Sprint longer",
        good: false,
        result: "More time to clean up undone work that shouldn't have been left undone.",
      },
      {
        label: "Hire a separate testing team for hardening",
        good: false,
        result: "Moves the testing further from the work; the debt still builds up in between.",
      },
    ],
  },
  {
    id: "mini",
    symptom:
      "Inside each Sprint: analysis in week one, coding in week two, testing on the last two days. Testers sit idle, then are swamped, and stories spill into the next Sprint.",
    name: "Mini-waterfall",
    names: ["Mini-waterfall", "Hardening Sprints", "Daily Scrum as a status report"],
    why: "A waterfall squeezed into two weeks. Mark Levison calls it “Scrummerfall”.",
    fixes: [
      {
        label:
          "Smaller stories that each go through all the steps, with the whole team helping to test and a WIP limit",
        good: true,
        result: "Work finishes steadily through the Sprint instead of piling up at the end.",
      },
      {
        label: "Give the testers more days at the end",
        good: false,
        result: "Now coding gets squeezed instead. The queue just moves.",
      },
      {
        label: "Move testing into the next Sprint",
        good: false,
        result: "That's undone work, and it grows every Sprint.",
      },
    ],
  },
];
