# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m04-facts.md`.

- AWS EC2 Auto Scaling: target tracking (50% CPU example; thermostat comparison; scales in "more gradually"), step, simple (AWS advises against; 300 s cooldown), scheduled and predictive scaling (needs 24 h history); default instance warmup not on by default (300 s suggested); health check grace period 300 s (console) or 0 (CLI/SDK). CloudWatch basic monitoring 5-minute, detailed 1-minute.
- Elastic Load Balancing: ALB target group health checks interval 30 s, timeout 5 s, healthy 5, unhealthy 2, success code 200; deregistration delay 300 s; fails open when all targets unhealthy. ALB layer 7, NLB layer 4, Gateway LB layer 3; Classic Load Balancer previous generation. Prices us-east-1: ALB $0.0225/h + $0.008/LCU-hour.
- Google Compute Engine managed instance groups: autoscaler initialization period (default 60 s), stabilization period (10 min), scale-in controls, predictive (3 days history); health checks interval 5 s, timeout 5 s, healthy 2, unhealthy 2; autohealing initial delay 300 s (console) or 0 (API). Cloud Load Balancing: Application LB, proxy Network LB, passthrough Network LB.
- Azure: VM Scale Sets (Flexible recommended), autoscale threshold rules, cool-down 5 minutes, predictive autoscale (7 days history, scale-out only), automatic instance repairs (10-minute grace); Load Balancer probe interval 5 s (portal) or 15 s (templates); Basic Load Balancer retired 30 Sept 2025; Application Gateway v1 retired 28 Apr 2026.
- Open source: NGINX (passive checks in open source), HAProxy, Envoy.
- Traffic, capacities and launch times in the simulation are illustrative.
