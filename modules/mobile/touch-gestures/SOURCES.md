# Sources: Touch, gestures and feedback (fact-checked 2026-10-12)

- Apple HIG Accessibility (7 Mar 2025): iOS default 44×44 pt, minimum 28×28 pt.
- Android accessibility: touch targets at least 48×48 dp; Material components enforce minimumInteractiveComponentSize.
- WCAG 2.2: SC 2.5.8 24×24 CSS px (AA); SC 2.5.5 44×44 (AAA).
- Haptics: UIFeedbackGenerator, SwiftUI sensoryFeedback (iOS 17); Android performHapticFeedback (no VIBRATE permission).
- Gesture conflicts: Android system gesture exclusion covers Back only (200 dp per edge), not Home; HIG: avoid conflicting with system gestures; iOS 26 content swipe pops back.

The basket screen is made up. Notes: scratchpad `sd/mobile/m06-facts.md`.
