/** Deployment decisions for a made-up café company: where to run things, how to roll out, how to package. */

export interface Option {
  id: string;
  label: string;
  ok: boolean;
  outcome: string;
}

export interface Decision {
  id: string;
  title: string;
  context: string;
  options: Option[];
}

export const DECISIONS: Decision[] = [
  {
    id: "api",
    title: "The order API",
    context: "Busy all day, every day, with steady traffic and a database connection pool.",
    options: [
      {
        id: "vm",
        label: "A virtual machine you manage",
        ok: false,
        outcome: "Works, but you patch the OS, plan capacity and handle failover yourself.",
      },
      {
        id: "containers",
        label: "Containers on a managed platform",
        ok: true,
        outcome: "A good fit: steady traffic, several replicas, rolling updates, autoscaling.",
      },
      {
        id: "fn",
        label: "Serverless functions",
        ok: false,
        outcome:
          "Possible, but steady load costs more, and every cold instance opens new database connections.",
      },
    ],
  },
  {
    id: "thumbs",
    title: "Thumbnail maker",
    context: "Runs for a second whenever a photo is uploaded; idle most of the night.",
    options: [
      {
        id: "vm",
        label: "A virtual machine you manage",
        ok: false,
        outcome: "Sits idle and costs money most of the day.",
      },
      {
        id: "containers",
        label: "Containers running all the time",
        ok: false,
        outcome: "Fine, but you pay for idle replicas.",
      },
      {
        id: "fn",
        label: "Serverless functions triggered by uploads",
        ok: true,
        outcome: "A natural fit: short, event-driven, scales to zero.",
      },
    ],
  },
  {
    id: "report",
    title: "Nightly sales report",
    context: "Runs once a night and takes about 40 minutes.",
    options: [
      {
        id: "lambda",
        label: "An AWS Lambda function",
        ok: false,
        outcome: "Stopped at 15 minutes, Lambda's hard limit.",
      },
      {
        id: "job",
        label: "A scheduled container job",
        ok: true,
        outcome:
          "Runs as long as it needs, then stops: a Kubernetes CronJob, ECS scheduled task or Cloud Run job.",
      },
      {
        id: "api",
        label: "Inside the API, triggered by a timer",
        ok: false,
        outcome: "Competes with customers for CPU, and a deploy mid-run kills it.",
      },
    ],
  },
  {
    id: "rollout",
    title: "Rolling out a risky payment change",
    context: "The new version changes how card payments are handled.",
    options: [
      {
        id: "all",
        label: "Replace everything at once",
        ok: false,
        outcome: "A bug hits every customer at the same moment.",
      },
      {
        id: "rolling",
        label: "A rolling update",
        ok: false,
        outcome:
          "Safer, but within minutes every instance runs the new code; a subtle bug still reaches everyone.",
      },
      {
        id: "canary",
        label: "A canary: 5% of traffic first, watch errors and latency, then widen",
        ok: true,
        outcome: "A bug affects few customers and is rolled back before it spreads.",
      },
    ],
  },
  {
    id: "image",
    title: "Packaging the API",
    context: "The current image is a full operating system with build tools: 1.1 GB.",
    options: [
      {
        id: "keep",
        label: "Keep it: it works",
        ok: false,
        outcome: "Slow to pull, and every unused package is a possible vulnerability.",
      },
      {
        id: "slim",
        label: "Multi-stage build into a minimal runtime image, running as non-root",
        ok: true,
        outcome: "Around 60 MB, with no shell or compilers for an attacker to use.",
      },
    ],
  },
];
