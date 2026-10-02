/** Everything a learner can change in this module, saved for resume. */
export interface GitOpsState {
  [key: string]: unknown;
  tool: "helm" | "kustomize";
  env: "dev" | "prod";
  agent: "argo" | "flux";
  selfHeal: boolean;
}

export const initialState: GitOpsState = {
  tool: "helm",
  env: "dev",
  agent: "argo",
  selfHeal: false,
};
