# Sources: WebRTC, WebSockets and phones (fact-checked 2026-10-05)

- W3C, WebRTC: Real-Time Communication in Browsers, Recommendation (first Jan 2021; amended 13 Mar 2025).
- IETF RFC 8825 (overview, Jan 2021): RTP media, SRTP required; RFC 8835 (transports; UDP assumed, TURN over TCP/TLS fallback).
- RFC 8445 (ICE), RFC 8489 (STUN), RFC 8656 (TURN).
- W3C WebRTC Statistics: jitterBufferDelay.
- RFC 6455 (WebSocket, Dec 2011, over TCP); RFC 9000 (QUIC) on head-of-line blocking.
- RFC 6716 (Opus, Sep 2012): 6–510 kb/s, 2.5–60 ms frames. RFC 7874 (May 2016): WebRTC must implement Opus and G.711 PCMA/PCMU.
- ITU-T G.711; RFC 3551 (PCMU/PCMA, 8,000 Hz, 8 bits).
- RFC 3261 (SIP, Jun 2002).
- Twilio Media Streams WebSocket messages: always audio/x-mulaw, 8000 Hz, mono, base64.
- OpenAI Realtime WebRTC and WebSocket guides: WebRTC recommended for browser/mobile clients, WebSockets for server-to-server; Realtime SIP guide.

Packet-loss picture and delays are illustrative.
