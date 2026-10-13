import type { ComponentType } from "react";
import { LakehouseScene } from "@/components/home/lakehouse-scene";
import { TimeTravel } from "@/components/home/time-travel";
import { ScaleScene } from "@/components/home/scale-scene";
import { NextTokenScene } from "@/components/home/next-token-scene";
import { TemperatureTaste } from "@/components/home/temperature-taste";
import { ScrumScene } from "@/components/home/scrum-scene";
import { CadenceTaste } from "@/components/home/cadence-taste";
import { RagScene } from "@/components/home/rag-scene";
import { RagTaste } from "@/components/home/rag-taste";
import { CloudScene } from "@/components/home/cloud-scene";
import { CloudTaste } from "@/components/home/cloud-taste";
import { StreamingScene } from "@/components/home/streaming-scene";
import { StreamingTaste } from "@/components/home/streaming-taste";
import { KubernetesScene } from "@/components/home/kubernetes-scene";
import { KubernetesTaste } from "@/components/home/kubernetes-taste";
import { CiCdScene } from "@/components/home/ci-cd-scene";
import { CiCdTaste } from "@/components/home/ci-cd-taste";
import { ObservabilityScene } from "@/components/home/observability-scene";
import { ObservabilityTaste } from "@/components/home/observability-taste";
import { ApiDesignScene } from "@/components/home/api-design-scene";
import { ApiDesignTaste } from "@/components/home/api-design-taste";
import { DatabaseInternalsScene } from "@/components/home/database-internals-scene";
import { DatabaseInternalsTaste } from "@/components/home/database-internals-taste";
import { EnterprisePatternsScene } from "@/components/home/enterprise-patterns-scene";
import { EnterprisePatternsTaste } from "@/components/home/enterprise-patterns-taste";
import { SparkScene } from "@/components/home/spark-scene";
import { SparkTaste } from "@/components/home/spark-taste";
import { DataModellingScene } from "@/components/home/data-modelling-scene";
import { DataModellingTaste } from "@/components/home/data-modelling-taste";
import { DataQualityScene } from "@/components/home/data-quality-scene";
import { DataQualityTaste } from "@/components/home/data-quality-taste";
import { AiAgentsScene } from "@/components/home/ai-agents-scene";
import { AiAgentsTaste } from "@/components/home/ai-agents-taste";
import { VoiceAiScene } from "@/components/home/voice-ai-scene";
import { VoiceAiTaste } from "@/components/home/voice-ai-taste";
import { LlmEvaluationScene } from "@/components/home/llm-evaluation-scene";
import { LlmEvaluationTaste } from "@/components/home/llm-evaluation-taste";
import { AppliedMlScene } from "@/components/home/applied-ml-scene";
import { AppliedMlTaste } from "@/components/home/applied-ml-taste";
import { AppSecurityScene } from "@/components/home/app-security-scene";
import { AppSecurityTaste } from "@/components/home/app-security-taste";
import { DpdpActScene } from "@/components/home/dpdp-act-scene";
import { DpdpActTaste } from "@/components/home/dpdp-act-taste";
import { GitScene } from "@/components/home/git-scene";
import { GitTaste } from "@/components/home/git-taste";
import { TestingScene } from "@/components/home/testing-scene";
import { TestingTaste } from "@/components/home/testing-taste";
import { CleanCodeScene } from "@/components/home/clean-code-scene";
import { CleanCodeTaste } from "@/components/home/clean-code-taste";
import { CodeReviewScene } from "@/components/home/code-review-scene";
import { CodeReviewTaste } from "@/components/home/code-review-taste";
import { FrontendScene } from "@/components/home/frontend-scene";
import { FrontendTaste } from "@/components/home/frontend-taste";
import { BackendScene } from "@/components/home/backend-scene";
import { BackendTaste } from "@/components/home/backend-taste";
import { MobileScene } from "@/components/home/mobile-scene";
import { MobileTaste } from "@/components/home/mobile-taste";
import { GovScene } from "@/components/home/building-for-government-scene";
import { GovTaste } from "@/components/home/building-for-government-taste";

export interface Showcase {
  /** Big animated scene for the track page. */
  Scene: ComponentType;
  sceneCaption: string;
  /** Smaller hands-on taste, also used on the category page. */
  Taste?: ComponentType;
  tasteCaption?: string;
}

/** Each track brings its own animated infographics. */
export const showcases: Record<string, Showcase> = {
  "data-lakehouse": {
    Scene: LakehouseScene,
    sceneCaption: "Files, table formats, catalogs and engines: the layers of a lakehouse.",
    Taste: TimeTravel,
    tasteCaption:
      "A taste of module 6: time travel on the Delta transaction log. Click any version.",
  },
  "system-design": {
    Scene: ScaleScene,
    sceneCaption: "One app, from 100 users to 100 million, and what gets added at each step.",
    Taste: ScaleScene,
    tasteCaption: "The architecture grows with its users. Pick a stage.",
  },
  "llm-foundations": {
    Scene: NextTokenScene,
    sceneCaption:
      "What every LLM does: read the tokens, score every possible next one, pick, repeat. Real scores from a small open model.",
    Taste: TemperatureTaste,
    tasteCaption:
      "A taste of module 7: turn the temperature on the same model's real odds, then pick a word.",
  },
  "agile-scrum": {
    Scene: ScrumScene,
    sceneCaption:
      "All of Scrum on one page: three accountabilities, five events, three artifacts. Watch one Sprint, or click any part.",
    Taste: CadenceTaste,
    tasteCaption:
      "A taste of module 1: how often users see a working version decides when the surprises show up.",
  },
  "rag-systems": {
    Scene: RagScene,
    sceneCaption:
      "What RAG does: place the question among the documents by meaning, fetch the nearest passages, answer from them. A real embedding map and real answers from a small open model.",
    Taste: RagTaste,
    tasteCaption:
      "A taste of module 2: the same small model answering from memory, then with the corporation's documents.",
  },
  "cloud-architecture": {
    Scene: CloudScene,
    sceneCaption:
      "One well-built cloud foundation, from the user's request to the guardrails around it. Watch the tour, or click any part.",
    Taste: CloudTaste,
    tasteCaption:
      "A taste of module 2: pick a design, then break a building, a zone or a whole region.",
  },
  "streaming-data": {
    Scene: StreamingScene,
    sceneCaption:
      "One payments pipeline, from the phone to every place a payment ends up. Watch the tour, or click any part.",
    Taste: StreamingTaste,
    tasteCaption:
      "A taste of module 18: one bad payment blocks a partition. Try four ways to handle it.",
  },
  kubernetes: {
    Scene: KubernetesScene,
    sceneCaption:
      "A small production cluster, from the YAML in Git to traffic reaching a pod. Watch the tour, or click any part.",
    Taste: KubernetesTaste,
    tasteCaption:
      "A taste of module 2: delete pods or cut a node's power, and watch the cluster put everything back.",
  },
  "ci-cd": {
    Scene: CiCdScene,
    sceneCaption:
      "One change, from a small commit to its first users, with the guard rails along the way. Watch the tour, or click any part.",
    Taste: CiCdTaste,
    tasteCaption:
      "A taste of module 13: release a buggy version five ways and see how many requests fail.",
  },
  observability: {
    Scene: ObservabilityScene,
    sceneCaption:
      "Telemetry from a payments platform, from the services that emit it to the person who gets paged. Watch the tour, or click any part.",
    Taste: ObservabilityTaste,
    tasteCaption:
      "A taste of module 15: three alert rules over the same week. Which one wakes people only for real problems?",
  },
  "api-design": {
    Scene: ApiDesignScene,
    sceneCaption:
      "One request to a parcel API, from a partner's app through the gateway and back, with the promises around it. Watch the tour, or click any part.",
    Taste: ApiDesignTaste,
    tasteCaption:
      "A taste of module 7: page through a list while orders arrive or are cancelled. Offsets repeat or skip; cursors don't.",
  },
  "database-internals": {
    Scene: DatabaseInternalsScene,
    sceneCaption:
      "One query's journey through a database engine, from SQL text to pages on disk, with the log and the copies that keep it safe. Watch the tour, or click any part.",
    Taste: DatabaseInternalsTaste,
    tasteCaption:
      "A taste of module 15: two transactions collide at each isolation level. Find the lowest level that stops each glitch.",
  },
  "enterprise-patterns": {
    Scene: EnterprisePatternsScene,
    sceneCaption:
      "A modernised estate, from the teams down to the legacy system still running underneath. Watch the tour, or click any part.",
    Taste: EnterprisePatternsTaste,
    tasteCaption:
      "A taste of module 8: connect two systems four ways and put each through the same four situations.",
  },
  spark: {
    Scene: SparkScene,
    sceneCaption:
      "One query's journey through Spark, from your code on the driver to files on storage. Watch the tour, or click any part.",
    Taste: SparkTaste,
    tasteCaption:
      "A taste of module 10: change one table's size and the join condition, and see which strategy Spark picks and how much data moves.",
  },
  "data-modelling": {
    Scene: DataModellingScene,
    sceneCaption:
      "A modelled warehouse for a food-delivery company, from source systems to one set of numbers. Watch the tour, or click any part.",
    Taste: DataModellingTaste,
    tasteCaption:
      "A taste of module 11: a customer moves city. See what each slowly-changing-dimension type does to last year's report.",
  },
  "data-quality": {
    Scene: DataQualityScene,
    sceneCaption:
      "A data pipeline with a defence at every stage, from the producer's contract to the board report. Watch the tour, or click any part.",
    Taste: DataQualityTaste,
    tasteCaption:
      "A taste of module 13: judge eight weeks of row counts three ways and count the real problems caught and the false alarms.",
  },
  "ai-agents": {
    Scene: AiAgentsScene,
    sceneCaption:
      "An agent system: a model in a loop with tools, memory, other agents, guardrails, a person and evals. Watch the tour, or click any part.",
    Taste: AiAgentsTaste,
    tasteCaption:
      "A taste of module 17: switch the three legs of the lethal trifecta and see whether a poisoned web page can steal data.",
  },
  "voice-ai": {
    Scene: VoiceAiScene,
    sceneCaption:
      "One call's round trip: from the caller's voice through turn-taking, speech-to-text, the model and a voice, and back. Watch the tour, or click any part.",
    Taste: VoiceAiTaste,
    tasteCaption:
      "A taste of module 12: cut the assistant off mid-sentence and compare what the caller heard with what the agent thinks it said.",
  },
  "llm-evaluation": {
    Scene: LlmEvaluationScene,
    sceneCaption:
      "The evaluation loop: define good, build the set, grade, check with people, add error bars, test for harm, ship carefully and keep watching. Watch the tour, or click any part.",
    Taste: LlmEvaluationTaste,
    tasteCaption:
      "A taste of module 6: switch on fixes and watch a biased LLM judge go from coin-flip to agreeing with experts.",
  },
  "applied-ml": {
    Scene: AppliedMlScene,
    sceneCaption:
      "The ML lifecycle: frame the question, prepare honest data, model, evaluate, tune and explain, serve and monitor. Watch the tour, or click any part.",
    Taste: AppliedMlTaste,
    tasteCaption:
      "A taste of module 19: break the live feature pipeline and watch the same loan model give different answers.",
  },
  "app-security": {
    Scene: AppSecurityScene,
    sceneCaption:
      "The defender's layers an attacker must beat: threat modelling, input, identity, the browser, the server, the supply chain, and detection. Watch the tour, or click any part.",
    Taste: AppSecurityTaste,
    tasteCaption:
      "A taste of module 5: watch a login query turn crafted input into code, then switch to a parameterised query and stop it.",
  },
  "dpdp-act": {
    Scene: DpdpActScene,
    sceneCaption:
      "The life of one person's data under the DPDP Act: notice, consent, use for a purpose, protection, rights and erasure, with breach notices and the Data Protection Board watching over. Watch the tour, or click any part.",
    Taste: DpdpActTaste,
    tasteCaption:
      "A taste of module 6: a sign-up screen with every bad habit switched on. Click each red pill and watch consent become valid.",
  },
  git: {
    Scene: GitScene,
    sceneCaption:
      "A change's journey through Git: the three areas, commits, branches, merging, remotes and pull requests, with undo and recovery always within reach. Watch the tour, or click any part.",
    Taste: GitTaste,
    tasteCaption:
      "A taste of modules 6 and 8: merge or rebase a feature branch and watch the commit graph change.",
  },
  testing: {
    Scene: TestingScene,
    sceneCaption:
      "The safety nets around every change: well-chosen unit, integration and end-to-end tests, checks on the tests themselves, CI, exploration and gradual rollout. Watch the tour, or click any part.",
    Taste: TestingTaste,
    tasteCaption:
      "A taste of module 14: tick tests and watch planted bugs die. Any bug that survives would slip past your tests.",
  },
  "clean-code": {
    Scene: CleanCodeScene,
    sceneCaption:
      "What makes code easy to read and change: readable foundations, simplicity, design, errors and edges, changing code safely, and team habits. Watch the tour, or click any part.",
    Taste: CleanCodeTaste,
    tasteCaption:
      "A taste of module 8: flatten a nested function in three behaviour-preserving steps and watch its complexity fall.",
  },
  "code-review": {
    Scene: CodeReviewScene,
    sceneCaption:
      "Two minds on every change: why review exists, making changes easy to review, reading and commenting well, fast and fair process, and a healthy culture. Watch the tour, or click any part.",
    Taste: CodeReviewTaste,
    tasteCaption:
      "A taste of module 10: label each review comment as blocking, a suggestion, a question or a nit, and see what the author must change.",
  },
  frontend: {
    Scene: FrontendScene,
    sceneCaption:
      "From a URL to pixels people can use: the browser, building interfaces, data and navigation, rendering strategies, performance, and quality for everyone. Watch the tour, or click any part.",
    Taste: FrontendTaste,
    tasteCaption:
      "A taste of module 15: fix six common problems on a slow, jumpy page and watch its Core Web Vitals turn good.",
  },
  backend: {
    Scene: BackendScene,
    sceneCaption:
      "From one request to a production service: foundations, building a service, data, identity, work beyond request and response, and running in production. Watch the tour, or click any part.",
    Taste: BackendTaste,
    tasteCaption:
      "A taste of module 10: two customers buy the last chai at the same instant. Pick a strategy and see whether it gets sold twice.",
  },
  mobile: {
    Scene: MobileScene,
    sceneCaption:
      "From the first screen to the stores: foundations, building screens, data and networking, the device, performance and quality, and shipping. Watch the tour, or click any part.",
    Taste: MobileTaste,
    tasteCaption:
      "A taste of module 11: the food is ready at 12:22 and the phone is in a pocket. Try each way the app could tell the customer.",
  },
  "building-for-government": {
    Scene: GovScene,
    sceneCaption:
      "What building public services involves: why government is different, the rules, identity and data, designing for everyone, security and resilience, and delivering for the long term. Watch the tour, or click any part.",
    Taste: GovTaste,
    tasteCaption:
      "A taste of module 17: exam results go live at 10 a.m. and millions arrive. Switch on caching, a lighter page, a queue or SMS results and watch the errors fall.",
  },
};
