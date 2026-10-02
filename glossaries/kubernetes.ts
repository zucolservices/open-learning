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
} satisfies Record<string, GlossaryEntry>;
