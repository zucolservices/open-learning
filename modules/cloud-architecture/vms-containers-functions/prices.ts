/**
 * AWS list prices, US East (N. Virginia), observed 2 October 2026 from the AWS Price List API.
 * Free tiers are ignored. See SOURCES.md.
 */
export const VM_PER_HOUR = 0.0168; // EC2 t4g.small, on demand
export const FARGATE_VCPU_HOUR = 0.04048;
export const FARGATE_GB_HOUR = 0.004445;
export const LAMBDA_GB_SECOND = 0.0000166667; // x86
export const LAMBDA_PER_MILLION = 0.2;

/** The example app: each request takes 100 ms; a function gets 512 MB; a container task 0.25 vCPU and 0.5 GB. */
export const REQUEST_SECONDS = 0.1;
export const FUNCTION_GB = 0.5;
export const TASK_VCPU = 0.25;
export const TASK_GB = 0.5;
export const HOURS = 730;

export type Traffic = "rare" | "office" | "busy";

export const TRAFFIC: [Traffic, string, string, number][] = [
  ["rare", "A rarely used form", "About 200 requests a day.", 200 * 30],
  ["office", "An office-hours app", "About 20,000 requests a day, mostly 9 to 6.", 20000 * 30],
  ["busy", "A busy public API", "About 20 requests every second, day and night.", 20 * 86400 * 30],
];

export function monthlyCost(requests: number) {
  const vm = VM_PER_HOUR * HOURS;
  const container = (TASK_VCPU * FARGATE_VCPU_HOUR + TASK_GB * FARGATE_GB_HOUR) * HOURS;
  const fn =
    requests * REQUEST_SECONDS * FUNCTION_GB * LAMBDA_GB_SECOND +
    (requests / 1e6) * LAMBDA_PER_MILLION;
  return { vm, container, fn };
}
