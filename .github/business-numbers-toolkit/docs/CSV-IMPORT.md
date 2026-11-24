# Importing spreadsheet activities

The Toolkit imports a CSV export of a spreadsheet. Direct Excel workbook (`.xlsx`) upload is not included.

## Prepare the file

In Excel or Google Sheets, save or download the worksheet as **CSV UTF-8**. Use one row per product, service, recipe, job, or other activity. The Settings page includes a downloadable column template. Common column headings are matched automatically; users can change each match before importing.

Supported mapped fields:

- Activity name (required)
- Activity type and sale unit
- Batch yield and selling price per unit
- Materials/ingredients total for the batch
- Packaging/supplies total for the batch
- Labor hours, hourly rate, and other batch costs
- Waste percentage and allocated overhead total for the batch

Cost subtotals are kept as single imported subtotal lines. The import does not recreate detailed ingredient or packaging line items. Existing records stay in place; same-name rows are skipped by default, with an option to add them as separate records. Imported monetary values use the currency currently selected in My Business. The import does not convert currencies or import profile, past pricing decisions, offers, or scenarios.

## Review and import

Choose the CSV in Settings, check the column matches, and review the row preview. Rows with missing names, invalid numbers, invalid activity types, or no positive cost are skipped and listed. Confirm the number of activities to add. Imported records then appear in the Toolkit's saved activity list and can be used in Price, Sell, Plan, and Reports.

The file is read locally in the browser and is not sent to a server. Download a backup before changing or clearing browser data.
