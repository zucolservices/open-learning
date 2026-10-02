import type { Region } from "./state";

/** Jun Rao's rule (Confluent, 2015): at least max(t/p, t/c) partitions. */
export function partitions(target: number, perProducer: number, perConsumer: number) {
  const byP = Math.ceil(target / perProducer);
  const byC = Math.ceil(target / perConsumer);
  return { byP, byC, need: Math.max(byP, byC) };
}

/** Disk used by a topic: throughput × retention × replication factor (decimal TB). */
export function storageTB(mbps: number, days: number, rf: number) {
  return (mbps * 86_400 * days * rf) / 1e6;
}

const HOURS = 730;
const SECONDS = HOURS * 3600; // 2,628,000 s in a 730-hour month
const TIB = 1.099511627776; // TB per TiB

/** List prices read 2 October 2026 (us-east-1 / East US vs ap-south-1 / Central India). */
export const PRICES = {
  us: {
    shardHour: 0.015,
    putPerM: 0.014,
    odStreamHour: 0.04,
    odIn: 0.08,
    odOut: 0.04,
    tuHour: 0.03,
    ehEventsPerM: 0.028,
    pubsubTiB: 40,
    slsCluster: 0.75,
    slsPartition: 0.0015,
    slsIn: 0.1,
    slsOut: 0.05,
    ec2: 0.0816,
    gp3: 0.08,
  },
  mumbai: {
    shardHour: 0.0175,
    putPerM: 0.0185,
    odStreamHour: 0.0517,
    odIn: 0.1023,
    odOut: 0.0517,
    tuHour: 0.03,
    ehEventsPerM: 0.028,
    pubsubTiB: 40,
    slsCluster: 0.79,
    slsPartition: 0.0016,
    slsIn: 0.11,
    slsOut: 0.056,
    ec2: 0.0583,
    gp3: 0.0912,
  },
} as const;

export const CROSS_AZ = 0.02; // $0.01/GB out + $0.01/GB in, AWS

export interface Line {
  id: string;
  name: string;
  model: string;
  units: string;
  monthly: number;
}

/** Monthly list-price estimate for one topic: 1 KB records, 24 h retention, `groups` consumer groups. */
export function price(
  mbps: number,
  groups: number,
  region: Region,
  fetchFollower: boolean,
): Line[] {
  const p = PRICES[region];
  const gbIn = (mbps * SECONDS) / 1000;
  const recordsM = (mbps * 1000 * SECONDS) / 1e6; // 1 KB records
  const units = Math.max(Math.ceil(mbps), Math.ceil((mbps * groups) / 2));
  const parts = Math.max(3, units);
  const self = selfRun(mbps, groups, region, fetchFollower);
  return [
    {
      id: "kp",
      name: "Kinesis (provisioned)",
      model: "per shard-hour + per million records",
      units: `${units} shards`,
      monthly: units * HOURS * p.shardHour + recordsM * p.putPerM,
    },
    {
      id: "ko",
      name: "Kinesis (on-demand)",
      model: "per GB in and out + stream-hour",
      units: "no shards to pick",
      monthly: HOURS * p.odStreamHour + gbIn * p.odIn + gbIn * groups * p.odOut,
    },
    {
      id: "eh",
      name: "Event Hubs Standard",
      model: "per throughput unit-hour + per million events",
      units: `${units} TUs`,
      monthly: units * HOURS * p.tuHour + recordsM * p.ehEventsPerM,
    },
    {
      id: "ps",
      name: "Pub/Sub",
      model: "per TiB published and delivered",
      units: "no partitions",
      monthly: ((gbIn * (1 + groups)) / 1000 / TIB) * p.pubsubTiB,
    },
    {
      id: "sl",
      name: "MSK Serverless",
      model: "cluster-hour + partition-hour + per GB",
      units: `${parts} partitions`,
      monthly:
        HOURS * p.slsCluster +
        parts * HOURS * p.slsPartition +
        gbIn * p.slsIn +
        gbIn * groups * p.slsOut,
    },
    {
      id: "self",
      name: "Self-run Kafka on EC2",
      model: "machines + disks + cross-AZ traffic",
      units: "3 brokers (assumed)",
      monthly: self.total,
    },
  ];
}

/** Self-run Kafka across 3 AZs, RF 3, 24 h retention: where the money goes. */
export function selfRun(mbps: number, groups: number, region: Region, fetchFollower: boolean) {
  const p = PRICES[region];
  const gbIn = (mbps * SECONDS) / 1000;
  const machines = 3 * HOURS * p.ec2;
  const disks = storageTB(mbps, 1, 3) * 1000 * p.gp3;
  const produce = gbIn * (2 / 3) * CROSS_AZ; // leader is in another AZ 2 times in 3
  const replicate = gbIn * 2 * CROSS_AZ; // two followers, both in other AZs
  const consume = fetchFollower ? 0 : gbIn * (2 / 3) * CROSS_AZ * groups;
  return {
    machines,
    disks,
    produce,
    replicate,
    consume,
    total: machines + disks + produce + replicate + consume,
  };
}
