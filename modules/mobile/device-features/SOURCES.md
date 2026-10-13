# Sources: Camera, location and sensors (fact-checked 2026-10-12)

- Fused location priorities: high accuracy (GPS), balanced ~100 m, low power ~10 km, passive; batching and long intervals save battery.
- Background location: Android 8 limits, Android 10 ACCESS_BACKGROUND_LOCATION, Android 11 separate request via Settings; iOS Always requested once, reminders.
- CameraX / AVFoundation; camera and mic indicators (iOS 14, Android 12); Android 12 sensor toggles.
- Android 12 motion sensors capped at 200 Hz; Android 9 no background sensor events.
- Android 17 location button and indicator.

Map, accuracy circles and battery figures in the simulation are illustrative. Notes: scratchpad `sd/mobile/m13-facts.md`.
