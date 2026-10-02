export type Vol = "container" | "emptydir" | "hostpath" | "zonal" | "regional";
export type Ev = "crash" | "sameZone" | "otherZone" | "zoneDown";

/** Everything a learner can change in this module, saved for resume. */
export interface StoreState {
  [key: string]: unknown;
  vol: Vol;
  ev: Ev;
  frame: number;
}

export const initialState: StoreState = { vol: "container", ev: "crash", frame: 0 };
