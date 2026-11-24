# The Business Numbers Toolkit — integrated development build

## Installation
Deployable application files are at the repository root, preserving the `css/`, `js/`, and `icons/` folders. Documentation and QA tests are stored separately under `.github/business-numbers-toolkit/`. This candidate is staged on `toolkit-consolidated-staging`; keep `main` and `v1-development` unchanged until acceptance tests pass.

## Scope
Includes existing saved profile, Cost, Price, Sell, Plan, Contacts, Reports, Help, Settings; industry activity selector; reusable custom cost category names; custom costs per activity; waste and overhead allowances; monthly goals and a Business Health calculation; separate reports with direct PDF download; browser-local backup; CSV spreadsheet import; and FyscalOS-compatible JSON export. Contacts is a lightweight offline register for suppliers, customers, prospects, retailers, service providers, and business partners, with contact details, relationship notes, status, and follow-up date.

## Important limitations
- Browser-local storage only. No cloud account, cloud synchronization, or live FyscalOS connection.
- Export is a documented handoff format; FyscalOS does not yet have a verified importer.
- Direct PDFs are text-based, offline, and do not reproduce the complete on-screen visual report styling.
- Monthly fixed costs must not also be included in per-unit costs when using the break-even estimator; the interface warns about double counting.
- Changing currency changes display only; it does not convert stored amounts.
- Spreadsheet import accepts CSV files exported from Excel or Google Sheets; direct `.xlsx` upload is not supported. One row becomes one saved activity. Cost subtotals are imported, not ingredient-level detail; imported values must match the selected Business Profile currency. Existing records are retained and exact-name duplicates are skipped by default.
- Contact records are manually managed in the Toolkit and included in backup/transfer data. The spreadsheet importer does not yet import contacts or inventory; the inventory and full-category import work remains outstanding.
- Custom categories are reusable labels, not a fully configurable formula editor. This is an integrated development build, not a verified commercial release.

## Acceptance tests (manual browser verification required)
1. Save a Business Profile with JMD and reload. Confirm values persist.
2. Cost: select Food, add a custom expense, enter valid material purchase/usage, save, reload, edit and confirm totals.
3. Repeat Cost for Services and Trades with distinct units and category names. Confirm saved records appear in Price, Sell, Plan, and Reports.
4. Check weight/volume mismatches reject invalid conversions.
5. Save a pricing decision, offer, and scenario; confirm each has its own report.
6. Download a PDF for each report type; verify it opens in iPad Files and has the selected data.
7. Enter monthly fixed costs and earnings goal, test Business Health with an achievable and an unachievable sales price.
8. Expand ? explanations on fields, use Help search, download backup and FyscalOS transfer export, then restore a backup.
9. Import a CSV spreadsheet using the supplied template; review column matching, confirm new activities appear in Cost/Price/Sell/Plan/Reports, and confirm existing records remain unchanged. Test invalid values and same-name duplicate handling.
10. Test mobile Safari and a second browser. Local data does not automatically sync between browsers.
11. Add, edit, search, filter, and delete a supplier and a prospect in Contacts; confirm records survive reload and appear in JSON backup/transfer files.


See `docs/RELEASE-STATUS.md` for the latest verified limitations and acceptance gates.
