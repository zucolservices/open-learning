"use client";

import { useState } from "react";
import {
  BreakPanel,
  type Design,
  type Failure,
} from "@/modules/cloud-architecture/regions-responsibility/break-model";

/** A taste of module 2: pick a design, then break a building, a zone or a region. */
export function CloudTaste() {
  const [design, setDesign] = useState<Design>("one");
  const [failure, setFailure] = useState<Failure>("zone");
  return (
    <BreakPanel design={design} failure={failure} onDesign={setDesign} onFailure={setFailure} />
  );
}
