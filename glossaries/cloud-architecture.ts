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
} satisfies Record<string, GlossaryEntry>;
