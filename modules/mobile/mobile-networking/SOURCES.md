# Sources: Networking on flaky connections (fact-checked 2026-10-12)

- URLSessionConfiguration: timeoutIntervalForRequest default 60 s (idle, reset as data arrives); allowsConstrainedNetworkAccess (Low Data Mode, iOS 13); waitsForConnectivity; URLCache.
- OkHttp: connect/read/write timeouts default 10 s, callTimeout 0; no HTTP/3.
- Android Data Saver (Android 7); Cronet and HttpEngine (API 34) support HTTP/3.
- ATS (iOS 9 SDK); Android cleartext disabled by default from API 28; Android 17 Certificate Transparency default.
- HTTP/3 in URLSession from iOS 15 (WWDC21).

Network timings and sizes in the simulation are illustrative. Notes: scratchpad `sd/mobile/m09-facts.md`.
