/**
 * Glossaries: one per track, plus a small shared core of general terms.
 *
 * Inside a module, a term resolves against its own track first, then the
 * shared core, so the same word can mean different things in different
 * tracks (e.g. "checkpoint" in Delta Lake vs. in stream processing).
 */
import { dataLakehouse } from "./data-lakehouse";
import { systemDesign } from "./system-design";
import { llmFoundations } from "./llm-foundations";
import { agileScrum } from "./agile-scrum";
import { ragSystems } from "./rag-systems";
import { cloudArchitecture } from "./cloud-architecture";
import { streamingData } from "./streaming-data";
import { kubernetes } from "./kubernetes";
import { ciCd } from "./ci-cd";
import { observability } from "./observability";
import { apiDesign } from "./api-design";
import { databaseInternals } from "./database-internals";
import { enterprisePatterns } from "./enterprise-patterns";
import { spark } from "./spark";
import { dataModelling } from "./data-modelling";
import { dataQuality } from "./data-quality";
import { shared } from "./shared";
import type { GlossaryEntry } from "./types";

export type { GlossaryEntry } from "./types";
export { shared };

export const trackGlossaries: Record<string, Record<string, GlossaryEntry>> = {
  "data-lakehouse": dataLakehouse,
  "system-design": systemDesign,
  "llm-foundations": llmFoundations,
  "agile-scrum": agileScrum,
  "rag-systems": ragSystems,
  "cloud-architecture": cloudArchitecture,
  "streaming-data": streamingData,
  kubernetes,
  "ci-cd": ciCd,
  observability,
  "api-design": apiDesign,
  "database-internals": databaseInternals,
  "enterprise-patterns": enterprisePatterns,
  spark,
  "data-modelling": dataModelling,
  "data-quality": dataQuality,
};

export type TermId =
  | keyof typeof shared
  | keyof typeof dataLakehouse
  | keyof typeof systemDesign
  | keyof typeof llmFoundations
  | keyof typeof agileScrum
  | keyof typeof ragSystems
  | keyof typeof cloudArchitecture
  | keyof typeof streamingData
  | keyof typeof kubernetes
  | keyof typeof ciCd
  | keyof typeof observability
  | keyof typeof apiDesign
  | keyof typeof databaseInternals
  | keyof typeof enterprisePatterns
  | keyof typeof spark
  | keyof typeof dataModelling
  | keyof typeof dataQuality;

export interface ResolvedTerm {
  id: string;
  entry: GlossaryEntry;
  /** Track whose module teaches the term (for "Learn it in…" links). */
  track?: string;
  /** "track" if defined in the track's own glossary, else "shared". */
  scope: "track" | "shared";
}

export function resolveTerm(id: TermId, track?: string): ResolvedTerm {
  const own = track ? trackGlossaries[track]?.[id] : undefined;
  if (own) return { id, entry: own, track, scope: "track" };
  const general = (shared as Record<string, GlossaryEntry>)[id];
  if (general) return { id, entry: general, track: general.track, scope: "shared" };
  for (const [t, g] of Object.entries(trackGlossaries)) {
    if (g[id]) return { id, entry: g[id], track: t, scope: "track" };
  }
  throw new Error(`Unknown glossary term: ${id}`);
}

/** A track's own terms, alphabetically. */
export function trackTerms(track: string): [string, GlossaryEntry][] {
  return Object.entries(trackGlossaries[track] ?? {}).sort((a, b) =>
    a[1].term.localeCompare(b[1].term),
  );
}

export function sharedTerms(): [string, GlossaryEntry][] {
  return (Object.entries(shared) as [string, GlossaryEntry][]).sort((a, b) =>
    a[1].term.localeCompare(b[1].term),
  );
}
