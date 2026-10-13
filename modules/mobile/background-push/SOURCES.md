# Sources: Background work and push notifications (fact-checked 2026-10-12)

- Android: WorkManager (periodic minimum 15 min); Doze and maintenance windows; App Standby buckets (restricted: once a day); FGS types (Android 14), 6 h/day for dataSync (Android 15); POST_NOTIFICATIONS (Android 13); Live Updates (Android 16).
- iOS: BGAppRefreshTask (up to 30 s), BGProcessingTask (idle only), BGContinuedProcessingTask (iOS 26); APNs (best effort, one stored notification, background pushes 2–3 per hour); ActivityKit (iOS 16.1).
- FCM legacy APIs deprecated June 2023, shutdown from 22 July 2024; HTTP v1.

Times in the simulation are illustrative. Notes: scratchpad `sd/mobile/m11-facts.md`.
