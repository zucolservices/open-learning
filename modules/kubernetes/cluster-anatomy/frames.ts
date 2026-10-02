export type Part = "kubectl" | "api" | "etcd" | "cm" | "sched" | "kubelet" | "runtime" | "proxy";

export interface Frame {
  title: string;
  text: string;
  on: Part[];
  /** Arrows to draw, as [from, to]. */
  arrows: [Part, Part][];
  pods: 0 | 1 | 2 | 3; // 0 none, 1 created (no node), 2 bound, 3 running
  gate?: string;
}

export const FRAMES: Frame[] = [
  {
    title: "kubectl sends the file",
    text: "kubectl reads your kubeconfig to find the cluster and your credentials, then sends the Deployment to the API server over HTTPS.",
    on: ["kubectl", "api"],
    arrows: [["kubectl", "api"]],
    pods: 0,
  },
  {
    title: "Who are you, and are you allowed?",
    text: "The API server first authenticates you (a certificate or a token), then authorises the request, usually with role-based access control: may this user create Deployments in this namespace?",
    on: ["api"],
    arrows: [],
    pods: 0,
    gate: "authn → authz",
  },
  {
    title: "Admission",
    text: "Admission controllers can change the object (mutating: add defaults, inject a sidecar), then check it against policy (validating: no images from unknown registries). Then the object is validated against its schema.",
    on: ["api"],
    arrows: [],
    pods: 0,
    gate: "mutate → validate",
  },
  {
    title: "Stored in etcd",
    text: 'The object is written to etcd, the cluster\'s key-value store, replicated across members by the Raft protocol. kubectl prints "deployment created" and exits. Nothing is running yet.',
    on: ["api", "etcd"],
    arrows: [["api", "etcd"]],
    pods: 0,
  },
  {
    title: "The Deployment controller notices",
    text: "Controllers don't poll etcd; they watch the API server. The Deployment controller in kube-controller-manager sees a new Deployment and creates a ReplicaSet for it, through the API server.",
    on: ["cm", "api"],
    arrows: [
      ["api", "cm"],
      ["cm", "api"],
    ],
    pods: 0,
  },
  {
    title: "Three pods, nowhere to live",
    text: "The ReplicaSet controller sees a ReplicaSet wanting 3 pods and having 0, so it creates 3 Pod objects. They exist only as records: no node has been chosen.",
    on: ["cm", "api"],
    arrows: [["cm", "api"]],
    pods: 1,
  },
  {
    title: "The scheduler picks nodes",
    text: "kube-scheduler watches for pods with no node. For each, it filters out nodes that can't take it, scores the rest, and tells the API server its choice: a binding.",
    on: ["sched", "api"],
    arrows: [
      ["api", "sched"],
      ["sched", "api"],
    ],
    pods: 2,
  },
  {
    title: "The kubelet starts containers",
    text: "The kubelet on each chosen node sees a pod bound to it. Over the Container Runtime Interface it asks containerd or CRI-O to pull the image and start the containers; the runtime calls the network (CNI) plugin to give the pod an IP.",
    on: ["kubelet", "runtime", "api"],
    arrows: [
      ["api", "kubelet"],
      ["kubelet", "runtime"],
    ],
    pods: 2,
  },
  {
    title: "Running, and reported",
    text: "The kubelet reports the pods' status back to the API server, which stores it. kube-proxy on every node keeps traffic rules up to date so Services can reach the new pods.",
    on: ["kubelet", "api", "etcd", "proxy"],
    arrows: [
      ["kubelet", "api"],
      ["api", "etcd"],
    ],
    pods: 3,
  },
];

export const PARTS: Record<Part, { name: string; where: string; text: string }> = {
  kubectl: {
    name: "kubectl",
    where: "Your laptop or a pipeline",
    text: "The command-line client. It only ever talks to the API server; so do dashboards, Helm and GitOps tools.",
  },
  api: {
    name: "kube-apiserver",
    where: "Control plane",
    text: "The front door and the hub. Every component and every user goes through it: it authenticates, authorises, runs admission, validates and stores. It is stateless, so you can run several copies behind a load balancer.",
  },
  etcd: {
    name: "etcd",
    where: "Control plane",
    text: '"Consistent and highly-available key value store used as Kubernetes\' backing store for all cluster data." Run as an odd number of members (five recommended in production) so a majority can always agree. Ideally only the API server can reach it. Back it up.',
  },
  cm: {
    name: "kube-controller-manager",
    where: "Control plane",
    text: "Many controllers compiled into one program: Deployment, ReplicaSet, Node, Job, EndpointSlice, ServiceAccount and more. Each watches the API server and works to make reality match the spec.",
  },
  sched: {
    name: "kube-scheduler",
    where: "Control plane",
    text: "Assigns each new pod to a node: filters out nodes that can't fit it, scores the rest, binds the pod to the best. It doesn't start anything; the kubelet does.",
  },
  kubelet: {
    name: "kubelet",
    where: "Every node",
    text: "The node's agent. It watches for pods bound to its node, has the runtime start their containers, runs their health checks, restarts crashed containers and reports status.",
  },
  runtime: {
    name: "Container runtime",
    where: "Every node",
    text: "containerd or CRI-O, driven by the kubelet through the Container Runtime Interface (CRI). Pulls images, creates containers, and calls the CNI plugin to wire up pod networking.",
  },
  proxy: {
    name: "kube-proxy",
    where: "Every node (optional)",
    text: "Programs each node's packet rules (iptables by default; nftables is stable since 1.33) so traffic to a Service reaches one of its pods. Some network plugins, such as Cilium, replace it with eBPF.",
  },
};
