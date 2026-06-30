# Milestone 2 Review Report: Unified 6-Income Engine & Caps

## Review Summary

**Verdict**: PASS

The refactored calculation engine in `tax-calculator.js` implements the 6 composite income streams, compared financial tax, business loss offset, and all 5 special caps and logics required for Milestone 2. Backward compatibility with `app.js` and `optimizer.js` is fully maintained. All automated unit test suites (`verify-calc.js` and `test_calculator_m2.js`) run and pass successfully.

---

## 1. Quality Review Findings

### [Medium] Negative Tax Propagation on Negative Inputs
- **What**: If negative values are passed for `interestDom` or `dividendDom`, they are not capped at 0 when calculating `financialTax`. This propagates to `finalNationalTax` and `totalTax`, causing the calculator to output a negative tax liability.
- **Where**: `tax-calculator.js` lines 161, 370-372.
- **Why**: Taxes should never be negative. While `app.js` contains input validation to prevent negative entries, the core calculation engine should ideally be self-defending.
- **Suggestion**: Use `Math.max(0, ...)` to ensure `financialTax` and individual tax terms cannot be negative. For example:
  ```javascript
  const financialTax = Math.max(0, Math.floor(totalFinancial > 20000000 ? 20000000 * 0.14 : (interestDom + dividendDom) * 0.14));
  ```

### [Minor] NaN Propagation on Invalid/Missing Inputs
- **What**: Passing `NaN` for numeric properties (e.g., `bizGenRevenue: NaN`) results in `TotalComprehensiveIncome` and `totalTax` becoming `NaN` instead of fallback values.
- **Where**: `tax-calculator.js` lines 109-122.
- **Why**: The engine relies on the caller (e.g., `app.js` calling `parseVal()`) to sanitize types. A robust library-level calculation engine should handle invalid types gracefully.
- **Suggestion**: Coerce profile properties to numbers with fallback defaults:
  ```javascript
  let wage = Number(profile.wage) || 0;
  ```

---

## 2. Verified Claims

- **Claim 1**: Unified 6-income engine computes correct individual income amounts.
  - *Method*: Verified via Scenario 1 (Wage only) and Scenario 2 (Business only) in `verify-calc.js`.
  - *Verdict*: PASS
- **Claim 2**: Business loss offset allows negative general business income to reduce comprehensive income, while rental losses are capped at 0.
  - *Method*: Verified via Scenario 3 (Mixed wage + general business loss) and Scenario 4 (Rental loss cap) in `verify-calc.js`, and Test 1 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 3**: Compared Financial Tax correctly compares progressive tax with excess financial income vs. flat 14% on total financial income.
  - *Method*: Verified via Scenario 5 in `verify-calc.js` and Test 2 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 4**: Special credits (medical, insurance, etc.) are capped by the wage ratio limit and only available if wage > 0.
  - *Method*: Verified via Scenario 2 (Business only credit cap) in `verify-calc.js` and Test 3 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 5**: Female head deduction is correctly limited to Total Comprehensive Income <= 30,000,000 KRW.
  - *Method*: Verified via Test 4 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 6**: Pension credit rate switches threshold based on presence of other comprehensive income.
  - *Method*: Verified via Test 5 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 7**: Wage tax credit scaling scales the basic credit limit by the wage ratio.
  - *Method*: Verified via Test 6 in `test_calculator_m2.js`.
  - *Verdict*: PASS
- **Claim 8**: Compatibility wrappers map legacy profiles (`incomeType: 'business'`, etc.) correctly.
  - *Method*: Verified via wrapper assertions in `verify-calc.js`.
  - *Verdict*: PASS

---

## 3. Coverage Gaps & Risks

- **Gap 1**: E2E integration with UI inputs (`index.html` and `app.js`).
  - *Risk*: Medium. While the engine's interface is backwards-compatible, full functionality depends on Milestone 3 aligning UI elements (like `inc-a-wage`) with the new single profile schema.
  - *Recommendation*: Ensure Milestone 3 thoroughly maps the UI fields to the `calculateComprehensiveIncome` profile parameters.

---

## 4. Adversarial Challenge & Stress-Testing

### Challenge Summary
- **Overall Risk Assessment**: LOW
- All primary calculations and division-by-zero risks are handled gracefully via logical checks (`TotalComprehensiveIncome > 0`, `specialCreditSum > 0`, `denominator > 0`). The only vulnerabilities found are the propagation of negative tax on negative financial inputs and NaN on raw invalid types.

### Challenges

#### [Low] Negative Financial Income Challenge
- **Assumption challenged**: Financial income elements (`interestDom`, etc.) are always positive.
- **Attack scenario**: Passing negative interest/dividend inputs.
- **Blast radius**: Results in negative `financialTax`, leading to negative final taxes.
- **Mitigation**: Capping intermediate tax components at 0.

#### [Low] NaN Input Challenge
- **Assumption challenged**: All inputs are properly sanitized numbers.
- **Attack scenario**: Caller passes `NaN` or unparseable inputs.
- **Blast radius**: Propagates `NaN` to the final tax result.
- **Mitigation**: Use `Number(val) || 0` for profile property initialization.

### Stress Test Results

- **Empty Profile** -> Returns 0 tax -> PASS
- **Undefined Profile** -> Returns 0 tax -> PASS
- **Float/Decimal Inputs** -> Returns valid taxes (handles decimals without truncation crashes) -> PASS
- **Extremely Large Values** -> Handles `1e15` without integer overflow crashes (JavaScript uses double-precision floats, handling up to `9e15` safely) -> PASS
