export type Verdict = "good" | "warn" | "bad";
export type Level = "holds" | "degrades" | "breaks";

export const DECISIONS: {
  id: string;
  area: string;
  module: number;
  options: { id: string; label: string; verdict: Verdict; note: string }[];
}[] = [
  {
    id: "replicas",
    area: "Replicas and placement",
    module: 14,
    options: [
      { id: "one", label: "1 replica", verdict: "bad", note: "Any restart is an outage." },
      {
        id: "three",
        label: "3 replicas, no spread rule",
        verdict: "warn",
        note: "Survives a pod or node, but they may share a zone.",
      },
      {
        id: "spread",
        label: "3 replicas spread across zones",
        verdict: "good",
        note: "A topology spread constraint keeps one per zone.",
      },
    ],
  },
  {
    id: "rollout",
    area: "Rollout strategy",
    module: 5,
    options: [
      {
        id: "recreate",
        label: "Recreate",
        verdict: "bad",
        note: "Every release has a gap with no pods.",
      },
      {
        id: "rolling",
        label: "RollingUpdate, maxUnavailable 0, maxSurge 1",
        verdict: "good",
        note: "New pods must be Ready before old ones go.",
      },
    ],
  },
  {
    id: "probes",
    area: "Health checks",
    module: 6,
    options: [
      {
        id: "none",
        label: "No probes",
        verdict: "bad",
        note: "Traffic arrives before the app is ready; hangs go unnoticed.",
      },
      {
        id: "deepLive",
        label: "Liveness probe that checks the database",
        verdict: "bad",
        note: "A database blip restarts every pod.",
      },
      {
        id: "right",
        label: "Startup + liveness (app) + readiness (app + DB)",
        verdict: "good",
        note: "Restart only what a restart fixes; route around the rest.",
      },
    ],
  },
  {
    id: "resources",
    area: "Requests and limits",
    module: 13,
    options: [
      {
        id: "none",
        label: "None set",
        verdict: "bad",
        note: "BestEffort: first evicted; the HPA has no baseline.",
      },
      {
        id: "tiny",
        label: "Tiny requests, no limits",
        verdict: "warn",
        note: "Packed too tightly; noisy neighbours.",
      },
      {
        id: "sized",
        label: "Measured requests, memory limit",
        verdict: "good",
        note: "Honest scheduling and a ceiling on runaway memory.",
      },
    ],
  },
  {
    id: "scaling",
    area: "Autoscaling",
    module: 15,
    options: [
      { id: "none", label: "None", verdict: "bad", note: "Fixed capacity." },
      {
        id: "hpa",
        label: "HPA only",
        verdict: "warn",
        note: "More pods, but nowhere to put them when nodes fill.",
      },
      {
        id: "both",
        label: "HPA + node autoscaler",
        verdict: "good",
        note: "Pods in seconds, nodes in minutes.",
      },
    ],
  },
  {
    id: "pdb",
    area: "Disruption budget",
    module: 16,
    options: [
      {
        id: "none",
        label: "No PodDisruptionBudget",
        verdict: "warn",
        note: "Drains can take too many pods at once.",
      },
      {
        id: "min2",
        label: "PDB minAvailable 2",
        verdict: "good",
        note: "Drains wait for replacements.",
      },
      {
        id: "zero",
        label: "PDB maxUnavailable 0",
        verdict: "bad",
        note: "Nodes can never be drained.",
      },
    ],
  },
  {
    id: "access",
    area: "Service account",
    module: 17,
    options: [
      {
        id: "admin",
        label: "Default account bound to cluster-admin",
        verdict: "bad",
        note: "A breach of one pod owns the cluster.",
      },
      {
        id: "least",
        label: "Dedicated account, least privilege, token not mounted",
        verdict: "good",
        note: "A stolen pod gets no API access.",
      },
    ],
  },
  {
    id: "podsec",
    area: "Pod security",
    module: 18,
    options: [
      {
        id: "privileged",
        label: "Namespace allows privileged pods",
        verdict: "bad",
        note: "Containers can reach the host.",
      },
      {
        id: "restricted",
        label: "enforce: restricted",
        verdict: "good",
        note: "Non-root, no escalation, dropped capabilities.",
      },
    ],
  },
  {
    id: "secrets",
    area: "Database password",
    module: 11,
    options: [
      {
        id: "configmap",
        label: "In a ConfigMap",
        verdict: "bad",
        note: "Readable by anyone who can read config.",
      },
      {
        id: "secret",
        label: "Secret, encryption at rest, tight RBAC",
        verdict: "good",
        note: "Protected at rest and by access rules.",
      },
      {
        id: "external",
        label: "External secret store, synced in",
        verdict: "good",
        note: "The source of truth stays outside the cluster.",
      },
    ],
  },
];

export const INCIDENTS: { id: string; name: string; text: string }[] = [
  {
    id: "release",
    name: "A bad release",
    text: "Version 2.5 has a bug: it never passes its readiness check.",
  },
  { id: "node", name: "A node dies", text: "One worker loses power at 2 a.m." },
  { id: "zone", name: "A zone outage", text: "A whole availability zone goes dark for an hour." },
  { id: "surge", name: "Festival surge", text: "Payment volume quadruples for two hours." },
  {
    id: "drain",
    name: "Patch Tuesday",
    text: "The platform team drains every node, one at a time, for a kernel patch.",
  },
  {
    id: "breach",
    name: "A compromised pod",
    text: "An attacker exploits a library bug and gets a shell in one API pod.",
  },
  {
    id: "db",
    name: "Database blip",
    text: "The managed database fails over and is unreachable for 40 seconds.",
  },
];

export interface Outcome {
  level: Level;
  text: string;
  module: number;
}

type C = Record<string, string | undefined>;

export function outcome(id: string, c: C): Outcome | null {
  switch (id) {
    case "release":
      if (!c.rollout || !c.probes) return null;
      if (c.rollout === "recreate")
        return {
          level: "breaks",
          text: "Recreate stops every v2.4 pod first. v2.5 never becomes Ready: payments are down until someone rolls back.",
          module: 5,
        };
      if (c.probes === "none")
        return {
          level: "breaks",
          text: "With no readiness probe, broken v2.5 pods count as ready at once, the rollout completes, and every request fails.",
          module: 6,
        };
      return {
        level: "holds",
        text: "The first v2.5 pod never becomes Ready, so no v2.4 pod is removed. The rollout stalls and, after 600 s, reports ProgressDeadlineExceeded. Kubernetes doesn't roll back by itself: run kubectl rollout undo (or revert the commit).",
        module: 5,
      };
    case "node":
      if (!c.replicas) return null;
      if (c.replicas === "one")
        return {
          level: "breaks",
          text: "The only pod was on that node. After about 50 s without heartbeats and the 300 s toleration, it's recreated elsewhere: roughly six minutes of downtime.",
          module: 2,
        };
      return {
        level: "holds",
        text: "Two replicas keep serving. The lost pod is replaced on a healthy node after about six minutes.",
        module: 2,
      };
    case "zone":
      if (!c.replicas) return null;
      if (c.replicas === "spread")
        return {
          level: "holds",
          text: "One replica per zone: two keep serving while the third zone is dark, and the HPA (if on) adds more in the healthy zones.",
          module: 14,
        };
      if (c.replicas === "three")
        return {
          level: "degrades",
          text: "The scheduler spreads pods across zones only as a preference. Here two of the three replicas ended up in the failed zone, and one pod is carrying all the traffic. A spread constraint would have guaranteed one per zone.",
          module: 14,
        };
      return { level: "breaks", text: "The single replica was in that zone.", module: 14 };
    case "surge":
      if (!c.scaling || !c.resources) return null;
      if (c.resources === "none")
        return {
          level: "breaks",
          text: "With no requests, the HPA can't compute CPU utilisation, so it does nothing, and BestEffort pods are the first evicted under pressure.",
          module: 13,
        };
      if (c.scaling === "none")
        return {
          level: "breaks",
          text: "Fixed capacity: requests time out for the whole surge.",
          module: 15,
        };
      if (c.resources === "tiny" && c.scaling !== "none")
        return {
          level: "degrades",
          text: "With tiny requests, CPU utilisation looks enormous, so the HPA adds pods aggressively, but each is starved and packed onto crowded nodes. Latency stays high.",
          module: 13,
        };
      if (c.scaling === "hpa")
        return {
          level: "degrades",
          text: "The HPA asks for more pods, but the nodes are full: the extras sit Pending.",
          module: 15,
        };
      return {
        level: "holds",
        text: "Pods scale out at once; new nodes arrive in a few minutes. A short bump in latency, then steady. For known peaks, scale up beforehand.",
        module: 15,
      };
    case "drain":
      if (!c.pdb) return null;
      if (c.pdb === "zero")
        return {
          level: "breaks",
          text: "maxUnavailable 0 refuses every eviction: the drain can't finish and the patch is stuck.",
          module: 16,
        };
      if (c.pdb === "none")
        return {
          level: "degrades",
          text: "Without a budget, a fast drain can evict replicas faster than replacements become ready, briefly dropping capacity.",
          module: 16,
        };
      return {
        level: "holds",
        text: "Each eviction waits until a replacement is Ready, so at least two replicas serve throughout.",
        module: 16,
      };
    case "breach":
      if (!c.access || !c.podsec || !c.secrets) return null;
      if (c.access === "admin")
        return {
          level: "breaks",
          text: "The pod's token is cluster-admin: the attacker reads every Secret and can run anything anywhere.",
          module: 17,
        };
      if (c.podsec === "privileged")
        return {
          level: "breaks",
          text: "The namespace allows privileged pods; with any foothold the attacker can try to break out to the node.",
          module: 18,
        };
      if (c.secrets === "configmap")
        return {
          level: "degrades",
          text: "No API access, but the database password sits in the pod's environment from a ConfigMap, readable to the attacker and to anyone who can read config.",
          module: 11,
        };
      return {
        level: "holds",
        text: "No useful token, a non-root restricted container, and an account that can't read Secrets: the attacker is stuck in one pod with only what that pod already had. Rotate its credentials and redeploy.",
        module: 17,
      };
    case "db":
      if (!c.probes) return null;
      if (c.probes === "deepLive")
        return {
          level: "breaks",
          text: "The liveness probe checks the database, so all three pods fail it and are restarted together, turning a 40-second blip into minutes of downtime.",
          module: 6,
        };
      if (c.probes === "none")
        return {
          level: "degrades",
          text: "Pods keep receiving requests they can't serve for 40 seconds: errors, but no restarts.",
          module: 6,
        };
      return {
        level: "holds",
        text: "No payment can succeed without the database, but nothing makes it worse: readiness takes pods out of the Service so callers fail fast, liveness (app only) passes so nothing restarts, and traffic returns the moment the database does.",
        module: 6,
      };
  }
  return null;
}
