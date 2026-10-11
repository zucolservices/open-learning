# Sources: JavaScript and the event loop (fact-checked 2026-10-11)

- WHATWG HTML, event loops and processing model (one or more task queues; microtask checkpoint after each task; rendering opportunities, 60 Hz example ≈16.7 ms).
- web.dev, "Optimize long tasks" (>50 ms = long task; yielding). MDN Scheduler.yield (Chrome/Edge 129, Firefox 142; not Safari).
- MDN Web Workers, requestAnimationFrame.

Timings in the long-task demo are illustrative. Notes: scratchpad `sd/frontend/m04-facts.md`.
