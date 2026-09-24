# Sources (fact-checked 2026-09)

- RFC 6455 (WebSocket, Dec 2011); RFC 8441 (WebSockets over HTTP/2); RFC 9220 (over HTTP/3); WHATWG HTML Living Standard (server-sent events / EventSource). WebTransport: Chrome 97+, Firefox 114+, Safari 26.4+ (WebKit blog, Mar 2026); IETF draft-ietf-webtrans-http3 still a draft.
- WhatsApp blog, "1 million is so 2011" (Jan 2012): 2M+ connections per server, FreeBSD + Erlang. WhatsApp privacy policy: messages deleted once delivered; undelivered kept encrypted up to 30 days.
- Discord blog, "How Discord Stores Trillions of Messages" (2023; migration finished 2022): Cassandra → ScyllaDB. "How Discord Scaled Elixir to 5,000,000 Concurrent Users" (2017). Discord developer docs: Snowflake IDs.
- Slack Engineering, "Real-time Messaging" (Apr 2023): gateway, channel, admin and presence servers; consistent hashing; ~500 ms worldwide.
- L. Lamport, "Time, Clocks, and the Ordering of Events in a Distributed System", CACM 1978.
- AWS API Gateway WebSocket quotas: 2-hour maximum connection, 10-minute idle timeout.
- Connection counts and timings in the steps are illustrative.
