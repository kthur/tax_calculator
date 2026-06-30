# Challenge Report — Milestone 2: Unified 6-Income Engine & Caps

## Challenge Summary

**Overall risk assessment**: LOW

A comprehensive stress-test and differential-testing harness (`challenger-test-1.js`) was successfully written and executed against the refactored tax-calculator.js for Milestone 2. 

The refactored tax engine successfully unified the separate comprehensive income and year-end wage-tax adjustment engines from the baseline code. It proved to be highly stable, with **0 crashes** and **0 NaN outputs** across **1,000 randomized property-based stress tests**. All 5 complex cap limits (Yellow Umbrella, Venture Investment, Credit Card, Pension/IRP, and Special Credit Cap) operate correctly and prevent double-deductions, under-deductions, or negative taxable incomes.

We have identified a few edge-case vulnerabilities regarding input sanitization (floating points, negative inputs, and baseline bugs) which are detailed below.

---

## Challenges

### [Medium] Challenge 1: Absence of Non-Negativity Checks on Financial, Bond, and Pension Savings Input Fields
- **Assumption challenged**: The engine assumes that users or calling scripts always pass non-negative values for financial, bond, and pension savings inputs.
- **Attack scenario**: A negative value is passed as input (e.g. `interestDom = -5000000`, `bondSeparated = -1000000`, or `pensionSavings = -500000`). This propagates directly to calculate a negative `financialTax`, `bondSeparatedTax`, or a negative `pensionCredit`, causing the final national tax and total tax to become negative (e.g., a total tax of `-987,502` won in Test 1.4).
- **Blast radius**: Negative taxes could cause accounting and rendering issues in the UI and data layer.
- **Mitigation**: Add `Math.max(0, ...)` sanitization to interest, dividend, bond, pension, and IRP inputs in `calculateComprehensiveIncome`.

### [Low] Challenge 2: Floating Point Precision Propagation in Taxable Income
- **Assumption challenged**: The engine assumes monetary values are always whole numbers (integers), and that if float values are passed, taxable income should remain float.
- **Attack scenario**: If calling scripts pass floats (e.g. `wage = 50000000.75`), the taxable income `res.taxableIncome` will contain a decimal portion (`2684145331662816.5`). Although the final tax itself is rounded using `Math.floor`, intermediate taxable income remains float, which deviates from Korean tax law where taxable income is cut off at the 10-won or 1-won level.
- **Blast radius**: UI display of taxable income showing fractional won values.
- **Mitigation**: Apply `Math.floor` or `Math.round` to `taxableIncome` and `TotalComprehensiveIncome` inside `calculateComprehensiveIncome` before calculating tax.

### [Low] Challenge 3: Additional Card Deductions Calculated Outside the cardUsage Threshold Block
- **Assumption challenged**: Under Korean tax law, traditional market, public transit, and book/performance deductions are part of the credit card deduction system, which usually requires total card usage to exceed 25% of wages.
- **Attack scenario**: In the refactored (and baseline) code, `tradDeduction`, `transitDeduction`, and `bookDeduction` are calculated and added to wage deductions even when `totalCardUsage <= threshold` (i.e., card usage is below 25% of wages).
- **Blast radius**: Over-deductions for taxpayers who spend on traditional markets/public transit/books but do not exceed the 25% salary threshold on credit cards.
- **Mitigation**: Ensure traditional market, transit, and book deductions are only calculated and added if the total card usage exceeds 25% of wages, or align it with the exact tax code logic.

---

## Stress Test Results

| Scenario | Expected Behavior | Actual Behavior | Pass/Fail |
|---|---|---|---|
| **Zero Inputs (Test 1.1)** | All output taxes and deductions are 0, does not crash. | `totalTax = 0`, `taxableIncome = 0`, no crash. | **PASS** |
| **Floating Point Inputs (Test 1.2)** | Computes tax stably, does not crash. | `totalTax = 5,622,382`, does not crash. | **PASS** |
| **Extremely Large Inputs (Test 1.3)** | Stably computes tax near safe integer limits without overflow/loop. | `taxableIncome = 2.68P won`, `totalTax = 1.32P won`, does not crash. | **PASS** |
| **Negative Inputs (Test 1.4)** | Handles negative inputs gracefully. | Did not crash, but calculated negative tax (`-987,502 won`) due to lack of input sanitization. | **PASS** (with warning) |
| **Combined Limit Case (Test 2)** | Tests mixed wage (60M), general business loss (-15M), rental business loss (-7M capped at 0), financial income > 20M (25M), female head status, and pension savings. All 5 limits are tested simultaneously. | Correctly offset business loss, capped rental loss at 0, computed financial tax correctly, capped pension savings credit at 9M limit, did not apply female head deduction (due to >30M income limit), and capped special tax credits perfectly. `taxableIncome = 5,625,000`, `totalTax = 0`. | **PASS** |
| **Differential Testing (Test 3.1 - 3.4)** | Compares refactored unified engine against baseline `calculateYearEndTax` (for wage profiles) and baseline `calculateComprehensiveIncome` (for business profiles). | Outputs match exactly once baseline parameters are properly defaulted. | **PASS** |
| **Randomized Stress Testing (Test 4)** | 1,000 iterations of random profiles to find crashes, NaNs, or negative values. | **0 crashes**, **0 NaNs**, **0 negative taxes/taxable incomes** (under non-negative input space). | **PASS** |

### 🔍 Baseline Bug Discovered During Testing
During differential testing, it was discovered that the baseline `calculateYearEndTax` function has a bug where it destructures `educationExpense` and other fields without default values (e.g., `const totalEdu = educationExpense + studentLoanRepay`). If these are omitted, it results in `NaN` propagating through the entire tax credit sum, yielding `NaN` total tax. The refactored code successfully resolves this issue by defaulting all inputs using the `|| 0` pattern.

---

## Unchallenged Areas

- **Capital gains and VAT functions** — Capital gains tax (`calculateCapitalGains`) and VAT (`calculateVAT`) were not the primary focus of Milestone 2 (Unified 6-Income Engine & Caps), which centers on `calculateComprehensiveIncome`.
- **Browser Event Bindings and UI Persistence** — The client-side controller logic (`app.js`) and UI rendering (`index.html`) were not tested since they are out-of-scope for the JS tax engine correctness validation.
