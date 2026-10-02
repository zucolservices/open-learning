import type { Level } from "./state";

export interface Setting {
  id: string;
  label: string;
  yaml: string;
  group: "risky" | "harden";
}

/** "risky" settings are violations when on; "harden" settings are requirements of Restricted. */
export const SETTINGS: Setting[] = [
  { id: "privileged", label: "privileged: true", yaml: "privileged: true", group: "risky" },
  { id: "hostNetwork", label: "hostNetwork: true", yaml: "hostNetwork: true", group: "risky" },
  {
    id: "hostPath",
    label: "hostPath volume (/var/run)",
    yaml: "volumes: [{ hostPath: { path: /var/run } }]",
    group: "risky",
  },
  {
    id: "netAdmin",
    label: "add capability NET_ADMIN",
    yaml: "capabilities: { add: [NET_ADMIN] }",
    group: "risky",
  },
  { id: "root", label: "runAsUser: 0 (root)", yaml: "runAsUser: 0", group: "risky" },
  { id: "nonRoot", label: "runAsNonRoot: true", yaml: "runAsNonRoot: true", group: "harden" },
  {
    id: "noEscalation",
    label: "allowPrivilegeEscalation: false",
    yaml: "allowPrivilegeEscalation: false",
    group: "harden",
  },
  {
    id: "dropAll",
    label: "capabilities: drop ALL",
    yaml: "capabilities: { drop: [ALL] }",
    group: "harden",
  },
  {
    id: "seccomp",
    label: "seccompProfile: RuntimeDefault",
    yaml: "seccompProfile: { type: RuntimeDefault }",
    group: "harden",
  },
  {
    id: "userns",
    label: "hostUsers: false (user namespace)",
    yaml: "hostUsers: false",
    group: "harden",
  },
];

export function violations(on: string[], level: Level): string[] {
  if (level === "privileged") return [];
  const has = (x: string) => on.includes(x);
  const v: string[] = [];
  if (has("privileged")) v.push("privileged containers are not allowed");
  if (has("hostNetwork")) v.push("host namespaces (hostNetwork) are not allowed");
  if (has("hostPath")) v.push("hostPath volumes are not allowed");
  if (has("netAdmin")) v.push("adding NET_ADMIN goes beyond the default capabilities");
  if (level === "restricted") {
    const userns = has("userns");
    if (!userns && !has("nonRoot")) v.push("runAsNonRoot must be true");
    if (!userns && has("root")) v.push("runAsUser must not be 0");
    if (!has("noEscalation")) v.push("allowPrivilegeEscalation must be false");
    if (!has("dropAll")) v.push("capabilities must drop ALL");
    if (!has("seccomp")) v.push("seccompProfile must be RuntimeDefault or Localhost");
  }
  return v;
}

export function conflicts(on: string[]): string[] {
  const c: string[] = [];
  if (on.includes("userns") && on.includes("hostNetwork"))
    c.push("hostUsers: false can't be combined with hostNetwork.");
  if (on.includes("noEscalation") && on.includes("privileged"))
    c.push("allowPrivilegeEscalation: false can't be set on a privileged container.");
  if (on.includes("nonRoot") && on.includes("root"))
    c.push("runAsNonRoot: true with runAsUser: 0: the kubelet will refuse to start the container.");
  return c;
}
