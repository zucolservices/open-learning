/** Everyday phone situations and how a well-built app responds. The café app is made up. */

export const SITUATIONS: {
  id: string;
  text: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}[] = [
  {
    id: "thumb",
    text: "Asha is holding a coffee and using the app one-handed.",
    options: [
      {
        id: "top",
        label: "Main buttons at the top corners",
        ok: false,
        outcome: "Out of thumb reach; they have to put the coffee down.",
      },
      {
        id: "bottom",
        label: "Main actions near the bottom, large and easy to hit",
        ok: true,
        outcome: "Reachable with a thumb.",
      },
    ],
  },
  {
    id: "tunnel",
    text: "The train goes into a tunnel as they tap “Place order”.",
    options: [
      {
        id: "spin",
        label: "Spin forever, then show a blank error",
        ok: false,
        outcome: "They don't know whether the order went through.",
      },
      {
        id: "queue",
        label: "Save the order and send it when the signal returns, saying so clearly",
        ok: true,
        outcome: "They carry on; the order goes through a minute later.",
      },
    ],
  },
  {
    id: "call",
    text: "A phone call arrives halfway through choosing toppings.",
    options: [
      {
        id: "lose",
        label: "Start again from the menu when they come back",
        ok: false,
        outcome: "Their choices are gone; they give up.",
      },
      {
        id: "keep",
        label: "Save the half-finished order and restore it",
        ok: true,
        outcome: "They pick up exactly where they left off, even if the system closed the app.",
      },
    ],
  },
  {
    id: "battery",
    text: "Their battery is at 8% and Low Power Mode is on.",
    options: [
      {
        id: "poll",
        label: "Keep checking for updates every few seconds",
        ok: false,
        outcome: "The app drains what little battery is left.",
      },
      {
        id: "light",
        label: "Do less in the background and rely on push notifications",
        ok: true,
        outcome: "They still hear when the order is ready.",
      },
    ],
  },
];

export const NUMBERS: [string, string][] = [
  ["Share of web traffic from phones", "≈ 59% worldwide (StatCounter, Sep 2026)"],
  ["Phone operating systems worldwide", "Android ≈ 69%, iOS ≈ 31%"],
  ["Phone operating systems in India", "Android ≈ 94%, iOS ≈ 6%"],
  ["One-handed use", "49% of observed phone touches (Steven Hoober, 2013)"],
];
