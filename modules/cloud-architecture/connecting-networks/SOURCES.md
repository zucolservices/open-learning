# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m07-facts.md`.

- AWS VPC peering: "VPC peering does not support transitive peering relationships"; 50 active peerings per VPC by default (up to 125). Google VPC Network Peering "does not provide transitive routing". Azure: nontransitive peering (hub-spoke reference architecture), gateway transit; 650 peerings per VNet; Azure Virtual Network Manager.
- Hubs: AWS Transit Gateway ($0.05 per attachment-hour us-east-1, $0.07 Mumbai, $0.02/GB); AWS Cloud WAN; Azure Virtual WAN (Basic, Standard); Google Network Connectivity Center ($0.10 per spoke-hour, $0.02/GiB).
- AWS Site-to-Site VPN: two tunnels per connection in different AZs; 1.25 Gbps per tunnel by default (Large Bandwidth Tunnels up to 5 Gbps on Transit Gateway/Cloud WAN); $0.05 per connection-hour. Azure VPN Gateway (zone-redundant AZ SKUs; non-AZ SKUs retiring). Google HA VPN: 99.99% needs two tunnels (four with AWS peers), BGP only.
- Dedicated: AWS Direct Connect dedicated 1/10/100/400 Gbps, hosted 50 Mbps–25 Gbps, 1 Gbps port $0.30/h; data out from AWS India regions to Indian Direct Connect locations $0.045/GB (internet from Mumbai $0.1093/GB); locations Mumbai, Delhi, Chennai, Hyderabad, Bangalore, Kolkata. Azure ExpressRoute (India: Chennai, Chennai2, Mumbai, Mumbai2, Mumbai Metro, Pune; Direct 10/100/400 Gbps). Google Cloud Interconnect (Dedicated 10/100/400 Gbps; India: Mumbai, Delhi (Noida), Chennai, Hyderabad). Not encrypted by default (AWS, Azure quotes); MACsec optional.
- BGP (Azure: "the standard routing protocol commonly used in the Internet…"); AWS static vs dynamic routing. Overlapping ranges unsupported (Azure VPN FAQ: "No."); private NAT and private endpoints as workarounds.
