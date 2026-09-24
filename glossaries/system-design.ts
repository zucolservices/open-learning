import type { GlossaryEntry } from "./types";

/** System Design at Scale track glossary. `module` slugs refer to this track. */
export const systemDesign = {
  scalability: {
    term: "Scalability",
    definition:
      "A system's ability to handle more load (users, requests, data) by adding resources, without being redesigned.",
    analogy: "A restaurant that can open more tables and hire more cooks when the queue grows.",
    module: "what-scale-means",
  },
  latency: {
    term: "Latency",
    definition: "How long one request takes, from asking to getting the answer.",
    analogy: "How long you wait at the counter for your coffee.",
    module: "latency-throughput",
  },
  throughput: {
    term: "Throughput",
    definition: "How much work a system completes per unit of time, such as requests per second.",
    analogy: "How many coffees the counter serves per hour.",
    module: "latency-throughput",
  },
  "vertical-scaling": {
    term: "Scaling up (vertical scaling)",
    definition: "Handling more load by moving to a bigger machine: more CPU, memory or disk.",
    analogy: "Replacing your car with a bus.",
    module: "what-scale-means",
  },
  "horizontal-scaling": {
    term: "Scaling out (horizontal scaling)",
    definition: "Handling more load by adding more machines that share the work.",
    analogy: "Adding more cars instead of buying a bigger one.",
    module: "what-scale-means",
  },
  "load-balancer": {
    term: "Load balancer",
    definition:
      "A component that receives requests at one address and spreads them across many servers.",
    analogy: "A host at a restaurant door showing each guest to a free table.",
    module: "load-balancing",
  },
  cache: {
    term: "Cache",
    definition:
      "A fast store of recently or frequently used answers, so they don't have to be fetched or computed again.",
    analogy: "Keeping today's most-ordered dishes ready on the pass.",
    module: "caching-patterns",
  },
  replica: {
    term: "Replica",
    definition:
      "A copy of a database kept up to date from the original, used to share reads or to take over if the original fails.",
    module: "replication",
  },
  cdn: {
    term: "CDN",
    definition:
      "Content delivery network: servers around the world that keep copies of files close to users, so they download faster.",
    analogy: "Stocking popular books in every neighbourhood library instead of one central one.",
    module: "cdn-edge",
  },
  queue: {
    term: "Queue",
    definition:
      "A buffer where one part of a system leaves work for another to pick up later, so neither has to wait for the other.",
    analogy: "The ticket rail in a kitchen: waiters clip orders on, cooks take them when ready.",
    module: "queues-streams",
  },
  shard: {
    term: "Shard",
    definition:
      "One piece of a dataset that has been split across several machines; each shard holds part of the data.",
    analogy: "Splitting a phone book into A–H, I–P and Q–Z volumes.",
    module: "sharding",
  },
  utilisation: {
    term: "Utilisation",
    definition:
      "The share of time a resource (a server, CPU, disk, barista) is busy. Waiting time rises steeply as it nears 100%.",
    module: "latency-throughput",
  },
  percentile: {
    term: "Percentile (p50, p99)",
    definition:
      "The value below which a given share of measurements fall. p99 latency = 99% of requests were faster than this.",
    analogy: "If you're in the 90th percentile for height, 90% of people are shorter than you.",
    module: "latency-throughput",
  },
  "tail-latency": {
    term: "Tail latency",
    definition:
      "The latency of the slowest requests (p99, p99.9). Small in number, but they're what users notice.",
    module: "latency-throughput",
  },
  "fan-out": {
    term: "Fan-out",
    definition:
      "Handling one request by sending sub-requests to many servers and combining their answers. The whole request waits for the slowest.",
    module: "latency-throughput",
  },
  "littles-law": {
    term: "Little's Law",
    definition:
      "In any stable system, the average number of items inside equals the arrival rate times the average time each spends inside: L = λ × W.",
    analogy: "One customer a minute, each staying five minutes: five people in the café.",
    module: "latency-throughput",
  },
  "back-of-envelope": {
    term: "Back-of-the-envelope estimate",
    definition:
      "A quick, rough calculation (users, requests per second, storage, bandwidth) to find the right order of magnitude before designing.",
    analogy:
      "Estimating how many cups of tea your office drinks a year from how many people work there.",
    module: "estimation",
  },
  qps: {
    term: "QPS / requests per second",
    definition:
      "Queries (or requests) per second: the basic measure of how much load a system handles.",
    module: "estimation",
  },
  "health-check": {
    term: "Health check",
    definition:
      "A regular test a load balancer runs against each server (such as requesting /health) to decide whether to keep sending it traffic.",
    module: "load-balancing",
  },
  "single-point-of-failure": {
    term: "Single point of failure",
    definition: "One component whose failure takes the whole system down.",
    analogy: "The only bridge into town.",
    module: "load-balancing",
  },
  "sticky-session": {
    term: "Sticky session",
    definition:
      "Sending all of a user's requests to the same server, usually because that server holds their session state.",
    module: "load-balancing",
  },
  stateless: {
    term: "Stateless server",
    definition:
      "A server that keeps nothing a user needs between requests, so any server can handle any request. State lives in a shared store or with the client.",
    analogy: "Any supermarket checkout can serve any shopper.",
    module: "autoscaling",
  },
  autoscaling: {
    term: "Autoscaling",
    definition:
      "Automatically adding servers when load rises and removing them when it falls, based on a metric such as CPU or queue length.",
    module: "autoscaling",
  },
  "edge-location": {
    term: "Edge location (PoP)",
    definition:
      "A CDN's servers in a particular city (a point of presence) that serve cached content to nearby users.",
    module: "cdn-edge",
  },
  "hit-ratio": {
    term: "Hit ratio",
    definition: "The share of requests a cache answers itself, without going back to the origin.",
    module: "cdn-edge",
  },
  ttl: {
    term: "TTL (time to live)",
    definition:
      "How long a cached copy may be used before it must be checked or fetched again, e.g. Cache-Control: max-age=3600.",
    module: "cdn-edge",
  },
  "cache-aside": {
    term: "Cache-aside (lazy loading)",
    definition:
      "The app checks the cache first; on a miss it reads the database and stores the result in the cache. On a write it updates the database and deletes the cached copy.",
    module: "caching-patterns",
  },
  lease: {
    term: "Lease (cache)",
    definition:
      "A token a cache hands to a client that missed, allowing it to fill that key. A delete cancels the token, so a slow client can't write back stale data; it also limits refills during a stampede.",
    module: "caching-patterns",
  },
  eviction: {
    term: "Eviction policy",
    definition:
      "The rule a full cache uses to decide what to remove, such as least recently used (LRU) or least frequently used (LFU).",
    analogy: "Deciding what to throw out of a full fridge.",
    module: "cache-eviction",
  },
  stampede: {
    term: "Cache stampede (thundering herd)",
    definition:
      "When a popular cached item expires and many requests miss at once, all hitting the database for the same data.",
    module: "cache-eviction",
  },
  jitter: {
    term: "Jitter",
    definition:
      "A small random variation added to timers (TTLs, retry delays) so that many clients don't all act at the same moment.",
    module: "cache-eviction",
  },
  "hot-key": {
    term: "Hot key",
    definition:
      "A single key so popular that the one node storing it becomes overloaded while others sit idle.",
    module: "cache-eviction",
  },
  "leader-follower": {
    term: "Leader and followers",
    definition:
      "A replication set-up where one node (the leader, or primary) accepts writes and the others (followers, or replicas) copy its changes.",
    module: "replication",
  },
  "replication-lag": {
    term: "Replication lag",
    definition:
      "How far a replica is behind the leader: changes made on the leader that the replica hasn't applied yet.",
    module: "replication",
  },
  failover: {
    term: "Failover",
    definition:
      "Switching to a standby (such as promoting a replica to leader) when the active node fails.",
    module: "replication",
  },
  "split-brain": {
    term: "Split brain",
    definition:
      "When two nodes both believe they are the leader and accept conflicting writes, usually after a network split or a botched failover.",
    module: "replication",
  },
  "consistent-hashing": {
    term: "Consistent hashing",
    definition:
      "Placing servers and keys on a ring of hash values, with each key owned by the next server around the ring, so adding or removing a server moves only a small share of keys.",
    module: "sharding",
  },
  "polyglot-persistence": {
    term: "Polyglot persistence",
    definition: "Using several kinds of database in one system, each for the data it suits best.",
    module: "choosing-a-database",
  },
  cap: {
    term: "CAP theorem",
    definition:
      "During a network partition, a distributed system can't be both perfectly consistent (linearizable) and available at every working node: it must choose.",
    module: "consistency",
  },
  "partition-network": {
    term: "Network partition",
    definition:
      "A failure where parts of a system are running but can't communicate with each other.",
    analogy: "Two bank branches whose phone line has gone dead.",
    module: "consistency",
  },
  "consistency-model": {
    term: "Consistency model",
    definition:
      "The rules for what a read may return after writes, from linearizable (always the latest) to eventual (copies agree once writes stop).",
    module: "consistency",
  },
  quorum: {
    term: "Quorum",
    definition:
      "The number of copies that must respond for a write (W) or read (R) to succeed. If R + W > N, reads overlap the latest successful write.",
    module: "consistency",
  },
  "two-phase-commit": {
    term: "Two-phase commit (2PC)",
    definition:
      "A protocol where a coordinator first asks every participant to prepare, then tells all of them to commit (or abort). If the coordinator fails after prepare, participants wait holding locks.",
    module: "distributed-transactions",
  },
  saga: {
    term: "Saga",
    definition:
      "A long business transaction split into local steps, each committed on its own, with a compensating action to undo each step's effect if a later step fails.",
    analogy:
      "Booking a flight, hotel and car separately, and cancelling the ones you booked if one falls through.",
    module: "distributed-transactions",
  },
  "dual-write": {
    term: "Dual write",
    definition:
      "Writing to two systems (such as a database and a message broker) without a shared transaction, so a crash in between leaves them inconsistent.",
    module: "distributed-transactions",
  },
  outbox: {
    term: "Transactional outbox",
    definition:
      "Saving an outgoing event in an 'outbox' table in the same database transaction as the business change; a separate relay publishes it afterwards.",
    module: "distributed-transactions",
  },
  "event-log": {
    term: "Event log (stream)",
    definition:
      "An append-only sequence of messages kept for a set time. Readers track their own position, many readers can each read everything, and old messages can be replayed. Kafka, Kinesis and Event Hubs work this way.",
    analogy:
      "A till-receipt roll that the kitchen, bar and accounts desk each read at their own pace.",
    module: "queues-streams",
  },
  offset: {
    term: "Offset",
    definition:
      "A reader's position in a log partition: the number of the next message it will read. Moving it back replays messages.",
    module: "queues-streams",
  },
  "consumer-group": {
    term: "Consumer group",
    definition:
      "A set of consumers sharing the work of reading a log. Each partition is read by one member of the group; every group gets all the messages.",
    module: "queues-streams",
  },
  "dead-letter-queue": {
    term: "Dead-letter queue (DLQ)",
    definition:
      "A separate queue where messages that keep failing are moved, so they stop blocking or wasting consumers and can be inspected and replayed later.",
    module: "queues-streams",
  },
  backpressure: {
    term: "Backpressure",
    definition:
      "Signalling upstream to slow down when a component can't keep up, instead of letting work pile up without limit.",
    analogy: "A kitchen telling the host to stop seating tables for a few minutes.",
    module: "queues-streams",
  },
  "retry-storm": {
    term: "Retry storm",
    definition:
      "When many clients retry failed requests at once, multiplying the load on a service that is already struggling, which can keep it down after the original problem has passed.",
    module: "retries-idempotency",
  },
  "exponential-backoff": {
    term: "Exponential backoff",
    definition:
      "Waiting longer after each failed attempt, typically doubling the wait each time, up to a cap. Usually combined with jitter.",
    module: "retries-idempotency",
  },
  "retry-budget": {
    term: "Retry budget",
    definition:
      "A limit on retries as a share of normal requests (for example 10%), so that retries help with occasional errors but can't multiply load during an outage.",
    module: "retries-idempotency",
  },
  "idempotency-key": {
    term: "Idempotency key",
    definition:
      "A unique ID the client sends with a request and reuses on every retry. The server stores its answer per key and returns the same answer for repeats instead of doing the work again.",
    analogy: "Writing the invoice number on a cheque, so the biller can spot a duplicate.",
    module: "retries-idempotency",
  },
  event: {
    term: "Event",
    definition:
      "A message saying that something happened (named in the past tense, such as OrderPlaced). The sender doesn't know or care who reacts. Contrast with a command, which asks one service to do something.",
    module: "event-driven",
  },
  "pub-sub": {
    term: "Publish/subscribe (pub/sub)",
    definition:
      "A messaging style where producers publish messages to a topic and every subscriber to that topic gets a copy, without producers knowing who the subscribers are.",
    analogy: "Posting in a group chat instead of phoning each person.",
    module: "event-driven",
  },
  "event-sourcing": {
    term: "Event sourcing",
    definition:
      "Storing every change as an event and treating that sequence as the source of truth. Current state is computed by replaying the events.",
    analogy: "A bank statement: the balance is the sum of every transaction.",
    module: "event-driven",
  },
  cqrs: {
    term: "CQRS",
    definition:
      "Command Query Responsibility Segregation: using one model for writes and separate, purpose-built models for reads, usually kept in step by events.",
    module: "event-driven",
  },
  "schema-registry": {
    term: "Schema registry",
    definition:
      "A service that stores the versions of each message schema and rejects new versions that would break existing producers or consumers.",
    module: "event-driven",
  },
  availability: {
    term: "Availability",
    definition:
      "The share of time a system is working and usable, often written as a number of nines: 99.9% (three nines) allows about 44 minutes of downtime a month.",
    module: "availability",
  },
  "availability-zone": {
    term: "Availability zone",
    definition:
      "One or more data centres within a cloud region, with separate power, cooling and networking, close enough to others for fast links. Spreading copies across zones survives a building-level failure.",
    module: "availability",
  },
  sla: {
    term: "SLA (service level agreement)",
    definition:
      "A contract stating the availability a provider promises and what it pays back (usually service credits) if it misses. It is compensation, not a guarantee.",
    module: "availability",
  },
  "cascading-failure": {
    term: "Cascading failure",
    definition:
      "A failure that spreads: one slow or broken component ties up the resources of everything calling it, until those callers fail too.",
    analogy:
      "Every call-centre agent stuck on hold with one slow department, so nobody answers new calls.",
    module: "resilience-patterns",
  },
  "circuit-breaker": {
    term: "Circuit breaker",
    definition:
      "A wrapper around calls to a dependency that stops calling it for a while after too many failures (failing fast instead), then lets a trial call through to see if it has recovered.",
    module: "resilience-patterns",
  },
  bulkhead: {
    term: "Bulkhead",
    definition:
      "Giving each dependency its own limited pool of threads or connections, so one misbehaving dependency can't use up resources everyone else needs. Named after a ship's watertight compartments.",
    module: "resilience-patterns",
  },
  "rate-limit": {
    term: "Rate limit",
    definition:
      "A cap on how many requests a client may make in a period. Requests over the limit are rejected (HTTP 429) or delayed.",
    module: "resilience-patterns",
  },
  timeout: {
    term: "Timeout",
    definition:
      "The longest a caller will wait for a response before giving up and treating the call as failed. Without one, a hung dependency can hold the caller's resources indefinitely.",
    module: "resilience-patterns",
  },
  "disaster-recovery": {
    term: "Disaster recovery (DR)",
    definition:
      "Plans and systems for restoring service after a large failure, such as losing a whole data centre or cloud region, usually by recovering in another region.",
    module: "multi-region-dr",
  },
  rpo: {
    term: "RPO (recovery point objective)",
    definition:
      "The most data you can afford to lose in a disaster, measured as time: an RPO of 5 minutes means losing at most the last 5 minutes of changes.",
    module: "multi-region-dr",
  },
  rto: {
    term: "RTO (recovery time objective)",
    definition:
      "The longest you can afford to be down after a disaster before service is restored.",
    module: "multi-region-dr",
  },
  "data-residency": {
    term: "Data residency",
    definition:
      "Rules (legal or contractual) about which countries or regions data may be stored or processed in, including backups and replicas.",
    module: "multi-region-dr",
  },
  observability: {
    term: "Observability",
    definition:
      "How well you can understand what a running system is doing, and why, from the data it emits: mainly metrics, logs and traces.",
    module: "observability",
  },
  metric: {
    term: "Metric",
    definition:
      "A number measured over time, such as requests per second or 99th-percentile latency. Cheap to store and ideal for dashboards and alerts.",
    analogy: "A car's speedometer and fuel gauge.",
    module: "observability",
  },
  log: {
    term: "Log",
    definition:
      "A timestamped record of an individual event, such as 'order 7731 failed: card declined'. Detailed, but costly to store and search at scale.",
    module: "observability",
  },
  trace: {
    term: "Trace",
    definition:
      "The record of one request's journey through a system, made of spans (timed pieces of work) linked by a shared trace ID.",
    analogy: "A parcel's tracking history, with every stop and its time.",
    module: "observability",
  },
  sli: {
    term: "SLI (service level indicator)",
    definition:
      "A measurement of service quality as users experience it, such as the share of requests that succeed or finish within 300 ms.",
    module: "observability",
  },
  slo: {
    term: "SLO (service level objective)",
    definition:
      "A target for an SLI over a period, such as '99.9% of checkout requests succeed over 30 days'. Chosen by the team; stricter than any SLA.",
    module: "observability",
  },
  "error-budget": {
    term: "Error budget",
    definition:
      "The amount of unreliability an SLO allows (for 99.9%, 0.1% of requests). Teams spend it on releases and experiments, and slow down when it runs out.",
    module: "observability",
  },
  base62: {
    term: "Base62",
    definition:
      "Writing numbers with 62 symbols (0–9, a–z, A–Z), common for short IDs. Seven characters give about 3.5 trillion combinations.",
    module: "url-shortener",
  },
  "birthday-paradox": {
    term: "Birthday paradox",
    definition:
      "Random values collide much sooner than intuition suggests: among n random keys from N possibilities, a clash becomes likely once n is around the square root of N.",
    analogy: "In a room of 23 people, it's more likely than not that two share a birthday.",
    module: "url-shortener",
  },
  "cursor-pagination": {
    term: "Cursor pagination",
    definition:
      "Fetching the next page relative to the last item seen ('20 posts older than post X') instead of by position ('skip 40'), so pages stay correct when items are added or removed.",
    module: "news-feed",
  },
  websocket: {
    term: "WebSocket",
    definition:
      "A protocol that keeps one connection open between a client and a server so either side can send messages at any time, without new requests.",
    analogy: "An open phone line, instead of sending a letter every time.",
    module: "realtime-chat",
  },
  "long-polling": {
    term: "Long polling",
    definition:
      "The client makes a request that the server holds open until it has news (or a timeout passes); the client then immediately asks again.",
    module: "realtime-chat",
  },
  presence: {
    term: "Presence",
    definition:
      "Knowing which users are online right now, and which server each one is connected to, so messages and 'online' dots can reach them.",
    module: "realtime-chat",
  },
  "inventory-hold": {
    term: "Inventory hold",
    definition:
      "Reserving an item for one buyer while they finish checking out, released automatically if they don't pay within a time limit.",
    module: "flash-sale",
  },
  "waiting-room": {
    term: "Virtual waiting room",
    definition:
      "A lightweight holding page that queues visitors during a surge and lets them into the real site at a rate it can handle.",
    analogy: "A queue outside a shop that lets people in as others leave.",
    module: "flash-sale",
  },
  "lost-update": {
    term: "Lost update",
    definition:
      "When two operations read the same value, both change it, and the second write silently overwrites the first.",
    module: "flash-sale",
  },
} satisfies Record<string, GlossaryEntry>;
