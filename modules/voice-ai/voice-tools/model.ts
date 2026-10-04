/** Moving a booking during a call: what the caller hears, second by second. Timings are illustrative. */

export interface Opts {
  lookup: number; // seconds the booking lookup takes
  preamble: boolean;
  confirm: boolean;
  waitResult: boolean;
  fails: boolean;
}

export type Who = "caller" | "agent" | "tool" | "silence";
export interface Event {
  t: number;
  who: Who;
  text: string;
  tone?: "bad" | "good";
}

const PREAMBLE = 1.5;
const CHANGE = 1.2;

export function simulate(o: Opts) {
  const ev: Event[] = [];
  let t = 0;
  ev.push({ t, who: "caller", text: "Can you move my Tuesday check-up to Friday?" });
  t += 0.6;
  ev.push({
    t,
    who: "tool",
    text: `find_booking(phone="…0123")  ·  takes ${o.lookup.toFixed(1)} s`,
  });
  if (o.preamble) ev.push({ t, who: "agent", text: "Sure, let me pull up your booking." });
  const gap = o.lookup - (o.preamble ? PREAMBLE : 0);
  if (gap > 0.3)
    ev.push({
      t: t + (o.preamble ? PREAMBLE : 0),
      who: "silence",
      text: `${gap.toFixed(1)} s of silence`,
      tone: gap > 2 ? "bad" : undefined,
    });
  t += o.lookup;
  ev.push({
    t,
    who: "agent",
    text: "Found it: Tuesday the 14th at 4 PM with Dr. Rao. Friday at 4 is free.",
  });
  t += 2.5;
  if (o.confirm) {
    ev.push({
      t,
      who: "agent",
      text: "I'll move it to Friday the 17th at 4 PM. Shall I go ahead?",
    });
    t += 2.5;
    ev.push({ t, who: "caller", text: "Yes, please." });
    t += 0.8;
  }
  ev.push({
    t,
    who: "tool",
    text: `move_booking(to="Fri 17 Oct, 16:00")  ·  takes ${CHANGE.toFixed(1)} s`,
  });
  let outcome: { text: string; tone: "good" | "bad" };
  if (!o.waitResult) {
    ev.push({
      t,
      who: "agent",
      text: "Done! You're all set for Friday.",
      tone: o.fails ? "bad" : undefined,
    });
    t += CHANGE;
    ev.push({
      t,
      who: "tool",
      text: o.fails ? "error: slot no longer available" : "ok",
      tone: o.fails ? "bad" : "good",
    });
    outcome = o.fails
      ? {
          text: "The agent said “done” before the result came back. The booking failed, and the caller hangs up believing it moved.",
          tone: "bad",
        }
      : {
          text: "It worked this time, but only by luck: the agent announced success before it knew.",
          tone: "bad",
        };
  } else {
    ev.push({ t, who: "agent", text: "Moving it now…" });
    t += CHANGE;
    ev.push({
      t,
      who: "tool",
      text: o.fails ? "error: slot no longer available" : "ok",
      tone: o.fails ? "bad" : "good",
    });
    t += 0.4;
    ev.push(
      o.fails
        ? {
            t,
            who: "agent",
            text: "That slot was just taken, I'm sorry. Your Tuesday booking is unchanged. Would Friday at 5 work?",
          }
        : {
            t,
            who: "agent",
            text: "Done: you're now booked for Friday the 17th at 4 PM with Dr. Rao.",
          },
    );
    outcome = {
      text: o.fails
        ? "The failure is reported honestly, and the caller knows exactly where they stand."
        : "The caller hears the change only once it has really happened.",
      tone: "good",
    };
  }
  if (!o.confirm)
    outcome = {
      text: "It changed the booking without reading it back. If the caller had misspoken, or meant a different booking, the wrong one moved.",
      tone: "bad",
    };
  const longest = Math.max(0, gap);
  return { ev, outcome, longest };
}
