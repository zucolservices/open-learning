"use client";

import { useState } from "react";
import { PoisonPanel } from "@/modules/streaming-data/errors-dlq/poison-panel";
import type { ErrorKind, Strategy } from "@/modules/streaming-data/errors-dlq/state";

/** A taste of module 18: one bad payment, four ways to handle it. */
export function StreamingTaste() {
  const [strategy, setStrategy] = useState<Strategy>("forever");
  const [error, setError] = useState<ErrorKind>("permanent");
  return (
    <PoisonPanel strategy={strategy} error={error} onStrategy={setStrategy} onError={setError} />
  );
}
