/** Five pieces of café-app data and the five places a phone can keep them. */

export type Store = "kv" | "db" | "files" | "cache" | "secure";

export const STORES: { id: Store; label: string; ios: string; android: string; note: string }[] = [
  {
    id: "kv",
    label: "Settings",
    ios: "UserDefaults",
    android: "DataStore",
    note: "Small, simple values. Stored unencrypted on disk.",
  },
  {
    id: "db",
    label: "Database",
    ios: "SwiftData, Core Data",
    android: "Room (SQLite)",
    note: "Many structured records you search, sort and update.",
  },
  {
    id: "files",
    label: "Files",
    ios: "Documents folder",
    android: "App files folder",
    note: "Large things the user made. Included in backups.",
  },
  {
    id: "cache",
    label: "Cache",
    ios: "Caches folder",
    android: "Cache folder",
    note: "Can be re-downloaded. The system may clear it; not backed up.",
  },
  {
    id: "secure",
    label: "Secure store",
    ios: "Keychain",
    android: "Keystore-protected keys",
    note: "Small secrets, encrypted with keys the app can't export.",
  },
];

export interface Data {
  id: string;
  label: string;
  answer: Store;
  why: string;
  wrong?: Partial<Record<Store, string>>;
}

export const DATA: Data[] = [
  {
    id: "dark",
    label: "The dark mode setting",
    answer: "kv",
    why: "One small, non-sensitive value: exactly what settings storage is for.",
    wrong: { db: "Works, but a whole database for one switch is overkill." },
  },
  {
    id: "menu",
    label: "The full menu: 200 dishes to search and filter offline",
    answer: "db",
    why: "Many structured records you query: a local database, and the app's source of truth offline.",
    wrong: {
      kv: "Settings storage loads everything at once and can't search. It's for a handful of values.",
    },
  },
  {
    id: "photos",
    label: "Photos the customer took for their reviews",
    answer: "files",
    why: "Large and irreplaceable: keep them in the app's files, which are backed up.",
    wrong: {
      cache:
        "The system may delete the cache when space runs low, and it isn't backed up. These photos can't be re-downloaded.",
    },
  },
  {
    id: "images",
    label: "Dish pictures downloaded from the server",
    answer: "cache",
    why: "They can always be downloaded again, so the cache is right: no backup space wasted.",
    wrong: { files: "They'd fill the user's backup with things the server already has." },
  },
  {
    id: "token",
    label: "The sign-in token",
    answer: "secure",
    why: "A secret: the Keychain, or data encrypted with an Android Keystore key.",
    wrong: {
      kv: "Settings storage is unencrypted on disk, and may be copied into backups. Anyone with the file has the account.",
      db: "An ordinary database file isn't encrypted. Secrets belong in the secure store.",
    },
  },
];

export function feedback(d: Data, s: Store) {
  if (s === d.answer) return d.why;
  return d.wrong?.[s] ?? `Not ideal. ${STORES.find((x) => x.id === s)!.note}`;
}
