/** How a reply delay feels, for the "feel the gap" explore. Bands are a rough guide. */

export function feel(ms: number) {
  if (ms <= 300)
    return {
      label: "Natural",
      text: "Like talking to a person: replies start as you finish.",
      tone: "good" as const,
    };
  if (ms <= 800)
    return {
      label: "Fine",
      text: "A touch slow but comfortable; the range voice builders usually aim for.",
      tone: "good" as const,
    };
  if (ms <= 1500)
    return {
      label: "Noticeable",
      text: "Callers start to wonder if they were heard, and some repeat themselves.",
      tone: "warn" as const,
    };
  return {
    label: "Broken",
    text: "People talk over the bot, repeat themselves or hang up.",
    tone: "bad" as const,
  };
}
