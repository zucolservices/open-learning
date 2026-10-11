/**
 * One shared group order edited on two devices that go on and offline. Changes are written
 * locally and queued; when a device reconnects its queue syncs to the server using either
 * last-write-wins on the whole order or a merge of individual changes.
 */

export type Dev = "phone" | "tablet";
export type Mode = "online-only" | "offline-first";
export type Strategy = "lww" | "merge";

export interface Order {
  items: Record<string, number>;
  pickup: string;
  /** Logical time of the last pickup change, used to spot conflicts. */
  pickupAt: number;
}

export type Op =
  { kind: "add"; item: string; at: number } | { kind: "pickup"; value: string; at: number };

export type OpInput = { kind: "add"; item: string } | { kind: "pickup"; value: string };

export interface Device {
  online: boolean;
  local: Order;
  outbox: Op[];
  /** The server's pickup time the last time this device synced. */
  basePickupAt: number;
}

export interface World {
  server: Order;
  devices: Record<Dev, Device>;
  clock: number;
  log: string[];
}

const EMPTY: Order = { items: {}, pickup: "12:15", pickupAt: 0 };

export const START: World = {
  server: EMPTY,
  devices: {
    phone: { online: true, local: EMPTY, outbox: [], basePickupAt: 0 },
    tablet: { online: true, local: EMPTY, outbox: [], basePickupAt: 0 },
  },
  clock: 1,
  log: ["Both devices show the same empty group order."],
};

export const NAME: Record<Dev, string> = { phone: "Phone", tablet: "Tablet" };

function applyLocal(o: Order, op: Op): Order {
  if (op.kind === "add")
    return { ...o, items: { ...o.items, [op.item]: (o.items[op.item] ?? 0) + 1 } };
  return { ...o, pickup: op.value, pickupAt: op.at };
}

/** Push a device's queue to the server, then refresh every online device from it. */
function sync(w: World, d: Dev, strategy: Strategy): World {
  const dev = w.devices[d];
  if (!dev.online || !dev.outbox.length) return w;
  const log = [...w.log];
  let server: Order;
  if (strategy === "lww") {
    const lost = Object.keys(w.server.items).filter(
      (k) => !(k in dev.local.items) || dev.local.items[k] < w.server.items[k],
    );
    server = dev.local;
    log.push(
      lost.length
        ? `${NAME[d]} synced its whole copy and overwrote the server. Lost: ${lost.join(", ")}.`
        : `${NAME[d]} synced its whole copy to the server.`,
    );
  } else {
    server = w.server;
    for (const op of dev.outbox) {
      if (op.kind === "add") server = applyLocal(server, op);
      else if (server.pickupAt > dev.basePickupAt && server.pickupAt > op.at) {
        log.push(
          `Both devices changed the pickup time. Kept the later change (${server.pickup}) and flagged it for the customer.`,
        );
      } else {
        if (server.pickupAt > dev.basePickupAt)
          log.push(
            `Both devices changed the pickup time. Kept the later change (${op.value}) and flagged it for the customer.`,
          );
        server = applyLocal(server, op);
      }
    }
    log.push(
      `${NAME[d]} sent ${dev.outbox.length} queued change${dev.outbox.length > 1 ? "s" : ""}; the server merged them.`,
    );
  }
  const devices = { ...w.devices, [d]: { ...dev, outbox: [] } };
  for (const k of Object.keys(devices) as Dev[]) {
    const x = devices[k];
    if (x.online)
      devices[k] = {
        ...x,
        local: x.outbox.reduce(applyLocal, server),
        basePickupAt: server.pickupAt,
      };
  }
  return { ...w, server, devices, log };
}

export function edit(w: World, d: Dev, op: OpInput, mode: Mode, strategy: Strategy): World {
  const dev = w.devices[d];
  if (mode === "online-only" && !dev.online)
    return {
      ...w,
      log: [...w.log, `${NAME[d]}: "No connection. Try again later." The change was not saved.`],
    };
  const full = { ...op, at: w.clock } as Op;
  const next: World = {
    ...w,
    clock: w.clock + 1,
    devices: {
      ...w.devices,
      [d]: { ...dev, local: applyLocal(dev.local, full), outbox: [...dev.outbox, full] },
    },
    log: dev.online ? w.log : [...w.log, `${NAME[d]} saved the change locally and queued it.`],
  };
  return sync(next, d, strategy);
}

export function setOnline(w: World, d: Dev, online: boolean, strategy: Strategy): World {
  const dev = w.devices[d];
  const next: World = {
    ...w,
    devices: { ...w.devices, [d]: { ...dev, online } },
    log: [...w.log, online ? `${NAME[d]} is back online.` : `${NAME[d]} lost its signal.`],
  };
  if (!online) return next;
  if (!dev.outbox.length) {
    const fresh = { ...next.devices[d], local: next.server, basePickupAt: next.server.pickupAt };
    return { ...next, devices: { ...next.devices, [d]: fresh } };
  }
  return sync(next, d, strategy);
}
