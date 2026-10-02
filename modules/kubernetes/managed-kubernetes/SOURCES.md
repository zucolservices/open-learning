# Sources (fact-checked 2026-10-02/03, before building)

Full notes: scratchpad `k8s/m22-facts.md` (raw pages and price feeds in `k8s/m22/`).

- Amazon EKS pricing: $0.10 per cluster-hour (standard support), $0.60 extended; Auto Mode management fee per instance (12% of on-demand price by our calculation); EC2 m6i.xlarge $0.192/h (us-east-1), $0.202/h (ap-south-1); m7g.xlarge $0.1632/h, $0.1166/h.
- GKE pricing: cluster management fee $0.10 per cluster-hour; free tier $74.40/month per billing account (one zonal Standard or Autopilot cluster); Autopilot Pod-based billing $0.0445/vCPU-hour and $0.0049225/GiB-hour (us-central1), $0.0534 and $0.0059124 (asia-south1); e2-standard-4 $0.13402/h (us-central1), $0.16097/h (Mumbai).
- AKS pricing: Free tier (no control-plane charge, no SLA; check current page), Standard $0.10/h, Premium $0.60/h; AKS Automatic $0.16 per cluster-hour plus per-vCPU fee ($0.007841/h East US, $0.010977/h Central India); D4s v5 $0.192/h (East US), $0.202/h (Central India).
- ROSA: $0.25/h per hosted-control-plane cluster + $0.171/h per 4 worker vCPUs. ARO: $0.171/h per 4 worker vCPUs plus control-plane and worker VMs (min. 3 × 8 vCPU control plane).
- Extras: AWS ALB $0.0225/h + LCU; NAT gateway $0.045/h + $0.045/GB (us-east-1); cross-AZ $0.01/GB each way; gp3 $0.08/GB-month; CloudWatch logs $0.50/GB; Azure Log Analytics $2.30/GB. ECS Express Mode: no additional charge.
- Cast AI, 2026 Kubernetes Cost Benchmark (vendor report): "Average CPU utilization fell to 8% in 2025, down from 10%". OpenCost CNCF incubating (Oct 2024); Kubecost acquired by IBM (Sept 2024).
- Google Cloud, GKE vs Cloud Run: GKE "is best suited for complex microservices…, stateful applications".
- All monthly totals are our arithmetic on list prices (730 hours, on-demand, no discounts); the platform comparison table is simplified.
