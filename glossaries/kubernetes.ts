import type { GlossaryEntry } from "./types";

/** Kubernetes track glossary. `module` slugs refer to this track. */
export const kubernetes = {
  orchestration: {
    term: "Container orchestration",
    definition:
      "Automatically deciding which machine runs each container, restarting containers that fail, scaling them up and down and connecting them, across a group of machines. Kubernetes is the most widely used container orchestrator.",
    module: "why-kubernetes",
  },
  "container-image": {
    term: "Container image",
    definition:
      "A packaged, read-only bundle of an app plus everything it needs to run (libraries, runtime, settings), built once and stored in a registry. Every container started from the same image behaves the same way.",
    module: "why-kubernetes",
  },
  cluster: {
    term: "Cluster",
    definition:
      "A set of machines managed together by Kubernetes: a control plane that decides what should run where, and worker nodes that run the containers.",
    module: "why-kubernetes",
  },
  node: {
    term: "Node",
    definition:
      "One machine in a Kubernetes cluster, physical or virtual, that runs containers. Each node runs a kubelet agent that reports to the control plane.",
    module: "why-kubernetes",
  },
  "desired-state": {
    term: "Desired state",
    definition:
      'What you have told Kubernetes you want, such as "30 copies of this app, version 2". The objects you create are a "record of intent"; the cluster keeps working to make the actual state match.',
    module: "why-kubernetes",
  },
  controller: {
    term: "Controller",
    definition:
      "A control loop that watches the cluster's state through the API server and makes or requests changes to move the current state towards the desired state. Most built-in controllers run inside the kube-controller-manager.",
    module: "desired-state",
  },
  reconciliation: {
    term: "Reconciliation",
    definition:
      "The repeated cycle a controller runs: observe the current state, compare it with the desired state, act to close the gap, repeat. It is level-based: only the latest desired state matters, not the steps that led to it.",
    module: "desired-state",
  },
  "spec-status": {
    term: "Spec and status",
    definition:
      "The two halves of almost every Kubernetes object. The spec is the desired state you write; the status is the current state the system observes and writes back.",
    module: "desired-state",
  },
  kubectl: {
    term: "kubectl",
    definition:
      "The command-line tool for talking to a Kubernetes cluster's API server: kubectl get, describe, logs, and kubectl apply -f to send a file of desired state.",
    module: "desired-state",
  },
  "control-plane": {
    term: "Control plane",
    definition:
      "The part of a cluster that stores the desired state and makes decisions: the API server, etcd, the scheduler and the controller manager (plus a cloud controller manager on cloud providers). Managed services run it for you.",
    module: "cluster-anatomy",
  },
  "api-server": {
    term: "API server (kube-apiserver)",
    definition:
      "The cluster's front door and hub. Every user and component talks to it: it authenticates, authorises, runs admission control, validates and stores objects in etcd, and lets components watch for changes.",
    module: "cluster-anatomy",
  },
  etcd: {
    term: "etcd",
    definition:
      "The consistent, highly available key-value store that holds all of a cluster's data. It replicates with the Raft protocol across an odd number of members (five recommended in production); ideally only the API server talks to it.",
    module: "cluster-anatomy",
  },
  "kube-scheduler": {
    term: "Scheduler (kube-scheduler)",
    definition:
      "The control-plane component that assigns each new pod to a node: it filters out nodes that can't run it, scores the rest, and records its choice with a binding.",
    module: "cluster-anatomy",
  },
  kubelet: {
    term: "kubelet",
    definition:
      "The agent on every node. It watches for pods assigned to its node, has the container runtime start their containers, runs health checks, restarts crashed containers and reports status to the API server.",
    module: "cluster-anatomy",
  },
  "container-runtime": {
    term: "Container runtime",
    definition:
      "The software that actually pulls images and runs containers on a node, such as containerd or CRI-O. The kubelet drives it through the Container Runtime Interface (CRI).",
    module: "cluster-anatomy",
  },
  "admission-control": {
    term: "Admission control",
    definition:
      "Checks the API server runs on a request after authentication and authorisation, before storing it: mutating steps can change the object (add defaults), validating steps can reject it against policy.",
    module: "cluster-anatomy",
  },
  pod: {
    term: "Pod",
    definition:
      "The smallest unit Kubernetes runs: one or more containers that share an IP address and can share volumes, scheduled together onto one node. Pods are disposable; controllers replace them rather than moving them.",
    module: "pods",
  },
  "init-container": {
    term: "Init container",
    definition:
      "A container in a pod that runs to completion before the app containers start, one after another, for setup work such as database migrations or waiting for a dependency.",
    module: "pods",
  },
  "sidecar-container": {
    term: "Sidecar container",
    definition:
      "A helper container that starts before the main app and keeps running alongside it in the same pod, such as a log shipper or a service-mesh proxy. Native sidecars (init containers with restartPolicy: Always) are stable since Kubernetes 1.33.",
    module: "pods",
  },
  "pod-phase": {
    term: "Pod phase",
    definition:
      "A one-word summary of where a pod is in its life: Pending, Running, Succeeded, Failed or Unknown. CrashLoopBackOff is a container status shown by kubectl, not a phase.",
    module: "pods",
  },
  "restart-policy": {
    term: "Restart policy",
    definition:
      "Whether the kubelet restarts a pod's containers when they exit: Always (the default), OnFailure or Never. Repeated crashes are restarted with a growing delay, from 10 seconds up to five minutes (CrashLoopBackOff).",
    module: "pods",
  },
  deployment: {
    term: "Deployment",
    definition:
      "A controller object that keeps a set number of identical pods running and changes them safely: each new version of the pod template becomes a new ReplicaSet that is scaled up while the old one is scaled down.",
    module: "deployments",
  },
  replicaset: {
    term: "ReplicaSet",
    definition:
      "Keeps a given number of pods from one pod template running, replacing any that disappear. You rarely create one yourself: Deployments create one per version and keep old ones (scaled to zero) for rollback.",
    module: "deployments",
  },
  "rolling-update": {
    term: "Rolling update",
    definition:
      "Replacing pods a few at a time so the app stays available: maxSurge sets how many extra pods may exist during the change, maxUnavailable how many may be missing. Both default to 25% in a Deployment.",
    module: "deployments",
  },
  rollback: {
    term: "Rollback",
    definition:
      "Returning a Deployment to an earlier revision, for example with kubectl rollout undo. The old ReplicaSet is scaled back up using the same rolling rules. Kubernetes never rolls back on its own.",
    module: "deployments",
  },
  probe: {
    term: "Probe",
    definition:
      "A health check the kubelet runs against a container on a schedule: an HTTP request, a TCP connection, a command or a gRPC health call. By default every 10 seconds, with three failures counting as failed.",
    module: "health-checks",
  },
  "liveness-probe": {
    term: "Liveness probe",
    definition:
      'Answers "is this container still working?". If it fails repeatedly, the kubelet kills the container and applies the restart policy. It should check only the app itself, never its dependencies.',
    module: "health-checks",
  },
  "readiness-probe": {
    term: "Readiness probe",
    definition:
      "Answers \"can this pod take traffic right now?\". If it fails, the pod is taken out of its Services' endpoints until it passes again; the container is not restarted. It runs for the pod's whole life.",
    module: "health-checks",
  },
  "startup-probe": {
    term: "Startup probe",
    definition:
      "Holds off liveness and readiness checks until a slow-starting app is up, allowing failureThreshold × periodSeconds to start (for example 30 × 10 s = 300 s). If it never succeeds, the container is killed.",
    module: "health-checks",
  },
  statefulset: {
    term: "StatefulSet",
    definition:
      "A controller for pods that need a stable identity: each pod gets a fixed name (db-0, db-1…), its own persistent volume and a DNS name through a headless Service, and pods start and stop in order.",
    module: "workload-controllers",
  },
  daemonset: {
    term: "DaemonSet",
    definition:
      "A controller that runs one copy of a pod on every node (or on selected nodes), adding it to new nodes automatically. Used for log collectors, monitoring agents and storage daemons.",
    module: "workload-controllers",
  },
  job: {
    term: "Job",
    definition:
      "A controller that runs pods until a set number complete successfully, retrying failures (six times by default). Used for one-off batch work such as migrations or reports.",
    module: "workload-controllers",
  },
  cronjob: {
    term: "CronJob",
    definition:
      "Creates a Job on a repeating schedule written in cron syntax, with an optional time zone. Scheduling is best effort, so the work should be safe to run twice.",
    module: "workload-controllers",
  },
} satisfies Record<string, GlossaryEntry>;
