/** A made-up café service with poor logs, health checks and shutdown, and scenarios that test them. */

export const FIXES: { id: string; problem: string; fix: string }[] = [
  {
    id: "logs",
    problem: "Logs are free-text print statements",
    fix: "Structured JSON logs with a request ID on every line",
  },
  {
    id: "probes",
    problem: "One /health check that tests the database, used to decide restarts",
    fix: "Liveness checks only the process; readiness checks it can serve (database reachable)",
  },
  {
    id: "graceful",
    problem: "On SIGTERM the process exits at once",
    fix: "Stop taking new requests, fail readiness, finish in-flight work, exit within the grace period",
  },
  {
    id: "exec",
    problem: "Started through a shell script that swallows signals",
    fix: "Exec-form start command (or a tiny init) so the app receives SIGTERM",
  },
];

export const SCENARIOS: {
  id: string;
  label: string;
  needs: string[];
  pass: string;
  fail: string;
}[] = [
  {
    id: "trace",
    label: "“My order 4182 failed at 09:15”, says a customer",
    needs: ["logs"],
    pass: "Search for the request ID: every line from that request, across services, in seconds.",
    fail: "Scroll through thousands of “error!” lines from every request mixed together.",
  },
  {
    id: "blip",
    label: "The database is unreachable for 20 seconds",
    needs: ["probes"],
    pass: "Pods stop receiving traffic briefly, then carry on. Nothing restarts.",
    fail: "Every pod fails its liveness check and restarts at once, turning a blip into an outage.",
  },
  {
    id: "deploy",
    label: "A new version is deployed during the lunch rush",
    needs: ["graceful", "exec"],
    pass: "Old pods finish their requests and leave; customers notice nothing.",
    fail: "In-flight orders are cut off mid-request (or the pod ignores SIGTERM until it's killed after 30 s).",
  },
];

export const BEFORE_LOG = "order failed";
export const AFTER_LOG =
  '{"time":"2026-10-12T09:15:02Z","level":"error","msg":"payment declined","requestId":"7f3a…","traceId":"4bf9…","orderId":4182,"route":"POST /orders"}';
