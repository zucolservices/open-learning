/** Step-through frames for one chat message, under three scenarios. */

export type Node = "priya" | "g1" | "chat" | "db" | "registry" | "g7" | "arjun" | "push";
export type Edge = `${Node}-${Node}`;

export interface ChatFrame {
  title: string;
  text: string;
  active: Edge[];
  ticks: 0 | 1 | 2 | 3; // 1 sent, 2 delivered, 3 read
  arjunOnline: boolean;
  tone?: "good" | "bad";
}

const send: ChatFrame = {
  title: "Priya presses send",
  text: "Her phone keeps a WebSocket open to gateway server G1. It sends the message with an ID the phone generated (m-8f3a), so a retry can be recognised.",
  active: ["priya-g1"],
  ticks: 0,
  arjunOnline: true,
};
const store: ChatFrame = {
  title: "Stored and numbered",
  text: "The chat service gives the message the next sequence number in this conversation (#42) and saves it. Only then does Priya get one tick: sent.",
  active: ["g1-chat", "chat-db"],
  ticks: 1,
  arjunOnline: true,
};
const lookup: ChatFrame = {
  title: "Where is Arjun connected?",
  text: "A session registry maps each online user to their gateway: Arjun → G7. Millions of phones are spread over hundreds of gateways.",
  active: ["chat-registry"],
  ticks: 1,
  arjunOnline: true,
};

export function chatFrames(scenario: "online" | "offline" | "drop"): ChatFrame[] {
  if (scenario === "online")
    return [
      send,
      store,
      lookup,
      {
        title: "Pushed to Arjun",
        text: "G7 pushes #42 down Arjun's open connection. His phone acknowledges it, and Priya sees two ticks: delivered.",
        active: ["chat-g7", "g7-arjun"],
        ticks: 2,
        arjunOnline: true,
      },
      {
        title: "Read",
        text: "When Arjun opens the chat, his phone sends a read receipt back the same way. Receipts are just small messages too.",
        active: ["arjun-g7", "g7-chat", "chat-g1", "g1-priya"],
        ticks: 3,
        arjunOnline: true,
        tone: "good",
      },
    ];
  if (scenario === "offline")
    return [
      send,
      store,
      {
        title: "Arjun isn't connected",
        text: "The registry has no gateway for Arjun: his phone is in a tunnel. The message waits safely in storage.",
        active: ["chat-registry"],
        ticks: 1,
        arjunOnline: false,
      },
      {
        title: "A push notification",
        text: "The service asks Apple's or Google's push service (APNs, FCM) to wake Arjun's phone. Notifications can be delayed or dropped, so they're only a nudge.",
        active: ["chat-push"],
        ticks: 1,
        arjunOnline: false,
      },
      {
        title: "Catch up on reconnect",
        text: "Back online, Arjun's phone reconnects (to G7 or any gateway) and asks: 'anything after #41?'. It gets #42, and Priya sees two ticks.",
        active: ["arjun-g7", "g7-chat", "chat-db"],
        ticks: 2,
        arjunOnline: true,
        tone: "good",
      },
    ];
  return [
    send,
    store,
    {
      title: "Priya's signal drops",
      text: "The message was stored, but the 'sent' acknowledgement never reached her phone. As far as her phone knows, it failed.",
      active: [],
      ticks: 0,
      arjunOnline: true,
      tone: "bad",
    },
    {
      title: "Retry, recognised",
      text: "On reconnect her phone resends m-8f3a. The chat service has seen that ID in this conversation, so it returns the existing #42 instead of storing a duplicate.",
      active: ["priya-g1", "g1-chat"],
      ticks: 1,
      arjunOnline: true,
      tone: "good",
    },
  ];
}
