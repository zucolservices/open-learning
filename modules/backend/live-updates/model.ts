/** Live order status for 10,000 customers, four ways. Simplified; numbers are illustrative. */

export type Method = "poll" | "long" | "sse" | "ws";

export const METHODS: {
  id: Method;
  label: string;
  reqPerMin: string;
  delay: string;
  open: string;
  direction: string;
  push: boolean;
}[] = [
  {
    id: "poll",
    label: "Polling (5 s)",
    reqPerMin: "120,000",
    delay: "≈ 2.5 s on average",
    open: "Short requests only",
    direction: "Client asks",
    push: false,
  },
  {
    id: "long",
    label: "Long polling",
    reqPerMin: "≈ 20,000",
    delay: "Almost instant",
    open: "Up to 10,000 waiting requests",
    direction: "Client asks, server answers when ready",
    push: true,
  },
  {
    id: "sse",
    label: "SSE",
    reqPerMin: "≈ 0 after connecting",
    delay: "Almost instant",
    open: "10,000 streams",
    direction: "Server → client only",
    push: true,
  },
  {
    id: "ws",
    label: "WebSockets",
    reqPerMin: "≈ 0 after connecting",
    delay: "Almost instant",
    open: "10,000 sockets",
    direction: "Both ways",
    push: true,
  },
];
