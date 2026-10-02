import type { GlossaryEntry } from "./types";

/** Cloud Architecture track glossary. `module` slugs refer to this track. */
export const cloudArchitecture = {
  "cloud-computing": {
    term: "Cloud computing",
    definition:
      "Renting computing resources (servers, storage, networks, software) from a provider's shared data centres over the network, getting and releasing them on demand and paying for what you use. NIST's 2011 definition names five traits: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service.",
    module: "what-is-cloud",
  },
  "on-premises": {
    term: "On premises",
    definition:
      "Running your own servers in your own building (or racks you control), buying the hardware up front and looking after power, cooling, repairs and security yourself.",
    module: "what-is-cloud",
  },
  iaas: {
    term: "IaaS (infrastructure as a service)",
    definition:
      "Renting virtual machines, storage and networks. The provider runs the hardware; you manage the operating system and everything above it. Examples: Amazon EC2, Azure Virtual Machines, Google Compute Engine.",
    module: "what-is-cloud",
  },
  paas: {
    term: "PaaS (platform as a service)",
    definition:
      "A platform that runs your application code for you, handling servers and scaling. Examples: AWS Elastic Beanstalk, Azure App Service, Google Cloud Run.",
    module: "what-is-cloud",
  },
  saas: {
    term: "SaaS (software as a service)",
    definition:
      "A finished application you use over the internet, run entirely by its vendor, such as Microsoft 365, Google Workspace or Salesforce. Your data and who can access it remain your responsibility.",
    module: "what-is-cloud",
  },
  elasticity: {
    term: "Elasticity",
    definition:
      "Being able to add and remove capacity quickly, often automatically, so what you have follows what you need.",
    module: "what-is-cloud",
  },
  "pay-as-you-go": {
    term: "Pay-as-you-go",
    definition:
      "Paying only for the resources you actually use, metered by the second, minute, gigabyte or request, instead of buying capacity up front.",
    module: "what-is-cloud",
  },
  region: {
    term: "Region",
    definition:
      "A cloud provider's cluster of data centres in one metro area, usually split into three or more availability zones. Regions are far apart, and you choose which ones your resources live in.",
    module: "regions-responsibility",
  },
  "availability-zone": {
    term: "Availability zone",
    definition:
      "One or more data centres within a region with their own power, cooling and network, built to fail independently of the region's other zones. Spreading an application across zones protects it from a building or zone failure.",
    module: "regions-responsibility",
  },
  sla: {
    term: "SLA (service level agreement)",
    definition:
      "A provider's published promise of availability, such as 99.99% a month, with service credits (a partial refund) if it is missed. It is a refund promise, not a guarantee of uptime.",
    module: "regions-responsibility",
  },
  "shared-responsibility": {
    term: "Shared responsibility model",
    definition:
      "The split of security duties between a cloud provider and its customer. The provider secures the buildings, hardware and its own services; the customer always secures its data, accounts, access and configuration, and more besides with IaaS.",
    module: "regions-responsibility",
  },
  "virtual-machine": {
    term: "Virtual machine (VM)",
    definition:
      "A whole computer created in software on a physical server by a hypervisor, with its own operating system. In the cloud you rent VMs by the second or minute and patch their operating systems yourself.",
    module: "vms-containers-functions",
  },
  container: {
    term: "Container",
    definition:
      "An application packed with its libraries into an image that runs isolated on a host while sharing the host's operating system kernel. Lighter and quicker to start than a virtual machine.",
    module: "vms-containers-functions",
  },
  "serverless-function": {
    term: "Function (serverless)",
    definition:
      "A small piece of code the provider runs only when an event arrives (a request, an upload, a timer), billed per millisecond of running time, with no servers for you to manage. Examples: AWS Lambda, Azure Functions, Google Cloud Run functions.",
    module: "vms-containers-functions",
  },
  "cold-start": {
    term: "Cold start",
    definition:
      "The extra wait when a function or scale-to-zero container has no ready copy and the provider must start one. AWS says cold starts usually affect under 1% of Lambda calls and last from under 100 ms to over a second.",
    module: "vms-containers-functions",
  },
  "scaling-group": {
    term: "Scaling group",
    definition:
      "A set of identical servers that the cloud keeps between a minimum and a maximum size, adding or removing servers by rules such as a target CPU level. AWS calls it an Auto Scaling group, Azure a virtual machine scale set, Google a managed instance group.",
    module: "autoscaling-load-balancing",
  },
  vpc: {
    term: "VPC / VNet (virtual private network in the cloud)",
    definition:
      "Your own private network inside a cloud provider, with an address range you choose, divided into subnets. AWS and Google call it a VPC (virtual private cloud); Azure calls it a virtual network (VNet).",
    module: "private-networks",
  },
  cidr: {
    term: "CIDR notation",
    definition:
      "A way to write an address range as a starting address and a prefix length, such as 10.0.0.0/16. The prefix says how many leading bits are fixed: a /24 holds 256 addresses, a /16 holds 65,536.",
    module: "private-networks",
  },
  subnet: {
    term: "Subnet",
    definition:
      "A slice of a network's address range where servers are placed. On AWS each subnet sits in one availability zone; on Azure and Google a subnet spans the zones of its region.",
    module: "private-networks",
  },
  "route-table": {
    term: "Route table",
    definition:
      "A list of rules saying where traffic for each destination range should go, such as 'everything else (0.0.0.0/0) to the internet gateway'. The most specific matching route wins.",
    module: "private-networks",
  },
  "internet-gateway": {
    term: "Internet gateway",
    definition:
      "The connection between a cloud network and the internet. On AWS, a subnet whose route table sends traffic directly to an internet gateway is a public subnet.",
    module: "private-networks",
  },
  "stateful-firewall": {
    term: "Stateful firewall",
    definition:
      "A firewall that remembers connections, so the reply to an allowed request is let back in automatically. Security groups, Azure NSGs and Google's firewall rules are stateful; AWS network ACLs are not.",
    module: "private-networks",
  },
  nat: {
    term: "NAT (network address translation)",
    definition:
      "Rewriting a private address to a public one on the way out and back again for the reply, using a table of connections. It lets private servers reach the internet without being reachable from it. Clouds offer it as a managed NAT gateway.",
    module: "in-and-out",
  },
  "private-endpoint": {
    term: "Private endpoint",
    definition:
      "A private connection from your network to a cloud service (such as object storage) that doesn't go through the internet gateway or NAT. AWS has gateway and interface endpoints, Azure private endpoints, Google Private Service Connect.",
    module: "in-and-out",
  },
  egress: {
    term: "Egress",
    definition:
      "Data leaving a cloud provider's network, usually to the internet, which is charged per gigabyte. Data coming in (ingress) is free.",
    module: "in-and-out",
  },
  peering: {
    term: "Network peering",
    definition:
      "A direct private link between two cloud networks so their servers can talk using private addresses. It isn't transitive: if A peers with B and B with C, A still can't reach C.",
    module: "connecting-networks",
  },
  "transit-hub": {
    term: "Transit hub",
    definition:
      "A central router that many networks and offices connect to, so each needs one link instead of one per pair; traffic between them passes through the hub. Examples: AWS Transit Gateway, Azure Virtual WAN, Google Network Connectivity Center.",
    module: "connecting-networks",
  },
  "site-to-site-vpn": {
    term: "Site-to-site VPN",
    definition:
      "An encrypted tunnel over the internet between an office or data centre and a cloud network. Quick and cheap to set up; AWS gives two tunnels per connection for redundancy.",
    module: "connecting-networks",
  },
  "dedicated-connection": {
    term: "Dedicated connection",
    definition:
      "A private line from your premises to a cloud provider through a colocation site, not over the internet: AWS Direct Connect, Azure ExpressRoute, Google Cloud Interconnect. Faster and steadier than a VPN, but not encrypted by default.",
    module: "connecting-networks",
  },
  dns: {
    term: "DNS",
    definition:
      "The Domain Name System: the internet's directory that turns names like example.com into IP addresses. Answers are cached for a set time (the TTL).",
    module: "dns-routing",
  },
  "routing-policy": {
    term: "DNS routing policy",
    definition:
      "A rule that makes DNS give different answers to different queries: by lowest latency, by country (geolocation), by weight (percentages), or to a standby when health checks fail (failover).",
    module: "dns-routing",
  },
  "private-dns-zone": {
    term: "Private DNS zone",
    definition:
      "A set of DNS names that only resolve from inside your own cloud networks, such as db.internal.example. Route 53 private hosted zones, Azure Private DNS, Google Cloud DNS private zones.",
    module: "dns-routing",
  },
  iam: {
    term: "IAM (identity and access management)",
    definition:
      "The cloud service that decides who may do what to which resource. Every API call is checked against it. AWS IAM, Azure role-based access control (with Microsoft Entra ID), Google Cloud IAM.",
    module: "iam",
  },
  "iam-policy": {
    term: "Access policy",
    definition:
      "A document listing permissions: which actions are allowed (or denied) on which resources, sometimes under conditions. In AWS it is JSON; Azure uses role definitions and assignments; Google uses allow and deny policies.",
    module: "iam",
  },
  principal: {
    term: "Principal",
    definition:
      "Whoever is making a request: a person, a group, or a program (a role, service account or managed identity).",
    module: "iam",
  },
  "iam-role": {
    term: "Role",
    definition:
      "A named set of permissions. In AWS, an identity that people or programs take on temporarily, getting short-lived credentials instead of permanent keys. In Azure and Google, a bundle of permissions you grant to principals.",
    module: "iam",
  },
  "explicit-deny": {
    term: "Explicit deny",
    definition:
      "A rule that says no to a request outright. In AWS and Google Cloud it overrides any allow; requests nothing allows are denied anyway (implicit deny).",
    module: "iam",
  },
  "permissions-boundary": {
    term: "Permissions boundary",
    definition:
      "An AWS limit on the most an identity can ever be allowed. It grants nothing itself; a request must be allowed by both the identity's policy and the boundary. Organisation policies (SCPs) work the same way across accounts.",
    module: "iam",
  },
  "access-key": {
    term: "Long-lived access key",
    definition:
      "A permanent credential (an ID and a secret, like a username and password for programs) that lets code call a cloud API. AWS long-term keys start with AKIA. It works until someone deactivates it, so a leaked one stays dangerous.",
    module: "workload-identity",
  },
  "short-lived-credentials": {
    term: "Short-lived credentials",
    definition:
      "Credentials issued on request that expire by themselves, typically after an hour: AWS role sessions (keys starting ASIA), Azure and Google access tokens. A stolen one soon becomes useless.",
    module: "workload-identity",
  },
  "workload-identity": {
    term: "Workload identity",
    definition:
      "An identity given to running code (a VM, pod, function or pipeline) rather than a person, from which the platform issues short-lived credentials: AWS roles, Azure managed identities, Google service accounts.",
    module: "workload-identity",
  },
  oidc: {
    term: "OpenID Connect (OIDC)",
    definition:
      "A standard (2014, built on OAuth 2.0) for one system to vouch for who someone or something is, with a signed token. Used for single sign-on and for CI pipelines proving their identity to clouds.",
    module: "workload-identity",
  },
  federation: {
    term: "Federation",
    definition:
      "Trusting another identity provider's word about who someone is, instead of keeping separate accounts and passwords: company sign-in for the cloud console, or GitHub's token for a pipeline. Standards: SAML 2.0 and OIDC.",
    module: "workload-identity",
  },
  "envelope-encryption": {
    term: "Envelope encryption",
    definition:
      "Encrypting data with its own data key, then encrypting (sealing) that data key with a master key kept in a key management service. The sealed data key is stored beside the data.",
    module: "encryption-secrets",
  },
  kms: {
    term: "Key management service (KMS)",
    definition:
      "A cloud service that creates and guards master keys in tamper-resistant hardware, uses them only after a permission check, and logs every use: AWS KMS, Azure Key Vault, Google Cloud KMS.",
    module: "encryption-secrets",
  },
  "key-rotation": {
    term: "Key rotation",
    definition:
      "Replacing a key's material with a new version for future encryption while keeping old versions, so existing data still decrypts. It doesn't re-encrypt old data.",
    module: "encryption-secrets",
  },
  tls: {
    term: "TLS",
    definition:
      "Transport Layer Security: the encryption behind https, protecting data while it moves between systems. Clouds now require version 1.2 or newer.",
    module: "encryption-secrets",
  },
  "secret-manager": {
    term: "Secret manager",
    definition:
      "A service that stores passwords, API keys and certificates encrypted, controls and logs who reads them, keeps versions and can rotate them: AWS Secrets Manager, Azure Key Vault, Google Secret Manager, HashiCorp Vault, OpenBao.",
    module: "encryption-secrets",
  },
} satisfies Record<string, GlossaryEntry>;
