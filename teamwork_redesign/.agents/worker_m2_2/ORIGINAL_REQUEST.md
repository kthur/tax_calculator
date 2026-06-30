## 2026-06-28T09:10:11Z

<USER_REQUEST>
You are teamwork_preview_worker (generation 2).
Your working directory is d:/project/New/teamwork_redesign/.agents/worker_m2_2/ (please create it and work there).
Your task is to refactor d:/project/New/teamwork_redesign/tax-calculator.js to implement Milestone 2: Unified 6-Income Engine & Caps.

Please implement the following changes in tax-calculator.js:
1. Helper: Implement `calculatePublicPensionDeduction(pensionPub)`:
   - Up to 3.5M: 100%
   - 3.5M to 7M: 3500000 + 40% of excess
   - 7M to 14M: 4900000 + 20% of excess
   - > 14M: 6300000 + 10% of excess, capped at 9M.
2. Refactor `calculateComprehensiveIncome(profile)` to calculate all 6 composite incomes simultaneously:
   - Incomes inputs (from profile):
     - `wage`: Gross salary
     - `bizGenRevenue`, `bizGenExpense`: General business revenue and expense (bizGenIncomeAmount = bizGenRevenue - bizGenExpense, can be negative)
     - `bizRentRevenue`, `bizRentExpense`: Rental business revenue and expense (bizRentIncomeAmount = Math.max(0, bizRentRevenue - bizRentExpense), capped at >= 0)
     - `interestDom`, `dividendDom`: Domestic interest and dividend
     - `interestOverseas`, `dividendOverseas`: Overseas interest and dividend
     - `pensionPub`: Public pension
     - `pensionPri`: Private pension
     - `otherRevenue`, `otherExpense`: Other revenue and expense
   - Also check options: `optPrivatePensionComp` (default false), `optOtherComp` (default false)
   - Allow backward-compatibility by mapping old parameter formats if `profile.incomeType` is defined (e.g. mapping `totalIncome` and `expense` to wage or general business, mapping `financialGeneral` to `interestDom`, `financialOverseas` to `interestOverseas`).
   - Calculate each income net amount:
     - Wage: `wageIncomeAmount = Math.max(0, wage - calculateSalaryDeduction(wage))` (only if wage > 0)
     - General business: `bizGenIncomeAmount = bizGenRevenue - bizGenExpense` (can be negative)
     - Rental business: `bizRentIncomeAmount = Math.max(0, bizRentRevenue - bizRentExpense)`
     - Financial income:
       - `totalFinancial = interestDom + dividendDom + interestOverseas + dividendOverseas`
       - If `totalFinancial > 20,000,000`: `financialCompAmount = totalFinancial - 20,000,000`
       - If `totalFinancial <= 20,000,000`: `financialCompAmount = interestOverseas + dividendOverseas` (overseas only is comprehensive)
       - Also compute `financialTax = (totalFinancial > 20M ? 20M * 0.14 : (interestDom + dividendDom) * 0.14)` separate tax.
     - Pension income:
       - `publicPensionDeduction = calculatePublicPensionDeduction(pensionPub)`
       - `publicPensionIncomeAmount = Math.max(0, pensionPub - publicPensionDeduction)`
       - `privatePensionIncomeAmount = (pensionPri > 15M || profile.optPrivatePensionComp) ? pensionPri : 0`
       - `pensionIncomeAmount = publicPensionIncomeAmount + privatePensionIncomeAmount`
     - Other income:
       - `otherNet = otherRevenue - otherExpense`
       - `otherIncomeAmount = (otherNet > 3M || profile.optOtherComp) ? Math.max(0, otherNet) : 0`
   - Sum to get `TotalComprehensiveIncome = Math.max(0, wageIncomeAmount + bizGenIncomeAmount + bizRentIncomeAmount + financialCompAmount + pensionIncomeAmount + otherIncomeAmount)`. (This correctly applies the General Business Loss Offset since bizGenIncomeAmount can be negative, while rental loss is capped at 0).
   - Deductions:
     - Personal deductions: `(1 + dependentsCount) * 1.5M + senior/disabled additions`. If `isSingleParent` is true, add 1M. Else if `isFemaleHead` is true and `TotalComprehensiveIncome <= 30,000,000`, add 500k.
     - Yellow umbrella: `calculateYellowUmbrellaDeduction(Math.max(0, bizGenIncomeAmount + bizRentIncomeAmount), yellowUmbrella)`
     - Venture investment: `calculateVentureInvestmentDeduction(baseIncome, ventureInvestment)`
     - Wage-earner deductions (only if `wage > 0`):
       - `cardDeduction`, `tradDeduction`, `transitDeduction`, `bookDeduction`
       - `housingDeduction` (subscription: if wage <= 70M, Math.floor(Math.min(subscription, 3M) * 0.4), plus loan, plus mortgage)
       - `sportsDeduction` ( PT 50% only, max 3M base at 30% rate = max 900k deduction; capped at salary <= 70M; call `calculateSportsDeduction` )
     - If `wage <= 0`, all wage-earner deductions are 0.
   - Taxable Income:
     - `taxableIncome = Math.max(0, TotalComprehensiveIncome - yellowUmbrellaDeduction - ventureDeduction - personDeduction - wageDeductions)`.
     - Also calculate `taxableIncomeWithoutFinancial = Math.max(0, TotalComprehensiveIncome - financialCompAmount - yellowUmbrellaDeduction - ventureDeduction - personDeduction - wageDeductions)`.
   - Tax Calculation (Compared Financial Tax):
     - If `totalFinancial > 20,000,000`:
       - `Tax1 = calculateIncomeTax(taxableIncome).tax + 20M * 0.14`
       - `Tax2 = calculateIncomeTax(taxableIncomeWithoutFinancial).tax + totalFinancial * 0.14`
       - `calculatedTax = Math.max(Tax1, Tax2)`
     - Else:
       - `calculatedTax = calculateIncomeTax(taxableIncome).tax`
   - Credits and Caps:
     - `wageRatio = TotalComprehensiveIncome > 0 ? Math.min(1.0, wageIncomeAmount / TotalComprehensiveIncome) : 0`
     - Pension savings credit:
       - If non-wage incomes exist: `pensionRate = TotalComprehensiveIncome <= 45,000,000 ? 0.15 : 0.12`
       - Else: `pensionRate = wage <= 55,000,000 ? 0.15 : 0.12`
       - `pensionCredit = Math.floor(Math.min(9M, pensionSavings + irpSavings) * pensionRate)`
     - Worker Tax Credit:
       - `workTaxCredit = standard work credit` (under 1.3M is 55%, over is 715k + 30% of excess)
       - Limit: `workCreditLimit = wage > 70M ? 660000 : 740000`
       - Capped at `workCreditLimit * wageRatio`
     - Special Credits (only if `wage > 0`):
       - `insuranceCredit`, `medicalCredit` (threshold `wage * 0.03`), `eduCredit`, `donationCredit` (2026 hometown donation reform: up to 100k is 100%, 100k-200k is 44%, >200k is 16.5% or 33% if isDisasterArea is true)
       - Sum: `specialCreditSum = insurance + medical + edu + donation`
       - Cap: `specialCreditCap = calculatedTax * wageRatio`
       - If `specialCreditSum > specialCreditCap`, scale each proportionally: `insuranceCredit = Math.floor(insuranceCredit * (specialCreditCap / specialCreditSum))`, etc., so they don't exceed the cap.
       - If `wage <= 0`, special credits are 0.
     - Rent credit (only if `wage > 0` and `wage <= 80M`): `rentCredit = Math.min(10M, monthlyRent * 12) * (wage <= 55M ? 0.17 : 0.15)`
     - Child credit, birth credit, marriage credit.
   - Final tax calculation:
     - `finalComprehensiveTax = Math.max(0, calculatedTax - workTaxCredit - pensionCredit - childCredit - birthCredit - marriageCredit - cappedSpecialCreditSum - rentCredit)`
     - If `profile.isSmeEmployee` and `wage > 0`, reduce finalComprehensiveTax by `smeReduction = Math.min(2M, Math.floor(finalComprehensiveTax * 0.9))`.
     - Add separate taxes: `isaSeparatedTax` (from ISA profit over limit at 9%) + `bondSeparatedTax` + `financialTax` (from domestic general financial under 20M at 14%).
     - `finalNationalTax = finalComprehensiveTax - smeReduction + isaSeparatedTax + bondSeparatedTax + (totalFinancial > 20M ? 0 : financialTax)`
     - `localTax = Math.floor(finalNationalTax * 0.1)`
     - `totalTax = finalNationalTax + localTax`
   - Return an object with all detailed fields, ensuring it contains all properties expected by app.js and optimizer.js (e.g. `bracketRate`, `bracketDeduction`, `totalTax`, `localTax`, `tax`, `effectiveRate`, etc.).

3. Implement thin compatibility wrappers:
   - `calculateTax(profile)`
   - `calculateYearEndTax(opts)`
   Ensure both wrap and delegate to `calculateComprehensiveIncome(profile)`.

4. Write a comprehensive test script `verify-calc.js` at the project root that defines at least 5 distinct test scenarios:
   - Scenario 1: Wage only (gross 50M) with typical credits.
   - Scenario 2: Business only (bizGenRevenue 60M, expense 20M) with credit card and medical expenses (verify credits are capped to 0).
   - Scenario 3: Mixed wage (50M) and general business loss (bizGenRevenue 10M, expense 20M) (verify loss offset reduces comprehensive income).
   - Scenario 4: Rental loss cap (wage 50M, rental revenue 10M, rental expense 20M) (verify rental loss is capped at 0 and does not offset wage).
   - Scenario 5: Financial income > 20M (interest 30M, wage 40M) (verify compared tax logic is active and correct).
   Run `verify-calc.js` using node and assert all tests pass with 0 errors.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
</USER_REQUEST>
