# Implementation status and external release dependencies

## Implemented in this candidate
- IndexedDB `active/current` is now the authoritative data copy on startup, with migration from the previous localStorage key and a localStorage mirror for synchronous form handlers. Writes are queued in order, and 12 recovery snapshots are retained. A browser crash between localStorage confirmation and IndexedDB commit remains a potential consistency window; this is not yet an atomic transactional UI.
- Cache version updated, with eviction of prior `bnt-integrated-*` caches.
- Transfer import validation, formula evaluation and existing calculation engine preserved.
- Browser smoke test extended to check the primary IndexedDB record.

## External dependencies that cannot be completed from this ZIP alone
1. **Payhip licensing:** requires a merchant account, product configuration, secure verification endpoint, refund/revocation rules and testing with real purchase webhooks. A client-side key check is not secure. Do not distribute a public paid PWA before entitlement enforcement is deployed.
2. **FyscalOS receiving importer:** requires the separate application's repository, data model and import integration tests. A transfer file and Toolkit-side import are available; they are not proof of receiving-app support.
3. **PDF:** current canvas PDF preserves browser-rendered glyph appearance but is image-based and not selectable/searchable. Full Unicode embedding requires a suitable licensed font and a tested PDF library. This is a release blocker.
4. **Cross-platform:** real-device Safari iOS/iPadOS, Android Chrome, Windows Edge/Chrome/Firefox and macOS Safari/Chrome/Firefox tests are not certified. Automated engine tests do not replace them.
5. **Commercial QA:** payment fulfillment, licensing, offline updates, data loss drills, accessibility, and report verification must be passed before launch.

No GitHub branch or production deployment is changed by this archive.
