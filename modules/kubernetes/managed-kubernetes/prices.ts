/** List prices read 2–3 October 2026 (us-east-1 / us-central1 / East US vs Mumbai / Central India). Per hour unless noted. */
export const HOURS = 730;

export const P = {
  us: {
    eks: 0.1,
    m6i: 0.192,
    m7g: 0.1632,
    gke: 0.1,
    e2: 0.13402,
    apVcpu: 0.0445,
    apGib: 0.0049225,
    aks: 0.1,
    aksAuto: 0.16,
    aksAutoVcpu: 0.007841,
    d4s: 0.192,
    d8s: 0.384,
    rosa: 0.25,
    ocpLicence: 0.171,
    alb: 0.0225,
    nat: 0.045,
    gp3: 0.08,
  },
  mumbai: {
    eks: 0.1,
    m6i: 0.202,
    m7g: 0.1166,
    gke: 0.1,
    e2: 0.16097,
    apVcpu: 0.0534,
    apGib: 0.0059124,
    aks: 0.1,
    aksAuto: 0.16,
    aksAutoVcpu: 0.010977,
    d4s: 0.202,
    d8s: 0.404,
    rosa: 0.25,
    ocpLicence: 0.171,
    alb: 0.0239,
    nat: 0.056,
    gp3: 0.0912,
  },
} as const;

export interface Option {
  id: string;
  name: string;
  how: string;
  monthly: number;
}

/** Monthly cost of `n` 4 vCPU / 16 GiB nodes plus the control plane; Autopilot billed on pod requests. */
export function options(n: number, region: "us" | "mumbai", requestPct: number): Option[] {
  const p = P[region];
  const h = (x: number) => x * HOURS;
  const vcpu = n * 4 * (requestPct / 100);
  const gib = n * 16 * (requestPct / 100);
  return [
    {
      id: "eks-x86",
      name: "EKS, m6i.xlarge",
      how: "$0.10/h cluster + nodes",
      monthly: h(p.eks + n * p.m6i),
    },
    {
      id: "eks-arm",
      name: "EKS, m7g.xlarge (Graviton)",
      how: "$0.10/h cluster + Arm nodes",
      monthly: h(p.eks + n * p.m7g),
    },
    {
      id: "gke",
      name: "GKE Standard, e2-standard-4",
      how: "$0.10/h cluster (one zonal cluster free) + nodes",
      monthly: h(p.gke + n * p.e2),
    },
    {
      id: "autopilot",
      name: "GKE Autopilot",
      how: `billed on pod requests: ${Math.round(vcpu)} vCPU, ${Math.round(gib)} GiB`,
      monthly: h(vcpu * p.apVcpu + gib * p.apGib),
    },
    {
      id: "aks",
      name: "AKS Standard, D4s v5",
      how: "$0.10/h cluster + nodes",
      monthly: h(p.aks + n * p.d4s),
    },
    {
      id: "aks-auto",
      name: "AKS Automatic",
      how: "$0.16/h cluster + per-vCPU fee + nodes",
      monthly: h(p.aksAuto + n * (p.d4s + 4 * p.aksAutoVcpu)),
    },
    {
      id: "rosa",
      name: "Red Hat OpenShift on AWS (ROSA)",
      how: "$0.25/h cluster + $0.171/h per 4 vCPU + nodes",
      monthly: h(p.rosa + n * (p.m6i + p.ocpLicence)),
    },
    {
      id: "aro",
      name: "Azure Red Hat OpenShift (ARO)",
      how: "licence per 4 vCPU + nodes + 3 control-plane VMs you pay for",
      monthly: h(n * (p.ocpLicence + p.d4s) + 3 * p.d8s),
    },
  ];
}

export function extras(region: "us" | "mumbai") {
  const p = P[region];
  return HOURS * (p.alb + p.nat) + 300 * p.gp3;
}
