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
} satisfies Record<string, GlossaryEntry>;
