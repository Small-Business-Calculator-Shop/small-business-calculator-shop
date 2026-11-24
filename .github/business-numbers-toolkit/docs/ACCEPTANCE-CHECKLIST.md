# Commercial release acceptance checklist

## Financial integrity
- [ ] Golden calculation cases for each industry template and all supported units
- [ ] Reject weight-volume conversion without a density input
- [ ] Test labor, overhead, waste, fees, discounts, shipping, tax assumptions, and negative inputs
- [ ] Verify rounding and currency formatting across locales

## Data and continuity
- [ ] Migrate legacy localStorage data without losing saved records
- [ ] Test IndexedDB blocked/quota/corrupt/cleared-site-data cases
- [ ] Confirm backup/export and restore on another supported device
- [ ] Confirm failed import never alters existing data

## Reports
- [ ] Unicode multilingual output with embedded licensed fonts
- [ ] Searchable/selectable text, multi-page layout, tables, and accessible labels
- [ ] iOS/Android/desktop PDF download tests

## Platform matrix
- [ ] iOS Safari phone and iPad
- [ ] Android Chrome phone and tablet
- [ ] Windows Chrome, Edge, Firefox
- [ ] macOS Safari, Chrome, Firefox
- [ ] Chromebook Chrome
- [ ] Offline install, update, recovery, and data persistence per platform

## Commerce
- [ ] Payhip verified webhook and entitlement issuance
- [ ] License activation, reinstallation, device transfer, and refund revocation
- [ ] Offline entitlement policy documented and tested
- [ ] Privacy policy, support route, and customer purchase instructions

## Support
- [ ] Every major screen has contextual explanations
- [ ] Diagnostics do not transmit business records without consent
- [ ] Escalation tested for payment, calculations, and data-loss cases
- [ ] Support resolution rate measured rather than assumed
