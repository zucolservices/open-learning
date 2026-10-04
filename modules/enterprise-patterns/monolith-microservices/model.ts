/** Trade-offs of four ways to split a system, for a given number of teams (illustrative). */

export type Shape = "mono" | "modular" | "five" | "fifty";

export const SHAPES: Record<
  Shape,
  { name: string; deployables: number; hops: number; boundaries: string }
> = {
  mono: {
    name: "Monolith",
    deployables: 1,
    hops: 0,
    boundaries: "Discipline alone; easy to erode",
  },
  modular: {
    name: "Modular monolith",
    deployables: 1,
    hops: 0,
    boundaries: "Enforced in code by tools",
  },
  five: { name: "5 services", deployables: 5, hops: 3, boundaries: "Enforced by the network" },
  fifty: { name: "50 services", deployables: 50, hops: 12, boundaries: "Enforced by the network" },
};

export function assess(shape: Shape, teams: number) {
  const s = SHAPES[shape];
  const perTeam = Math.round((s.deployables / teams) * 10) / 10;
  const releaseTogether =
    s.deployables === 1 ? teams : Math.max(1, Math.ceil(teams / s.deployables));
  let verdict: string;
  let tone: "good" | "bad" | "neutral" = "neutral";
  if (shape === "mono") {
    verdict =
      teams <= 2
        ? "Simple and fast for a small group. Watch that boundaries don't blur."
        : `${teams} teams share one codebase and one release. Expect merge pain and waiting.`;
    tone = teams <= 2 ? "good" : "bad";
  } else if (shape === "modular") {
    verdict =
      teams <= 8
        ? "One thing to deploy and run, with boundaries the tools enforce. A strong default."
        : `${teams} teams still release together; consider splitting the busiest modules out.`;
    tone = teams <= 8 ? "good" : "neutral";
  } else if (shape === "five") {
    verdict =
      teams >= 4 && teams <= 8
        ? "Roughly one service per team: independent releases at a manageable operating cost."
        : teams < 4
          ? "Few teams running several services each: network calls and operations without the benefit."
          : "Several teams per service: they'll queue for each other's releases.";
    tone = teams >= 4 && teams <= 8 ? "good" : "bad";
  } else {
    verdict =
      teams >= 15
        ? "Many teams, each owning a few services. Works with strong platforms, monitoring and automation."
        : `Each team runs about ${perTeam} services. The microservice premium, without enough people to pay it.`;
    tone = teams >= 15 ? "neutral" : "bad";
  }
  return { perTeam, releaseTogether, verdict, tone };
}
