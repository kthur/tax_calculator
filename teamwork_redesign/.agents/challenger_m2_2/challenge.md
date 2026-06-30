# Adversarial Challenge Report — Milestone 2

## Challenge Summary

- **Overall Verdict**: **PASS**
- **Overall risk assessment**: **LOW**

The refactored `tax-calculator.js` has been empirically verified using a differential-testing harness and a 10,000-run randomized stress test. It is mathematically sound, stable, and correctly applies all tax credit caps and deduction limits.

---

## Challenges

### [Low] Challenge 1: `totalIncome` Metadata Discrepancy

- **Assumption challenged**: The returned `totalIncome` value should be identical between legacy signatures and equivalent unified profiles.
- **Attack scenario**: A legacy caller passes `{ incomeType: 'wage', totalIncome: 65000000, financialGeneral: 12000000 }`. The equivalent unified profile is `{ wage: 65000000, interestDom: 12000000 }`. 
  - The legacy call returns `totalIncome: 65000000` (since `profile.totalIncome` is defined and returned directly).
  - The unified profile returns `totalIncome: 77000000` (calculated as `wage + interestDom`).
- **Blast radius**: Low. The actual tax calculations do not rely on the returned `totalIncome` metadata field (they use the internal variables and the `TotalComprehensiveIncome` field). In `app.js`, `TotalComprehensiveIncome` is preferred when rendering, which represents the unified sum of net incomes.
- **Mitigation**: No code changes are required because the calculation results (tax, deductions, credits) are completely unaffected and identical. However, developers should be aware that the returned `totalIncome` metadata field will differ depending on whether `totalIncome` was explicitly passed or not.

### [Low] Challenge 2: `dependents` vs `dependentsCount` in Legacy `calculateComprehensiveIncome`

- **Assumption challenged**: The original `calculateComprehensiveIncome` method supported `dependents` as a key.
- **Attack scenario**: Passing `{ dependents: 1 }` to the original `calculateComprehensiveIncome` resulted in a deduction calculated with 0 dependents (1,500,000 KRW), because it only supported `dependentsCount`. The refactored version successfully resolves this by mapping `dependents` to `dependentsCount` inside `calculateComprehensiveIncome`.
- **Blast radius**: Low. The refactored version has *improved* robustness compared to the original by adding this mapping.
- **Mitigation**: When comparing with the original engine, tests must use `dependentsCount` to ensure a fair comparison.

---

## Stress Test Results

We ran 10,000 iterations of random permutations of all income sources, deductions, and credits. The following assertions were checked on each iteration:

| Scenario / Rule | Expected Behavior | Actual Behavior | Pass/Fail |
|---|---|---|---|
| **Non-Negative Taxes** | `finalComprehensiveTax >= 0`, `finalNationalTax >= 0`, `totalTax >= 0` | Verified on all 10k runs | **PASS** |
| **Work Tax Credit Cap** | Credit $\le$ wage limit (660k/740k) and scaled by `wageRatio` if other incomes exist; credit $\le$ `calculatedTax` | Verified on all 10k runs | **PASS** |
| **Pension Credit Cap** | Credit $\le$ 9M $\times$ pension rate (12% or 15%) | Verified on all 10k runs | **PASS** |
| **Special Credit Cap** | Sum of special credits (insurance, medical, education, donation) $\le$ `calculatedTax * wageRatio` | Verified on all 10k runs | **PASS** |
| **Rent Credit Cap** | Rent credit $\le$ 1,700,000 KRW, only allowed if `wage <= 80,000,000` and `wage > 0` | Verified on all 10k runs | **PASS** |
| **Yellow Umbrella Cap** | Deduction $\le$ bracket limit (2M, 3M, or 5M) | Verified on all 10k runs | **PASS** |
| **Venture Deduction Cap** | Deduction $\le$ 50% of base income | Verified on all 10k runs | **PASS** |
| **Sports Deduction Cap** | Deduction $\le$ 900,000 KRW, only if `wage <= 70,000,000` | Verified on all 10k runs | **PASS** |

All stress tests passed with 0 failures, 0 negative taxes, and 0 uncaught exceptions.

---

## Unchallenged Areas

- **Client UI event binding / DOM updates** — out of scope for the backend math engine challenger role; handled by other agents in Milestone 3.
- **Couple optimization logic in `optimizer.js`** — out of scope for the Milestone 2 engine verification; handled by other agents in Milestone 4.
