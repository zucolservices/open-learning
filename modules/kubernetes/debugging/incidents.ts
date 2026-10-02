export interface Incident {
  id: string;
  name: string;
  symptom: string;
  commands: { cmd: string; out: string }[];
  diagnoses: { id: string; text: string; right: boolean; why: string }[];
}

export const INCIDENTS: Incident[] = [
  {
    id: "pending",
    name: "Stuck in Pending",
    symptom:
      "NAME                   READY   STATUS    RESTARTS   AGE\napi-6d9f8c7b5-x7k2p    0/1     Pending   0          4m",
    commands: [
      {
        cmd: "kubectl describe pod api-6d9f8c7b5-x7k2p",
        out: "…\nRequests:\n  cpu:     6\n  memory:  2Gi\nEvents:\n  Warning  FailedScheduling  default-scheduler  0/3 nodes are available: 3 Insufficient cpu. preemption: 0/3 nodes are available: 3 No preemption victims found for incoming pod.",
      },
      {
        cmd: "kubectl get nodes",
        out: "NAME     STATUS   ROLES    AGE   VERSION\nnode-1   Ready    <none>   41d   v1.37.1\nnode-2   Ready    <none>   41d   v1.37.1\nnode-3   Ready    <none>   41d   v1.37.1",
      },
      {
        cmd: "kubectl top nodes",
        out: "NAME     CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%\nnode-1   1210m        30%    5120Mi          33%\nnode-2   980m         24%    4800Mi          31%\nnode-3   1405m        35%    6011Mi          39%",
      },
    ],
    diagnoses: [
      {
        id: "cpu",
        text: "It requests 6 CPUs; no node has that much unreserved",
        right: true,
        why: "The scheduler counts requests, not usage (module 13): nodes look idle in kubectl top but are fully booked. Lower the request or add bigger nodes.",
      },
      {
        id: "crash",
        text: "The app is crashing on start",
        right: false,
        why: "A Pending pod hasn't started at all, so there's nothing to crash.",
      },
      {
        id: "busy",
        text: "The nodes are too busy right now",
        right: false,
        why: "kubectl top shows 24–35% CPU used. The problem is what's reserved, not what's used.",
      },
    ],
  },
  {
    id: "image",
    name: "ImagePullBackOff",
    symptom:
      "NAME                   READY   STATUS             RESTARTS   AGE\napi-7f4b9d6c8-k9d2s    0/1     ImagePullBackOff   0          6m",
    commands: [
      {
        cmd: "kubectl describe pod api-7f4b9d6c8-k9d2s",
        out: 'Events:\n  Normal   Pulling  kubelet  Pulling image "registry.example.com/shop/api:v2.4.1"\n  Warning  Failed   kubelet  Failed to pull image "registry.example.com/shop/api:v2.4.1": manifest unknown: manifest for shop/api:v2.4.1 not found\n  Warning  Failed   kubelet  Error: ErrImagePull\n  Normal   BackOff  kubelet  Back-off pulling image "registry.example.com/shop/api:v2.4.1"',
      },
      {
        cmd: "kubectl logs api-7f4b9d6c8-k9d2s",
        out: 'Error from server (BadRequest): container "api" in pod "api-7f4b9d6c8-k9d2s" is waiting to start: trying and failing to pull image',
      },
    ],
    diagnoses: [
      {
        id: "tag",
        text: "The image tag v2.4.1 doesn't exist in the registry",
        right: true,
        why: '"manifest unknown … not found": a typo or a tag never pushed. (A private registry without imagePullSecrets shows an authorization error instead.)',
      },
      {
        id: "net",
        text: "The node has no internet access",
        right: false,
        why: 'Then the error would be a timeout or connection failure, not "manifest unknown".',
      },
      {
        id: "oom",
        text: "The container ran out of memory",
        right: false,
        why: "It never started; the image couldn't be fetched.",
      },
    ],
  },
  {
    id: "crash",
    name: "CrashLoopBackOff",
    symptom:
      "NAME                   READY   STATUS             RESTARTS      AGE\napi-5c8d7e9f1-m4q9z    0/1     CrashLoopBackOff   7 (2m ago)    14m",
    commands: [
      {
        cmd: "kubectl describe pod api-5c8d7e9f1-m4q9z",
        out: "State:          Waiting\n  Reason:       CrashLoopBackOff\nLast State:     Terminated\n  Reason:       Error\n  Exit Code:    1\nRestart Count:  7",
      },
      {
        cmd: "kubectl logs api-5c8d7e9f1-m4q9z --previous",
        out: "2026-10-02T09:14:03Z starting payments-api v2.4.0\n2026-10-02T09:14:03Z FATAL config: required variable DATABASE_URL is not set\nexit status 1",
      },
      {
        cmd: "kubectl get events --sort-by=.lastTimestamp",
        out: "LAST SEEN   TYPE      REASON    OBJECT                    MESSAGE\n2m          Warning   BackOff   pod/api-5c8d7e9f1-m4q9z   Back-off restarting failed container api",
      },
    ],
    diagnoses: [
      {
        id: "env",
        text: "A required setting (DATABASE_URL) is missing from its ConfigMap or Secret",
        right: true,
        why: "--previous shows the crashed instance's logs. Exit code 1 is the app giving up; fix the configuration (module 11) and it starts.",
      },
      {
        id: "probe",
        text: "The liveness probe is killing it",
        right: false,
        why: "Then events would show \"Liveness probe failed\" and the app's logs wouldn't end in a fatal error.",
      },
      {
        id: "limit",
        text: "It exceeds its memory limit",
        right: false,
        why: "That shows as Reason: OOMKilled, exit code 137, not Error with code 1.",
      },
    ],
  },
  {
    id: "oom",
    name: "Keeps restarting",
    symptom:
      "NAME                    READY   STATUS    RESTARTS       AGE\nreport-8a7b6c5d4-t2j7c  1/1     Running   5 (40s ago)    31m",
    commands: [
      {
        cmd: "kubectl describe pod report-8a7b6c5d4-t2j7c",
        out: "Limits:\n  memory:  256Mi\nLast State:     Terminated\n  Reason:       OOMKilled\n  Exit Code:    137",
      },
      {
        cmd: "kubectl top pod report-8a7b6c5d4-t2j7c",
        out: "NAME                     CPU(cores)   MEMORY(bytes)\nreport-8a7b6c5d4-t2j7c   210m         241Mi",
      },
      {
        cmd: "kubectl logs report-8a7b6c5d4-t2j7c --previous",
        out: "09:41:02 loading monthly ledger (1.2 GB)…\n09:41:07 loading monthly ledger: 38%",
      },
    ],
    diagnoses: [
      {
        id: "mem",
        text: "It needs more memory than its 256Mi limit",
        right: true,
        why: "OOMKilled, exit code 137 (128 + signal 9). Raise the limit, or make the job stream the file instead of loading it whole.",
      },
      {
        id: "cpu",
        text: "It's being CPU-throttled",
        right: false,
        why: "Throttling slows a container down but never kills it.",
      },
      {
        id: "app",
        text: "The app has a bug that makes it exit",
        right: false,
        why: "An app exiting on its own shows Reason: Error and its own exit code. OOMKilled means the kernel killed it.",
      },
    ],
  },
  {
    id: "svc",
    name: "Service answers nothing",
    symptom:
      "$ kubectl get pods -l app=payments\nNAME                        READY   STATUS    RESTARTS   AGE\npayments-6b4744-7ci7o       1/1     Running   0          2h\npayments-6b4744-kzszj       1/1     Running   0          2h\n\n$ curl http://payments:8080/health   (from another pod)\ncurl: (7) Failed to connect to payments port 8080",
    commands: [
      {
        cmd: "kubectl get endpointslices -l kubernetes.io/service-name=payments",
        out: "NAME             ADDRESSTYPE   PORTS     ENDPOINTS   AGE\npayments-x2k9d   IPv4          <unset>   <unset>     2h",
      },
      {
        cmd: "kubectl describe service payments",
        out: "Name:       payments\nSelector:   app=payment\nType:       ClusterIP\nIP:         10.96.0.15\nPort:       8080/TCP\nTargetPort: 8080/TCP",
      },
      {
        cmd: "kubectl logs payments-6b4744-7ci7o",
        out: "listening on :8080\nGET /health 200 (kubelet probe)\nGET /health 200 (kubelet probe)",
      },
    ],
    diagnoses: [
      {
        id: "selector",
        text: "The Service selects app=payment, but the pods are labelled app=payments",
        right: true,
        why: "No pod matches, so the EndpointSlice is empty. Fix the selector (module 8).",
      },
      {
        id: "down",
        text: "The pods are down",
        right: false,
        why: "They're Running, Ready, and answering their probes.",
      },
      {
        id: "dns",
        text: "DNS is broken",
        right: false,
        why: "The name resolved to the Service; the connection failed because it has no endpoints.",
      },
    ],
  },
];
