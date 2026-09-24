# Design real-time chat: storyboard

1. **Are we there yet?** ⭐ Back-seat analogy. Polling / long polling / server-sent events / WebSocket over one minute with six incoming messages (`transport.ts`): request bars, delivery lines, requests per minute, average delay, two-way or not.
2. **One message, end to end** ⭐ (step-through, `frames.ts`). Priya → gateway G1 → chat service (sequence #42, stored before "sent" tick) → session registry → gateway G7 → Arjun; ticks sent / delivered / read. Scenarios: both online; Arjun offline (push notification nudge, catch up "after #41"); Priya's signal drops (retry with client message ID, deduplicated).
3. **Who spoke first?** (choice): per-conversation sequence numbers, not phone clocks (Lamport 1978).
4. **Millions of open connections**: users online × connections per gateway → gateway count (+30%); a gateway restart's reconnect storm with and without 0–30 s jitter.
5. **How others do it**: protocols, managed services, WhatsApp, Discord, Slack.
6. **What to remember**.
