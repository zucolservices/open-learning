/** Three ways to carry call audio, and what packet loss does to each. Numbers are illustrative. */

export type PathId = "webrtc" | "websocket" | "phone";

export interface Path {
  id: PathId;
  name: string;
  who: string;
  transport: string;
  codec: string;
  rate: string;
  /** How lost packets are handled: skipped and concealed, or resent in order. */
  loss: "conceal" | "resend";
  /** Fixed extra delay before any loss, ms (illustrative). */
  base: number;
  wideband: boolean;
}

export const PATHS: Path[] = [
  {
    id: "webrtc",
    name: "WebRTC",
    who: "Browser or mobile app",
    transport: "RTP over UDP (encrypted)",
    codec: "Opus",
    rate: "up to 48 kHz",
    loss: "conceal",
    base: 60,
    wideband: true,
  },
  {
    id: "websocket",
    name: "WebSocket",
    who: "Your server ↔ the model",
    transport: "Messages over TCP",
    codec: "PCM or Opus, your choice",
    rate: "often 16–24 kHz",
    loss: "resend",
    base: 70,
    wideband: true,
  },
  {
    id: "phone",
    name: "Phone call",
    who: "Anyone with a phone",
    transport: "Phone network → SIP trunk → RTP",
    codec: "G.711 (μ-law / A-law)",
    rate: "8 kHz",
    loss: "conceal",
    base: 150,
    wideband: false,
  },
];

export const PACKETS = 30;
const RTT = 120; // round trip for a resend, ms (illustrative)

/** Deterministic "random" loss so the picture is stable while sliding. */
function lost(i: number, pct: number) {
  const h = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return h - Math.floor(h) < pct / 100;
}

export type Cell = "ok" | "concealed" | "late";

export function simulate(p: Path, pct: number) {
  const cells: Cell[] = [];
  let stall = 0;
  let worstStall = 0;
  let held = 0;
  for (let i = 0; i < PACKETS; i++) {
    if (lost(i, pct)) {
      if (p.loss === "conceal") cells.push("concealed");
      else {
        cells.push("late");
        held = RTT;
        stall += RTT;
        worstStall = Math.max(worstStall, RTT);
      }
    } else if (p.loss === "resend" && held > 0) {
      cells.push("late"); // stuck behind the resend
      held -= 20;
    } else cells.push("ok");
  }
  const concealed = cells.filter((c) => c === "concealed").length;
  return {
    cells,
    concealed,
    stall,
    worstStall,
    delay: p.base + (p.loss === "resend" ? stall / 3 : 0),
  };
}
