export interface GlossaryEntry {
  term: string;
  definition: string;
  analogy?: string;
  /** Module that teaches this in depth (in the owning track, or in `track` for shared terms). */
  module?: string;
  /** Shared terms only: the track whose module teaches it. */
  track?: string;
}
