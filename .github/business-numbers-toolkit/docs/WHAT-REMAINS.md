# Remaining external and acceptance requirements

Completed in this update: replaced raster-only PDF output with an embedded-font selectable/searchable PDF engine; included a font license, offline cache assets, and explicit errors for unsupported characters. Automated PDF text extraction passed for accented Latin, Greek, Cyrillic, currency and punctuation. Calculation and formula tests passed.

Not claimable as completed:
- Payhip merchant licensing: needs merchant-approved account/API/webhook settings, an independently trusted entitlement service, a license issuance and revocation policy, and payment/refund end-to-end testing. A static/offline app cannot securely enforce a secret entitlement without an online activation step or accepting bypass risk.
- FyscalOS receiving importer: requires the actual separate application code/schema; Toolkit export/import alone does not implement the receiver.
- Real-device QA: must run on iOS/iPadOS Safari, Android Chrome, Windows, and macOS. This environment could not navigate a local web page in Chromium due to administrator blocking; do not claim browser certification.
- PDF font subset does not support all Unicode characters/emoji. The generator rejects unsupported characters explicitly.
- Commercial acceptance: remains unpassed, including payment lifecycle, installation, offline recovery, accessibility and financial regression.

The existing GitHub/Cloudflare deployment is not modified by this archive.
