# Sources: Storing data on the device (fact-checked 2026-10-12)

- Apple: UserDefaults (unencrypted; sensitive data in Keychain); SwiftData (iOS 17); Core Data; Keychain (default accessible when unlocked; ThisDeviceOnly); Data Protection classes; iCloud backup exclusions.
- Android: DataStore replaces SharedPreferences; Room (3.0 stable July 2026); Keystore (non-exportable, TEE/StrongBox); security-crypto deprecated 2025; DataStore + Tink; Auto Backup 25 MB, dataExtractionRules (Android 12).

The café data items are made up. Notes: scratchpad `sd/mobile/m10-facts.md`.
