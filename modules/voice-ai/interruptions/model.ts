/** An agent's reply, a caller who cuts in, and what each side ends up believing. Illustrative. */

export const REPLY =
  "Your booking is for Friday at seven. There's a five hundred rupee deposit, refundable up to a day before. Shall I confirm it?".split(
    " ",
  );

export type Kind = "real" | "backchannel" | "noise";

export const INTERRUPTS: { id: Kind; label: string; said: string }[] = [
  { id: "real", label: "“No, I meant Saturday!”", said: "No, I meant Saturday!" },
  { id: "backchannel", label: "“Mm-hm.”", said: "Mm-hm." },
  { id: "noise", label: "A door slams", said: "(bang)" },
];

export interface Opts {
  at: number;
  kind: Kind;
  stopAudio: boolean;
  truncate: boolean;
  minWords: boolean;
}

export function run(o: Opts) {
  const counts = o.kind === "real" ? true : o.kind === "backchannel" ? !o.minWords : !o.minWords;
  const stopped = counts && o.stopAudio;
  const heard = stopped ? REPLY.slice(0, o.at) : REPLY;
  const thinks = stopped ? (o.truncate ? heard : REPLY) : REPLY;
  let outcome: { text: string; tone: "good" | "bad" | "warn" };
  if (o.kind === "real") {
    if (!o.stopAudio)
      outcome = {
        text: "The agent talks straight over the caller, who repeats themselves louder.",
        tone: "bad",
      };
    else if (!o.truncate)
      outcome = {
        text: "It stops, but believes the caller heard about the deposit. Later: “as I mentioned, the deposit is refundable…” The caller never heard that.",
        tone: "bad",
      };
    else
      outcome = {
        text: "It stops at once and knows exactly what the caller heard. Next: “Saturday at seven instead? And just so you know, there's a refundable deposit.”",
        tone: "good",
      };
  } else {
    if (counts && o.stopAudio)
      outcome = {
        text: `It stops mid-sentence for ${o.kind === "backchannel" ? "a simple “mm-hm”" : "a slamming door"} and asks “Sorry, go ahead?”. Awkward.`,
        tone: "warn",
      };
    else
      outcome = {
        text: `It carries on: ${o.kind === "backchannel" ? "“mm-hm” just means the caller is following" : "a noise isn't a turn"}.`,
        tone: "good",
      };
  }
  return { heard, thinks, outcome, stopped };
}
