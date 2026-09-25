"use client";

import { useEffect, useState } from "react";

export type Encoding = "r50k_base" | "cl100k_base" | "o200k_base";

interface Tokenizer {
  encode: (text: string) => number[];
  decode: (ids: number[]) => string;
}

const cache = new Map<Encoding, Tokenizer>();

/** Loads a real tokenizer on demand (each is about a megabyte, fetched only when chosen). */
export function useTokenizer(encoding: Encoding): Tokenizer | null {
  const [, setLoaded] = useState(0);
  useEffect(() => {
    if (cache.has(encoding)) return;
    let live = true;
    const load =
      encoding === "o200k_base"
        ? import("gpt-tokenizer/encoding/o200k_base")
        : encoding === "cl100k_base"
          ? import("gpt-tokenizer/encoding/cl100k_base")
          : import("gpt-tokenizer/encoding/r50k_base");
    load.then((m) => {
      cache.set(encoding, {
        encode: (s: string) => m.encode(s),
        decode: (ids: number[]) => m.decode(ids),
      });
      if (live) setLoaded((n) => n + 1);
    });
    return () => {
      live = false;
    };
  }, [encoding]);
  return cache.get(encoding) ?? null;
}

export interface Chip {
  text: string;
  ids: number[];
}

/** Group token IDs into displayable chips: byte-fragment tokens join until they form whole characters. */
export function toChips(ids: number[], decode: (ids: number[]) => string): Chip[] {
  const chips: Chip[] = [];
  let acc: number[] = [];
  for (const id of ids) {
    acc.push(id);
    const t = decode(acc);
    if (t && !t.includes("�")) {
      chips.push({ text: t, ids: acc });
      acc = [];
    }
  }
  if (acc.length) chips.push({ text: decode(acc) || "?", ids: acc });
  return chips;
}
