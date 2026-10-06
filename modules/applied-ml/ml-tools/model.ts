/** The ML lifecycle and the tools teams use at each stage, by ecosystem. Not a ranking. */

export type Eco = "oss" | "aws" | "gcp" | "azure" | "databricks";

export const ECOS: { id: Eco; name: string }[] = [
  { id: "oss", name: "Open source" },
  { id: "aws", name: "AWS" },
  { id: "gcp", name: "Google Cloud" },
  { id: "azure", name: "Azure" },
  { id: "databricks", name: "Databricks" },
];

export interface Stage {
  id: string;
  name: string;
  job: string;
  tools: Record<Eco, string>;
}

export const STAGES: Stage[] = [
  {
    id: "explore",
    name: "Explore and prepare",
    job: "Load tables, clean them, build features.",
    tools: {
      oss: "pandas, Polars, Jupyter notebooks",
      aws: "SageMaker Unified Studio notebooks",
      gcp: "Colab Enterprise, BigQuery",
      azure: "Azure ML notebooks",
      databricks: "Databricks notebooks, Spark",
    },
  },
  {
    id: "train",
    name: "Train",
    job: "Fit and compare models.",
    tools: {
      oss: "scikit-learn; XGBoost, LightGBM, CatBoost; PyTorch",
      aws: "SageMaker AI training jobs",
      gcp: "Agent Platform custom training and AutoML",
      azure: "Azure ML jobs and AutoML",
      databricks: "Databricks ML runtime and AutoML",
    },
  },
  {
    id: "track",
    name: "Track experiments",
    job: "Record each run's settings, data and scores.",
    tools: {
      oss: "MLflow Tracking",
      aws: "Managed MLflow on SageMaker AI",
      gcp: "Agent Platform experiment tracking",
      azure: "Azure ML (MLflow-compatible)",
      databricks: "Managed MLflow",
    },
  },
  {
    id: "version",
    name: "Version data and models",
    job: "Know exactly which data and model made which result.",
    tools: {
      oss: "DVC, lakeFS; MLflow Model Registry",
      aws: "SageMaker AI Model Registry",
      gcp: "Agent Platform model registry",
      azure: "Azure ML registries",
      databricks: "Unity Catalog models",
    },
  },
  {
    id: "pipeline",
    name: "Automate pipelines",
    job: "Rerun prepare → train → evaluate on a schedule or trigger.",
    tools: {
      oss: "Kubeflow Pipelines, Apache Airflow",
      aws: "SageMaker Pipelines",
      gcp: "Agent Platform pipelines",
      azure: "Azure ML pipelines",
      databricks: "Databricks jobs",
    },
  },
  {
    id: "serve",
    name: "Serve",
    job: "Answer requests or score batches.",
    tools: {
      oss: "FastAPI, BentoML, KServe; ONNX Runtime",
      aws: "SageMaker AI endpoints",
      gcp: "Agent Platform endpoints",
      azure: "Azure ML online endpoints",
      databricks: "Model Serving",
    },
  },
  {
    id: "monitor",
    name: "Monitor",
    job: "Watch drift, data quality and results.",
    tools: {
      oss: "Evidently, NannyML",
      aws: "SageMaker Model Monitor",
      gcp: "Agent Platform model monitoring",
      azure: "Azure ML model monitoring",
      databricks: "Databricks monitoring",
    },
  },
];
