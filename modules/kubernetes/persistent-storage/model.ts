import type { Ev, Vol } from "./state";

/** Nodes 0–1 in zone a, 2–3 in zone b. The database pod starts on node 0 with 12,480 orders. */
export interface Outcome {
  podNode: number | null; // null = Pending
  data: "kept" | "lost" | "stranded";
  diskNode: number | null; // where the data physically is (for hostPath/zonal display)
  diskZone: "a" | "b" | "ab" | null;
  text: string;
}

export function outcome(vol: Vol, ev: Ev): Outcome {
  if (ev === "crash") {
    if (vol === "container")
      return {
        podNode: 0,
        data: "lost",
        diskNode: null,
        diskZone: null,
        text: "The container restarted with a fresh filesystem from its image. Files written inside it are gone.",
      };
    return {
      podNode: 0,
      data: "kept",
      diskNode: vol === "emptydir" || vol === "hostpath" ? 0 : null,
      diskZone: vol === "zonal" ? "a" : vol === "regional" ? "ab" : null,
      text: "Only the container restarted; the pod and its volume stayed. The data survives.",
    };
  }
  const target = ev === "sameZone" ? 1 : 2;
  if (ev === "zoneDown") {
    if (vol === "regional")
      return {
        podNode: 2,
        data: "kept",
        diskNode: null,
        diskZone: "ab",
        text: "Zone a is down, but the regional disk has a synchronous copy in zone b. The pod restarts on node-3 and attaches it there.",
      };
    if (vol === "zonal")
      return {
        podNode: null,
        data: "stranded",
        diskNode: null,
        diskZone: "a",
        text: "The disk lives only in zone a. The pod can't attach it anywhere else, so it stays Pending until zone a comes back. Nothing is lost, but the database is down.",
      };
    if (vol === "hostpath")
      return {
        podNode: 2,
        data: "stranded",
        diskNode: 0,
        diskZone: null,
        text: "The data is on node-1's own disk, which is down. The new pod on node-3 starts with an empty directory.",
      };
    return {
      podNode: 2,
      data: "lost",
      diskNode: null,
      diskZone: null,
      text:
        vol === "emptydir"
          ? "emptyDir is deleted when its pod leaves the node. The replacement starts empty."
          : "A new pod means a new container filesystem: empty.",
    };
  }
  if (vol === "container" || vol === "emptydir")
    return {
      podNode: target,
      data: "lost",
      diskNode: null,
      diskZone: null,
      text:
        vol === "emptydir"
          ? 'emptyDir is created when a pod lands on a node and "deleted permanently" when it leaves. The new pod starts empty.'
          : "A new pod means a new container filesystem: empty.",
    };
  if (vol === "hostpath")
    return {
      podNode: target,
      data: "stranded",
      diskNode: 0,
      diskZone: null,
      text: `The data is still in a folder on node-1. The new pod on node-${target + 1} sees that node's folder: empty. (hostPath also "presents many security risks".)`,
    };
  if (vol === "zonal" && ev === "otherZone")
    return {
      podNode: null,
      data: "stranded",
      diskNode: null,
      diskZone: "a",
      text: "Zone a is full, and the disk can only attach to nodes in its own zone. The pod stays Pending: the scheduler respects the volume's zone.",
    };
  return {
    podNode: target,
    data: "kept",
    diskNode: null,
    diskZone: vol === "zonal" ? "a" : "ab",
    text: `The cloud disk is detached from node-1 and attached to node-${target + 1}. The database finds all its data.`,
  };
}
