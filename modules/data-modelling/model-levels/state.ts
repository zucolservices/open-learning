import type { Card, Level } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface LevelState {
  [key: string]: unknown;
  level: number;
  card: Card;
  chen: boolean;
}

export const initialState: LevelState = { level: 0, card: "1-n", chen: false };
export const LEVELS: Level[] = ["talk", "conceptual", "logical", "physical"];
