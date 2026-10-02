# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m03-facts.md`.

- AWS Lambda: memory 128–10,240 MB, timeout 900 s, per-ms billing, init billed; cold starts "typically occur in under 1% of invocations" and last "from under 100 ms to over 1 second"; Firecracker micro-VMs; SnapStart; runtime deprecation policy.
- EC2 docs: a new instance "can take a few minutes" to be ready. Azure Container Instances: containers start "in seconds".
- Google: Cloud Functions renamed Cloud Run functions (22 Aug 2024); Cloud Run scales to zero; gen1 gVisor, gen2 micro-VM.
- Azure Functions: Flex Consumption recommended; Linux Consumption retires 30 Sept 2028. Azure Container Apps scale to zero.
- AWS App Runner closed to new customers 30 April 2026 (ECS Express Mode suggested instead).
- Prices (list, 2 Oct 2026, AWS Price List API, us-east-1): EC2 t4g.small $0.0168/h; Fargate $0.04048 per vCPU-hour, $0.004445 per GB-hour; Lambda $0.0000166667 per GB-second (x86), $0.20 per million requests. Google Cloud Run $0.000024/vCPU-s, $0.0000025/GiB-s; Azure Container Apps $0.000024/vCPU-s, $0.000003/GiB-s.
- The traffic levels and the one-server assumption are illustrative.
