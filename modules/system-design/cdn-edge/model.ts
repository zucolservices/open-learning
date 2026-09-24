/** Geography and caching models for the CDN module. Illustrative. */

export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export const USERS: City[] = [
  { id: "del", name: "Delhi", lat: 28.6, lon: 77.2 },
  { id: "che", name: "Chennai", lat: 13.1, lon: 80.3 },
  { id: "sin", name: "Singapore", lat: 1.35, lon: 103.8 },
  { id: "syd", name: "Sydney", lat: -33.9, lon: 151.2 },
  { id: "lon", name: "London", lat: 51.5, lon: -0.1 },
  { id: "nyc", name: "New York", lat: 40.7, lon: -74 },
  { id: "sao", name: "São Paulo", lat: -23.5, lon: -46.6 },
  { id: "jnb", name: "Johannesburg", lat: -26.2, lon: 28 },
];

export const ORIGIN: City = { id: "bom", name: "Mumbai (origin)", lat: 19.1, lon: 72.9 };

function km(a: City, b: City) {
  const r = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

/**
 * Round trip in ms: light in fibre ≈ 200 km/ms, real routes ≈ 1.5× the straight line,
 * plus ~2 ms of equipment and last-mile time. An edge in the user's own city ≈ 5 ms.
 */
export function rttMs(a: City, b: City) {
  return Math.round(((km(a, b) * 1.5) / 200) * 2 + 2);
}

export const EDGE_RTT_MS = 5;
/** A fresh HTTPS page fetch needs about three round trips (TCP, TLS, request). */
export const ROUND_TRIPS = 3;

/** Equirectangular projection onto a 360 × 180 box. */
export const project = (c: City) => ({ x: c.lon + 180, y: 90 - c.lat });

/* Cache hit model ----------------------------------------------------------------------------- */

/**
 * Each object's requests follow Zipf popularity (s = 1). A TTL cache holds an object for T seconds
 * after a miss; for an object requested at rate λ, hit ratio = λT / (1 + λT).
 */
export function cacheModel({
  objects,
  reqPerSecPerEdge,
  edges,
  ttlS,
  variants,
  shield,
}: {
  objects: number;
  reqPerSecPerEdge: number;
  edges: number;
  ttlS: number;
  variants: number; // cache-key fragmentation: each object split into this many keys
  shield: boolean;
}) {
  let h = 0;
  for (let i = 1; i <= objects; i++) h += 1 / i;
  let edgeMisses = 0; // per second, all edges
  let originReqs = 0;
  for (let i = 1; i <= objects; i++) {
    const share = 1 / i / h;
    const lamKey = (reqPerSecPerEdge * share) / variants; // per edge, per cache key
    const missPerKey = lamKey / (1 + lamKey * ttlS);
    const missesThisObj = missPerKey * variants * edges;
    edgeMisses += missesThisObj;
    if (shield) {
      // One shield in front of the origin sees every edge's misses for this key.
      const lamShield = missPerKey * edges;
      originReqs += (lamShield / (1 + lamShield * ttlS)) * variants;
    } else originReqs += missesThisObj;
  }
  const total = reqPerSecPerEdge * edges;
  return { hitRatio: 1 - edgeMisses / total, originReqs, total };
}
