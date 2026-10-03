/** Capstone: design a parcel-tracking API, then live with it for a year (illustrative). */

export type Verdict = "good" | "warn" | "bad";
export type Level = "holds" | "degrades" | "breaks";

export const DECISIONS: {
  id: string;
  area: string;
  module: number;
  options: { id: string; label: string; verdict: Verdict; note: string }[];
}[] = [
  {
    id: "urls",
    area: "Resources",
    module: 4,
    options: [
      {
        id: "verbs",
        label: "POST /getParcelStatus, POST /createNewShipment",
        verdict: "bad",
        note: "Every endpoint is a surprise.",
      },
      {
        id: "nouns",
        label: "GET /parcels/{id}, GET /parcels/{id}/events, POST /shipments",
        verdict: "good",
        note: "Guessable, cacheable, consistent.",
      },
    ],
  },
  {
    id: "payload",
    area: "Data formats",
    module: 6,
    options: [
      {
        id: "loose",
        label: "Numeric IDs, amounts as rupees with decimals, dates as text",
        verdict: "bad",
        note: "Rounding, precision and date traps.",
      },
      {
        id: "strict",
        label: "String IDs, amounts in paise with a currency, RFC 3339 times",
        verdict: "good",
        note: "Every client reads them the same way.",
      },
    ],
  },
  {
    id: "paging",
    area: "Lists",
    module: 7,
    options: [
      {
        id: "all",
        label: "Return every item",
        verdict: "bad",
        note: "Fine until a list has 50,000 entries.",
      },
      {
        id: "offset",
        label: "?page=N",
        verdict: "warn",
        note: "Works, but drifts as new parcels arrive.",
      },
      {
        id: "cursor",
        label: "Opaque cursors and a page_size limit",
        verdict: "good",
        note: "Stable and fast at any depth.",
      },
    ],
  },
  {
    id: "idem",
    area: "Creating shipments",
    module: 8,
    options: [
      {
        id: "none",
        label: "POST /shipments, nothing more",
        verdict: "bad",
        note: "A retry books a second pickup.",
      },
      {
        id: "key",
        label: "Idempotency-Key required on POST /shipments",
        verdict: "good",
        note: "Retries replay the first result.",
      },
    ],
  },
  {
    id: "change",
    area: "Change",
    module: 10,
    options: [
      {
        id: "inplace",
        label: "Edit the API in place as needed",
        verdict: "bad",
        note: "Fast for you, painful for partners.",
      },
      {
        id: "versioned",
        label: "Additive changes; versions for breaking ones; Deprecation and Sunset headers",
        verdict: "good",
        note: "Partners move at their own pace.",
      },
    ],
  },
  {
    id: "notify",
    area: "Status updates",
    module: 14,
    options: [
      {
        id: "poll",
        label: "Partners poll GET /parcels/{id} every 10 seconds",
        verdict: "warn",
        note: "Simple, wasteful and late.",
      },
      {
        id: "hooks",
        label: "Signed webhooks with event IDs and retries",
        verdict: "good",
        note: "Partners hear immediately, and can trust what they hear.",
      },
    ],
  },
  {
    id: "auth",
    area: "Who may see what",
    module: 17,
    options: [
      {
        id: "shared",
        label: "One API key shared by all partners; any parcel readable by number",
        verdict: "bad",
        note: "Anyone with the key sees everyone's parcels.",
      },
      {
        id: "scoped",
        label: "A key per partner, OAuth for customer apps, ownership checked on every parcel",
        verdict: "good",
        note: "Each caller sees only their own.",
      },
    ],
  },
  {
    id: "limits",
    area: "Limits",
    module: 18,
    options: [
      {
        id: "none",
        label: "No limits",
        verdict: "bad",
        note: "One partner's script can slow everyone.",
      },
      {
        id: "perkey",
        label: "Per-partner rate limits; 429 with Retry-After",
        verdict: "good",
        note: "Fair shares, clear signals.",
      },
    ],
  },
  {
    id: "docs",
    area: "Contract and docs",
    module: 9,
    options: [
      {
        id: "wiki",
        label: "A wiki page, updated when someone remembers",
        verdict: "bad",
        note: "Drifts from reality within weeks.",
      },
      {
        id: "oas",
        label: "OpenAPI file in the repo, linted in CI, docs and sandbox generated from it",
        verdict: "good",
        note: "Always matches the real API.",
      },
    ],
  },
];

export const INCIDENTS: { id: string; name: string; text: string }[] = [
  {
    id: "rename",
    name: "The rename",
    text: "Product wants status renamed to delivery_state. Forty partners use the API.",
  },
  {
    id: "retry",
    name: "A retry storm",
    text: "A large marketplace's network flickers during the festive sale; its client retries every failed POST /shipments.",
  },
  {
    id: "scrape",
    name: "The nightly sync",
    text: "A partner's script downloads all its parcels every night: 2 million and growing.",
  },
  {
    id: "curious",
    name: "A curious customer",
    text: "A customer notices parcel numbers are sequential and tries the next one.",
  },
  {
    id: "updates",
    name: "Fifty partners want updates",
    text: "Every partner wants to know within a minute when a parcel is delivered.",
  },
  {
    id: "money",
    name: "Cash-on-delivery totals",
    text: "Finance reconciles a month of cash-on-delivery amounts reported through the API.",
  },
  {
    id: "newpartner",
    name: "A new partner",
    text: "A start-up wants to integrate in a week, with one developer.",
  },
  {
    id: "retire",
    name: "Retiring v1",
    text: "v1 has to be switched off next year to remove an old security weakness.",
  },
  {
    id: "history",
    name: "The long journey",
    text: "An international parcel collects 400 scan events. The partner's app shows its history.",
  },
];

export interface Outcome {
  level: Level;
  text: string;
  module: number;
}

type C = Record<string, string | undefined>;

export function outcome(id: string, c: C): Outcome | null {
  switch (id) {
    case "rename":
      if (!c.change) return null;
      if (c.change === "inplace")
        return {
          level: "breaks",
          text: "Renamed on a Tuesday. Partners' screens show blank statuses until each one ships a fix; some take weeks.",
          module: 10,
        };
      return {
        level: "holds",
        text: "delivery_state is added alongside status, which is marked deprecated with a removal date in the next major version. Nobody breaks.",
        module: 10,
      };
    case "retry":
      if (!c.idem) return null;
      if (c.idem === "none")
        return {
          level: "breaks",
          text: "Hundreds of duplicate pickups are booked. Couriers arrive twice; the partner is billed twice.",
          module: 8,
        };
      return {
        level: "holds",
        text: "Each retry carries the same key; the API replays the first result. One pickup per parcel.",
        module: 8,
      };
    case "scrape":
      if (!c.paging || !c.limits) return null;
      if (c.paging === "all" || c.limits === "none")
        return {
          level: "breaks",
          text:
            c.paging === "all"
              ? "One request asks for 2 million parcels. The database slows for every partner until it times out."
              : "The script hammers the API as fast as it can; other partners' requests queue behind it.",
          module: c.paging === "all" ? 7 : 18,
        };
      if (c.paging === "offset")
        return {
          level: "degrades",
          text: "Deep pages get slower and parcels created mid-sync shift pages, so some are missed.",
          module: 7,
        };
      return {
        level: "holds",
        text: "Cursor pages at a capped size, within the partner's rate limit. The sync is slow and steady and nobody else notices.",
        module: 7,
      };
    case "curious":
      if (!c.auth) return null;
      if (c.auth === "shared")
        return {
          level: "breaks",
          text: "The next number shows a stranger's name and address. In 2018 a Google+ API bug similarly exposed profile fields that weren't public, for up to 500,000 accounts.",
          module: 17,
        };
      return {
        level: "holds",
        text: "404: that parcel isn't theirs. The ownership check runs on every request, whatever the ID.",
        module: 17,
      };
    case "updates":
      if (!c.notify) return null;
      if (c.notify === "poll")
        return {
          level: "degrades",
          text: "Fifty partners polling every 10 seconds for millions of parcels: most requests find nothing, and updates still arrive up to 10 s late.",
          module: 15,
        };
      return {
        level: "holds",
        text: "One signed webhook per event, retried until acknowledged. Partners deduplicate by event ID.",
        module: 14,
      };
    case "money":
      if (!c.payload) return null;
      if (c.payload === "loose")
        return {
          level: "breaks",
          text: "Decimal rupee amounts summed as floating-point numbers drift by paise; thousands of lines don't reconcile, and some IDs have been rounded in JavaScript.",
          module: 6,
        };
      return {
        level: "holds",
        text: "Whole paise and string IDs: every total matches to the paisa.",
        module: 6,
      };
    case "newpartner":
      if (!c.docs || !c.urls) return null;
      if (c.docs === "wiki" || c.urls === "verbs")
        return {
          level: "degrades",
          text:
            c.docs === "wiki"
              ? "The wiki describes last year's API. The developer spends days on support calls."
              : "Every endpoint has its own naming. The integration takes three weeks, not one.",
          module: c.docs === "wiki" ? 9 : 4,
        };
      return {
        level: "holds",
        text: "Generated docs, a sandbox and guessable URLs: first successful call in under an hour, live in four days.",
        module: 20,
      };
    case "retire":
      if (!c.change) return null;
      if (c.change === "inplace")
        return {
          level: "breaks",
          text: "There's no v2 to move to and no warning in place. Partners learn on the day it stops. Reddit announced paid API access in April 2023; by 30 June the Apollo app had shut down.",
          module: 11,
        };
      return {
        level: "holds",
        text: "Deprecation and Sunset headers for a year, usage tracked per key, two brownouts, then 410 Gone. Every active partner had moved.",
        module: 11,
      };
    case "history":
      if (!c.paging) return null;
      if (c.paging === "all")
        return {
          level: "degrades",
          text: "400 events in one response: slow on mobile networks, and the app freezes rendering them all.",
          module: 7,
        };
      return {
        level: "holds",
        text: "The app loads the latest 20 events and fetches more as the user scrolls.",
        module: 7,
      };
  }
  return null;
}
