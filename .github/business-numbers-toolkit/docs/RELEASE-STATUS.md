# Integrated release candidate — verification and limitations

## Improvements in this consolidated package
- IndexedDB is the authoritative active store and maintains a rolling history of 12 recoverable snapshots. Recovery remains user-confirmed and never silently replaces the active record set. LocalStorage remains a compatibility mirror for existing customer data.
- Portable transfer-file validation now rejects invalid record types, non-finite financial goals, and oversized transfer data. Toolkit-to-Toolkit import is available; FyscalOS itself must implement its own importer.
- The service worker cache version is updated for this package.
- Spreadsheet CSV import maps columns to saved activities, previews rows, skips same-name duplicates by default, and adds data without replacing existing records. Direct `.xlsx` import is not included.
- Added a lightweight offline Contacts register for suppliers, customers, prospects, retailers, service providers, and partners. Contact details, status, relationship notes, and follow-up dates are included in Toolkit backups and transfer exports.
- Spreadsheet import remains limited to activity-level cost subtotals. Detailed cost lines, inventory, contacts, profile/settings, pricing, offers, scenarios, and marketing/sales data still need a comprehensive import path before the user’s broader data-import requirement is met.
- Automated Node tests for calculations, formulas, CSV parsing, and PDF generation passed; JavaScript syntax checks passed.
- A browser smoke-test harness is included under `.github/business-numbers-toolkit/tests/browser-smoke.html`, but browser execution was not certified in this environment.

## Important release blockers — not complete
1. **Professional selectable Unicode PDFs:** The PDF engine now embeds a licensed DejaVu Sans subset, produces text objects with Unicode extraction mappings, and fails explicitly on unsupported characters. It still requires browser/device verification and more sophisticated report layout; it does not cover every Unicode character.
2. **IndexedDB primary storage and recovery:** Active records and recovery history use IndexedDB. Legacy localStorage migration/fallback, corruption handling, quota/blocked-database behavior, and device-loss backup testing still require acceptance testing.
3. **Payhip licensing:** A secure paid entitlement system cannot be built entirely into a public offline static PWA. Requires merchant account credentials, webhook verification, a trusted licensing service, refund/revocation policy, and a defined offline grace policy. No secure entitlement system is included; do not sell as protected software.
4. **FyscalOS receiving import:** The separate FyscalOS application and its schema are not present. Toolkit transfer exports are not proof of integration.
5. **Cross-platform QA:** iOS Safari, Android Chrome, Windows, and macOS real-device test results have not been supplied or certified.
6. **Commercial release acceptance:** Not passed. Includes browser verification of spreadsheet import, accessibility, real-browser PDF and offline QA, financial regression tests, payment-to-license delivery, refund revocation, and data-loss recovery drills.

## Deployment safety
Do not overwrite the working branch or production deployment until the full acceptance suite passes. This archive is a development/QA candidate, not a commercial release.
