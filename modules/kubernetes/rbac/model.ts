import type { Grant } from "./state";

export const GRANTS: { id: Grant; label: string; yaml: string }[] = [
  {
    id: "admin",
    label: "ClusterRoleBinding → cluster-admin",
    yaml: "kind: ClusterRoleBinding\nroleRef: { kind: ClusterRole, name: cluster-admin }\nsubjects: [{ kind: ServiceAccount, name: resizer, namespace: media }]",
  },
  {
    id: "edit",
    label: "RoleBinding → edit (in media)",
    yaml: "kind: RoleBinding\nmetadata: { namespace: media }\nroleRef: { kind: ClusterRole, name: edit }\nsubjects: [{ kind: ServiceAccount, name: resizer }]",
  },
  {
    id: "secrets",
    label: "Role: get, list secrets + configmaps (media)",
    yaml: 'kind: Role\nmetadata: { namespace: media }\nrules:\n- apiGroups: [""]\n  resources: [secrets, configmaps]\n  verbs: [get, list]',
  },
  {
    id: "least",
    label: "Role: get one ConfigMap by name",
    yaml: 'kind: Role\nmetadata: { namespace: media }\nrules:\n- apiGroups: [""]\n  resources: [configmaps]\n  resourceNames: [resizer-config]\n  verbs: [get]',
  },
  {
    id: "none",
    label: "No permissions, token not mounted",
    yaml: "kind: ServiceAccount\nmetadata: { name: resizer, namespace: media }\nautomountServiceAccountToken: false",
  },
];

export const ACTIONS: { id: string; label: string; who: "app" | "attacker" }[] = [
  { id: "cfg", label: "get configmap resizer-config -n media", who: "app" },
  { id: "allsecrets", label: "list secrets --all-namespaces", who: "attacker" },
  { id: "mediasecrets", label: "get secret payments-db -n media", who: "attacker" },
  {
    id: "createpod",
    label: "create pod -n media (to borrow another service account)",
    who: "attacker",
  },
  { id: "delete", label: "delete deployment checkout -n shop", who: "attacker" },
];

export function allowed(g: Grant, action: string): boolean {
  switch (g) {
    case "admin":
      return true;
    case "edit":
      return ["cfg", "mediasecrets", "createpod"].includes(action);
    case "secrets":
      return ["cfg", "mediasecrets"].includes(action);
    case "least":
      return action === "cfg";
    case "none":
      return false;
  }
}
