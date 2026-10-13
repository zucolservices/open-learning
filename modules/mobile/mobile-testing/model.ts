/** Choosing five real devices for the café app's test lab. Device names are generic. */

export interface Device {
  id: string;
  label: string;
  platform: "android" | "ios";
  os: string;
  /** Android version number, for the share-of-users check. */
  api?: number;
  traits: ("oldest" | "newest" | "low-ram" | "large")[];
}

export const DEVICES: Device[] = [
  {
    id: "a-budget",
    label: "Budget Android phone, 3 GB RAM",
    platform: "android",
    os: "Android 11",
    api: 11,
    traits: ["low-ram"],
  },
  {
    id: "a-old",
    label: "Old Android phone, 2 GB RAM",
    platform: "android",
    os: "Android 10 (the app's minimum)",
    api: 10,
    traits: ["oldest", "low-ram"],
  },
  {
    id: "a-mid",
    label: "Mid-range Android phone",
    platform: "android",
    os: "Android 14",
    api: 14,
    traits: [],
  },
  {
    id: "a-flag",
    label: "Flagship Android phone",
    platform: "android",
    os: "Android 16",
    api: 16,
    traits: ["newest"],
  },
  {
    id: "a-fold",
    label: "Android foldable",
    platform: "android",
    os: "Android 15",
    api: 15,
    traits: ["large"],
  },
  {
    id: "a-tab",
    label: "Android tablet",
    platform: "android",
    os: "Android 13",
    api: 13,
    traits: ["large"],
  },
  {
    id: "i-old",
    label: "Small, older iPhone",
    platform: "ios",
    os: "Oldest iOS the app supports",
    traits: ["oldest", "low-ram"],
  },
  { id: "i-new", label: "Latest iPhone", platform: "ios", os: "iOS 27", traits: ["newest"] },
  {
    id: "i-pad",
    label: "iPad",
    platform: "ios",
    os: "iPadOS 26, resizable windows",
    traits: ["large"],
  },
];

export const BUDGET = 5;

/** Share of Android devices by version, Dec 2025 snapshot (rounded, %). */
export const SHARE: Record<number, number> = {
  16: 7.5,
  15: 19.3,
  14: 17.2,
  13: 13.9,
  12: 11.4,
  11: 13.7,
  10: 7.8,
};

export function coverage(ids: string[]) {
  const picked = DEVICES.filter((d) => ids.includes(d.id));
  const has = (p: Device["platform"], t: Device["traits"][number]) =>
    picked.some((d) => d.platform === p && d.traits.includes(t));
  const share = Math.round(
    [...new Set(picked.flatMap((d) => (d.api ? [d.api] : [])))].reduce<number>(
      (a, v) => a + (SHARE[v] ?? 0),
      0,
    ),
  );
  return {
    share,
    checks: [
      [
        "Both platforms",
        picked.some((d) => d.platform === "android") && picked.some((d) => d.platform === "ios"),
      ],
      ["The oldest supported Android", has("android", "oldest")],
      ["The oldest supported iOS", has("ios", "oldest")],
      ["A low-memory phone", picked.some((d) => d.traits.includes("low-ram"))],
      ["The newest OS on at least one platform", picked.some((d) => d.traits.includes("newest"))],
      ["A large screen (foldable or tablet)", picked.some((d) => d.traits.includes("large"))],
    ] as [string, boolean][],
  };
}
