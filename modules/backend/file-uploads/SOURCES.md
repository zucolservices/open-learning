# Sources: Files and uploads (fact-checked 2026-10-12)

- RFC 7578 (multipart/form-data). OWASP File Upload Cheat Sheet.
- AWS S3 docs: presigned URLs (≤7 days with IAM user keys; shorter with temporary credentials); multipart 5 MiB–5 GiB parts, 10,000 parts; max object 50 TB since 2 Dec 2025 (guide: 48.8 TiB); single PUT 5 GB; presigned POST content-length-range; AbortIncompleteMultipartUpload lifecycle.
- GCS V4 signed URLs (≤7 days); Azure user delegation SAS (≤7 days). GuardDuty Malware Protection for S3 (Jun 2024); Microsoft Defender for Storage.

Safety: attacks described in words only. The café feature is made up. Notes: scratchpad `sd/backend/m17-facts.md`.
