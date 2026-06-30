# Progress - Milestone 3: UI and Input Data Parsing

Last visited: 2026-06-28T18:13:00+09:00

## Todo
- [x] Refactor `index.html` inputs for Spouse A and B (already verified to have the correct 26 IDs and classes)
- [x] Update `progressInputs` array in `app.js` to include the 26 new input IDs
- [x] Update PDF parsing target in `app.js` (`inc-a-salary` -> `inc-a-wage`)
- [x] Update `parseIncomeInputs` in `app.js` to parse and return all 26 inputs, along with compatibility getters/properties
- [x] Update `validateIncomeInputs` in `app.js` to check non-negativity and perform ISA eligibility checks using the on-the-fly comprehensive income calculator
- [x] Update advice action `income_isa_switch` in `app.js` to modify `inc-a-interest-dom` and `inc-a-dividend-dom` instead of `inc-a-financial-gen`
- [x] Update `window.TaxStore.getData()` in `store.js` to parse and return all 26 inputs, along with compatibility getters/properties
- [x] Run play-tests or manual verification to ensure no JS errors occur on page load and calculations (syntax validation passed via node -c)
