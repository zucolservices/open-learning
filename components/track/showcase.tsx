import type { ComponentType } from "react";
import { LakehouseScene } from "@/components/home/lakehouse-scene";
import { TimeTravel } from "@/components/home/time-travel";
import { ScaleScene } from "@/components/home/scale-scene";
import { NextTokenScene } from "@/components/home/next-token-scene";
import { TemperatureTaste } from "@/components/home/temperature-taste";

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
};
