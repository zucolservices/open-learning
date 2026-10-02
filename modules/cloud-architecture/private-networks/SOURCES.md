# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m05-facts.md`.

- RFC 1918 (private address ranges), RFC 6598 (100.64.0.0/10 shared address space), RFC 4632 (CIDR; /24 = 256 addresses).
- AWS VPC: VPC and subnet sizes /16–/28; subnets in exactly one AZ; 5 reserved addresses per subnet (.0, .1 router, .2 DNS, .3 reserved, last); every route table has a local route; a public subnet "has a direct route to an internet gateway" and instances need a public IP; default VPC 172.31.0.0/16; zonal and regional NAT gateways; security groups (stateful, allow-only) and network ACLs (stateless, allow and deny, numbered rules); VPC IPAM.
- Azure Virtual Network: subnets span all availability zones in a region; 5 reserved addresses per subnet; smallest subnet /29; system routes and user-defined routes; new VNets on API versions after 31 Mar 2026 default to private subnets (no default outbound access); NSGs (stateful, priority 100–4096); Cloud Adoption Framework: "Don't create large virtual networks like /16"; IPAM in Virtual Network Manager.
- Google Cloud VPC: global networks, regional subnets; 4 reserved addresses per primary range; network-wide routes; external IPs or Cloud NAT; Cloud NGFW firewall rules (stateful; implied deny ingress, allow egress).
- Avoiding overlaps with networks you will connect (all three providers require non-overlapping ranges for peering and VPN).
