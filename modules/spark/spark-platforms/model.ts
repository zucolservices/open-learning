/** Where to run Spark in 2026: who manages what, and the services in each model. */

export type Model = "self" | "managed" | "serverless";
export type Cloud = "aws" | "gcp" | "azure" | "any";

export const LAYERS = [
  "Hardware",
  "OS and JVM",
  "Spark install and upgrades",
  "Cluster size and scaling",
  "Your code and data",
];

/** Index of the first layer you manage (layers below it are the provider's). */
export const YOU_FROM: Record<Model, number> = { self: 1, managed: 3, serverless: 4 };

export const MODELS: Record<Model, { name: string; blurb: string }> = {
  self: {
    name: "Run it yourself",
    blurb:
      "Your own cluster on Kubernetes, YARN or Spark standalone. Full control, full responsibility.",
  },
  managed: {
    name: "Managed clusters",
    blurb: "The provider installs and patches Spark; you choose machines and cluster size.",
  },
  serverless: {
    name: "Serverless",
    blurb: "Submit a job or open a session; the service finds and scales the compute.",
  },
};

export const SERVICES: Record<Cloud, Record<Model, string[]>> = {
  aws: {
    self: ["Spark on Amazon EKS or EC2 (your Kubernetes or YARN)"],
    managed: ["Amazon EMR on EC2", "Amazon EMR on EKS", "Databricks on AWS"],
    serverless: ["Amazon EMR Serverless", "AWS Glue (Glue 6.0 = Spark 4.1)"],
  },
  gcp: {
    self: ["Spark on GKE or Compute Engine"],
    managed: [
      "Managed Service for Apache Spark on clusters (formerly Dataproc)",
      "… on GKE",
      "Databricks on Google Cloud",
    ],
    serverless: [
      "Managed Service for Apache Spark serverless (formerly Serverless for Apache Spark)",
    ],
  },
  azure: {
    self: ["Spark on AKS or VMs"],
    managed: ["Azure Databricks", "HDInsight 5.1 (legacy: Spark 3.3)"],
    serverless: [
      "Microsoft Fabric (Runtime 2.0 = Spark 4.1)",
      "Synapse Spark pools (Spark 3.5; Microsoft steers new work to Fabric)",
    ],
  },
  any: {
    self: [
      "Kubernetes anywhere (GA since Spark 3.1)",
      "Hadoop YARN on premises",
      "Spark standalone",
    ],
    managed: ["Databricks (AWS, Azure, Google Cloud)"],
    serverless: ["Each cloud's serverless option"],
  },
};

export const MANAGERS: { name: string; master: string; note: string }[] = [
  {
    name: "local",
    master: "--master local[*]",
    note: "Driver and executors in one process on your laptop. For learning and tests.",
  },
  {
    name: "Standalone",
    master: "--master spark://host:7077",
    note: "Spark's own simple cluster manager.",
  },
  {
    name: "YARN",
    master: "--master yarn",
    note: "Hadoop's resource manager; still common on premises and on EMR.",
  },
  {
    name: "Kubernetes",
    master: "--master k8s://https://api-server:6443",
    note: "Driver and executors run as pods. GA since Spark 3.1; an Apache Spark Kubernetes Operator also exists.",
  },
];
