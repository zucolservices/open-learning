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
  service: {
    term: "Service",
    definition:
      "A stable name and virtual IP in front of a changing set of pods, chosen by a label selector. Traffic goes only to pods that are Ready. Types: ClusterIP (default, inside the cluster), NodePort, LoadBalancer, ExternalName, and headless.",
    module: "services-dns",
  },
  label: {
    term: "Label",
    definition:
      "A key-value tag on a Kubernetes object, such as app=payments or version=v2. Services, Deployments and many tools find objects by their labels rather than by name.",
    module: "services-dns",
  },
  "label-selector": {
    term: "Label selector",
    definition:
      "A rule that picks objects by their labels, such as app=payments. A Service's selector decides which pods receive its traffic; Services support only exact (equality-based) matches.",
    module: "services-dns",
  },
  endpointslice: {
    term: "EndpointSlice",
    definition:
      "The list of ready pod addresses behind a Service, kept up to date by a controller as pods come, go or fail readiness checks (up to 100 endpoints per slice by default). It replaced the older Endpoints API, deprecated in v1.33.",
    module: "services-dns",
  },
  ingress: {
    term: "Ingress",
    definition:
      "An older Kubernetes API for routing outside HTTP and HTTPS traffic to Services by hostname and path, with TLS. It needs an ingress controller to work, and the API is now frozen: the project recommends Gateway API instead.",
    module: "ingress-gateway",
  },
  "ingress-controller": {
    term: "Ingress controller",
    definition:
      "The software that actually runs the router for Ingress objects, such as an Envoy-, HAProxy- or NGINX-based proxy. The community Ingress NGINX controller was retired in March 2026.",
    module: "ingress-gateway",
  },
  "gateway-api": {
    term: "Gateway API",
    definition:
      "The successor to Ingress (generally available since 2023): GatewayClass (which product), Gateway (the shared entry point, owned by the platform team) and routes such as HTTPRoute (owned by app teams), with header matching and weighted traffic splitting built in.",
    module: "ingress-gateway",
  },
  "network-policy": {
    term: "NetworkPolicy",
    definition:
      "Firewall rules for pods, written with labels: which pods a policy protects, and which pods, namespaces or IP ranges may connect to (ingress) or be reached from (egress) them, on which ports. Policies only allow; they need a network plugin that enforces them.",
    module: "network-policies",
  },
  "default-deny": {
    term: "Default deny",
    definition:
      "A NetworkPolicy that selects every pod in a namespace and allows nothing, so all traffic of that direction is blocked until other policies allow specific connections. A default-deny egress policy also blocks DNS unless you allow it.",
    module: "network-policies",
  },
  cni: {
    term: "CNI plugin",
    definition:
      "The network plugin (following the Container Network Interface) that gives pods their IP addresses and connects them, such as Calico, Cilium or a cloud's own plugin. Whether NetworkPolicies are enforced depends on it.",
    module: "network-policies",
  },
  configmap: {
    term: "ConfigMap",
    definition:
      "An object for non-confidential settings as key-value pairs (up to 1 MiB), given to pods as environment variables, command arguments or files. Mounted files update in running pods; environment variables don't.",
    module: "config-secrets",
  },
  secret: {
    term: "Secret",
    definition:
      "An object for sensitive values such as passwords, tokens and keys. Values are only base64-encoded and, by default, stored unencrypted in etcd, so protect them with encryption at rest, tight RBAC and limits on who can create pods.",
    module: "config-secrets",
  },
  "encryption-at-rest": {
    term: "Encryption at rest",
    definition:
      "Encrypting data where it is stored. For Kubernetes Secrets, the API server can encrypt them before writing to etcd, ideally with a cloud key management service (KMS v2, stable since 1.29); managed services increasingly do this by default.",
    module: "config-secrets",
  },
  "persistent-volume": {
    term: "PersistentVolume (PV)",
    definition:
      "A piece of storage in the cluster, usually a cloud disk or file share, whose life is independent of any pod. It is created by an administrator or, more often, dynamically for a claim.",
    module: "persistent-storage",
  },
  pvc: {
    term: "PersistentVolumeClaim (PVC)",
    definition:
      "A request for storage by size, access mode and StorageClass. Kubernetes binds it one-to-one to a PersistentVolume, provisioning one if needed, and pods mount the claim rather than a specific disk.",
    module: "persistent-storage",
  },
  storageclass: {
    term: "StorageClass",
    definition:
      "Describes a kind of storage and how to create it: which CSI driver provisions it, its parameters, the reclaim policy (Delete by default) and when to bind (WaitForFirstConsumer creates the disk in the zone where the pod lands).",
    module: "persistent-storage",
  },
  csi: {
    term: "CSI (Container Storage Interface)",
    definition:
      "The standard plugin interface storage vendors use to provide volumes to Kubernetes, such as the AWS EBS, Google Persistent Disk and Azure Disk CSI drivers. It replaced the old built-in cloud disk plugins.",
    module: "persistent-storage",
  },
  emptydir: {
    term: "emptyDir",
    definition:
      "A temporary volume created when a pod lands on a node and deleted when the pod leaves it. It survives container restarts and can be shared by the pod's containers or kept in memory.",
    module: "persistent-storage",
  },
  "resource-request": {
    term: "Resource request",
    definition:
      "The CPU and memory a container reserves. The scheduler places pods by their requests, not their actual usage, and a node is full when its pods' requests reach its allocatable resources.",
    module: "requests-limits",
  },
  "resource-limit": {
    term: "Resource limit",
    definition:
      "The most CPU or memory a container may use. CPU above the limit is throttled (the container slows down); memory above the limit gets the container killed by the kernel (OOMKilled).",
    module: "requests-limits",
  },
  allocatable: {
    term: "Allocatable",
    definition:
      "The part of a node's CPU, memory and disk available to pods: its capacity minus what's reserved for the operating system and Kubernetes components and an eviction threshold.",
    module: "requests-limits",
  },
  "qos-class": {
    term: "QoS class",
    definition:
      "A label Kubernetes gives each pod from its requests and limits: Guaranteed (requests equal limits for every container), Burstable or BestEffort (none set). It predicts which pods are evicted first when a node runs short.",
    module: "requests-limits",
  },
} satisfies Record<string, GlossaryEntry>;
