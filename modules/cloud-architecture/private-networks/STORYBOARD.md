# Your own private network: storyboard

1. **A housing society** (analogy): land = address range, blocks = subnets, road signs = route tables, main gate = internet gateway, guards = firewalls.
2. **Address ranges, live** (sandbox, real arithmetic in `cidr.ts`): type any CIDR; 32-bit view with the fixed prefix; first and last address, count, RFC 1918 check, usable addresses per provider (AWS/Azure −5, Google −4).
3. **Carve the network** ⭐ (build, real arithmetic): pick a range (10.0.0.0/16 overlaps the office's 10.0.0.0/16; 10.20.0.0/16; 10.20.0.0/22), add four subnets (public/private × zone A/B) at /20–/26, each taking the next free block; bar of the range; checks: no overlap with the office, all four placed, at least half left free. AWS-style layout; Azure/Google differences in narration.
4. **Write the route tables** ⭐ (build): public and private route tables with the local route and a 0.0.0.0/0 target (none / internet gateway / NAT gateway); three live tests (website reachable; database not reachable; app servers can get updates).
5. **Guards at the door** (explore): AWS security groups and network ACLs, Azure NSGs, Google firewall rules; stateful vs stateless.
6. **Security group or network ACL?** (sort checkpoint).
7. **What to remember**.
