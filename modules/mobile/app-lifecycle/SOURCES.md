# Sources: The app lifecycle (fact-checked 2026-10-12)

- Apple: scene-based lifecycle states; TN3187 (UIScene required when building with the SDK after iOS 26, i.e. iOS 27).
- Android: Activity lifecycle (save in onStop), processes and app lifecycle (cached processes killed; system kills processes, not activities), saved state (rememberSaveable, SavedStateHandle), configuration changes.
- Android 15 edge-to-edge default; Android 16 opt-out disabled, predictive back default, onBackPressed not called; Android 16/17 large-screen restrictions ignored (opt-out removed in 17).

The café app is made up. Notes: scratchpad `sd/mobile/m03-facts.md`.
