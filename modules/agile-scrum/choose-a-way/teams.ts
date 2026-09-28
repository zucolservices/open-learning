/** Four teams and how each way of working tends to play out. Illustrative. */

export type Fit = "good" | "care" | "poor";
export type Way = "scrum" | "kanban" | "both";

export const WAYS: [Way, string, string][] = [
  ["scrum", "Scrum", "Fixed-length Sprints with a Sprint Goal, Review and Retrospective"],
  ["kanban", "Kanban", "Continuous flow, explicit WIP control, work pulled when there's room"],
  [
    "both",
    "Scrum with Kanban practices",
    "Sprints and a Sprint Goal, plus visualised flow and WIP limits",
  ],
];

export interface Team {
  id: string;
  name: string;
  work: string;
  outcomes: Record<Way, { fit: Fit; text: string }>;
}

export const TEAMS: Team[] = [
  {
    id: "portal",
    name: "The citizen-portal team",
    work: "Building a new product with a clear goal. The department wants to see progress and steer it every few weeks.",
    outcomes: {
      scrum: {
        fit: "good",
        text: "A Product Goal, Sprint Goals and regular Reviews with the department suit complex product work well.",
      },
      kanban: {
        fit: "care",
        text: "Flow works, but without a cadence of reviews the department may drift out of touch. Add a regular review and goals.",
      },
      both: {
        fit: "good",
        text: "The Sprint rhythm for goals and reviews, plus WIP limits and flow metrics to keep work moving. Scrum.org's Kanban Guide for Scrum Teams describes exactly this.",
      },
    },
  },
  {
    id: "support",
    name: "The L2 support team",
    work: "Tickets arrive all day, unpredictably. Some are urgent (a payment outage), most are routine.",
    outcomes: {
      scrum: {
        fit: "care",
        text: "Two-week plans get broken daily by urgent tickets. It can work if you hold back capacity for interruptions, but the Sprint Goal is often hard to keep.",
      },
      kanban: {
        fit: "good",
        text: "Kanban suits teams with “lots of incoming requests that vary in priority and size” (Atlassian). Add an expedite lane for urgent tickets, a published turnaround time, and a regular replenishment meeting.",
      },
      both: {
        fit: "care",
        text: "Possible, but the Sprint adds little when there's no shared goal beyond “keep the service running”.",
      },
    },
  },
  {
    id: "fixed",
    name: "The fixed-bid project team",
    work: "A contract fixes the scope, price and date for a department's records system. The client still wants to see progress.",
    outcomes: {
      scrum: {
        fit: "good",
        text: "Sprints inside the contract: show working software to the client every few weeks and find problems early. How much can change is set by the contract, not the board.",
      },
      kanban: {
        fit: "care",
        text: "Flow can work, but a fixed date needs forecasting and regular client reviews. Add delivery-planning cadences.",
      },
      both: {
        fit: "good",
        text: "Sprint reviews for the client plus flow metrics to forecast the fixed date. A separate track covers fixed-scope projects in depth.",
      },
    },
  },
  {
    id: "platform",
    name: "The platform team",
    work: "Runs the shared cloud platform. Other teams send requests (a new environment, access, a pipeline fix), and it also has its own roadmap.",
    outcomes: {
      scrum: {
        fit: "care",
        text: "Good for the roadmap, but requests from other teams wait up to a Sprint, which frustrates them.",
      },
      kanban: {
        fit: "good",
        text: "Treat requests as a service: visible queue, WIP limits, an expected turnaround time. Roadmap items flow through the same board.",
      },
      both: {
        fit: "good",
        text: "Often called “Scrumban”: Sprints for the roadmap, with capacity and a flow lane for incoming requests.",
      },
    },
  },
];
