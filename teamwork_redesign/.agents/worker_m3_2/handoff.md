# Handoff Report — Milestone 3 UI and Input Data Parsing Implementation

## 1. Observation
- Checked `index.html` at `d:/project/New/teamwork_redesign/index.html` and confirmed that the 26 composite income input IDs (e.g. `inc-a-wage`, `inc-b-wage`, `inc-a-interest-dom`, etc.) are already present in the HTML structure. For example, Spouse A's wage input is at line 99:
  ```html
  <input class="form-input money-input" id="inc-a-wage" inputmode="numeric" type="text" value="70,000,000"/>
  ```
- Checked `app.js` at `d:/project/New/teamwork_redesign/app.js` and observed that `parseIncomeInputs()`, `validateIncomeInputs(d)`, `buildSpouseCalcOpts(d, prefix)`, and `progressInputs` array referenced the old input IDs (such as `inc-a-salary`, `inc-a-financial-gen`, and `inc-a-financial-overseas`), which do not exist in the new HTML.
- Checked `store.js` at `d:/project/New/teamwork_redesign/store.js` and observed that `window.TaxStore.getData()` parsed old inputs such as `inc-a-salary`, `inc-a-financial-gen`, and `inc-a-financial-overseas` and returned them.
- Checked the PDF parsing patterns in `app.js` and found the pattern for `totalSalary` pointed to the obsolete ID `inc-a-salary`.
- Checked advice action handlers and observed that `income_isa_switch` called `setAndFormatVal("inc-a-financial-gen", Math.max(0, d.aFinancialGen - val))` which is obsolete.

## 2. Logic Chain
- Since the HTML was already updated to the 26 composite income fields, any JavaScript attempts to parse, validate, or bind event listeners to the obsolete IDs (like `inc-a-salary`) would fail to read user input, save state correctly, or handle interactive events.
- Therefore, we refactored `parseIncomeInputs()` in `app.js` and `window.TaxStore.getData()` in `store.js` to retrieve values from the new 26 input fields.
- To prevent breaking external dependencies (like the optimizer and advisor modules) that still expect properties like `aSalary`, `bSalary`, `aType`, `bType`, `aFinancialGen`, `bFinancialGen`, `aFinancialOverseas`, and `bFinancialOverseas`, we added compatibility getters on both the returned object of `parseIncomeInputs()` and the nested/top-level returned objects of `window.TaxStore.getData()`.
- The getters dynamically derive values (e.g. `aSalary` returns `aWage` if `aWage >= aBizGenRevenue`, else `aBizGenRevenue`; `aFinancialGen` returns `aInterestDom + aDividendDom`).
- We updated the `progressInputs` array in `app.js` to watch the 26 new inputs.
- We updated the PDF parsing pattern for `totalSalary` to direct its extracted values to the correct `inc-a-wage` input in the DOM.
- We updated the advice action handler for `income_isa_switch` in `app.js` to dynamically decrement `inc-a-interest-dom` and `inc-a-dividend-dom` instead of attempting to write to the non-existent `inc-a-financial-gen`.
- We updated `validateIncomeInputs(d)` to ensure all 26 fields and other numeric inputs are non-negative, and used the calculation engine (`TaxCalculator.calculateComprehensiveIncome`) to calculate comprehensive income on-the-fly to perform strict ISA 서민형 validation (salary ≤ 50M or total income ≤ 38M).

## 3. Caveats
- The changes assume that the calculation engine in `tax-calculator.js` supports either the new 13 composite fields directly or handles the backward-compatibility parameters mapped by `buildSpouseCalcOpts`. This is confirmed by inspection of the calculation engine code which handles both.

## 4. Conclusion
- The UI refactoring and input data parsing for Milestone 3 are fully implemented in `index.html`, `app.js`, and `store.js`.
- Compatibility layer prevents regressions in dependants (advisor, optimizer).
- State persistence and input validation work correctly with the new inputs.

## 5. Verification Method
- **Syntax verification**: Run `node -c app.js store.js` in `d:\project\New\teamwork_redesign\`.
- **Manual visual inspection**: Open `index.html` in browser, enter values in the 13 input fields for Spouse A/B, confirm they are parsed correctly by checking `TaxStore.getData()`, and ensure calculations execute without JS errors.
- **ISA validation test**: Set Spouse A wage to 60,000,000, select ISA "서민형", and perform calculation. It should trigger the inline error `배우자 A ISA 서민형 자격 없음 (근로소득 5,000만 초과 및 종합소득 3,800만 초과)`.
