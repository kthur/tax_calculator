## 2026-06-28T09:10:33Z

You are the Worker for Milestone 2: Unified 6-Income Engine & Caps. Your mission is to refactor tax-calculator.js (located at d:/project/New/teamwork_redesign/tax-calculator.js) to support the 6-income engine and its 5 special caps and logics.
Requirements:
1. Implement a comprehensive calculateTax(profile) (or equivalent update to existing functions) that takes a single profile object containing:
   - wage: Gross salary
   - bizGenRevenue and bizGenExpense: General Business
   - bizRentRevenue and bizRentExpense: Rental Business
   - interestDom and interestOverseas: Domestic/Overseas Interest
   - dividendDom and dividendOverseas: Domestic/Overseas Dividend
   - pensionPub and pensionPri: Public/Private Pension
   - otherRevenue and otherExpense: Other Incomes
2. Deduct expenses to find individual income amounts:
   - wageIncomeAmount = wage - calculateSalaryDeduction(wage) (use existing wage deduction logic)
   - bizGenIncomeAmount = bizGenRevenue - bizGenExpense (general business loss can be negative and offsets other comprehensive incomes!)
   - bizRentIncomeAmount = Math.max(0, bizRentRevenue - bizRentExpense) (rental business loss cannot be offset against other incomes, capped at 0!)
   - financialIncomeAmount: If total financial income (interestDom + interestOverseas + dividendDom + dividendOverseas) is > 20,000,000 KRW, the excess is comprehensive financial income. Otherwise, it is separately taxed and not in comprehensive income.
   - pensionPubIncomeAmount = pensionPub - publicPensionDeduction(pensionPub)
   - pensionPriIncomeAmount: Capped/taxed separately (usually if private pension <= 15,000,000 KRW, it is separately taxed at 3-5% and excluded from comprehensive income. Treat private pension <= 15,000,000 KRW as separately taxed, and any amount above it as comprehensive pension income, or if the profile specifies separate taxation, follow it).
   - otherIncomeAmount = otherRevenue - otherExpense. (If other income amount <= 3,000,000 KRW, separate taxation is allowed. By default, treat it as separate unless it is more optimal to include it).
3. Compute total comprehensive income = sum of the above individual income amounts. If total comprehensive income < 0, set it to 0.
4. Implement the 5 limits and special logics:
   - Compared Tax (금융소득 비교산출세액): If total financial income > 20,000,000 KRW, tax is Math.max(Tax1, Tax2):
     - Tax1 = calculateIncomeTax(TotalComprehensiveIncome - (totalFinancial - 20,000,000)) + 20,000,000 * 0.14 + (any overseas financial taxed separately or at source if not comprehensive).
     - Tax2 = calculateIncomeTax(TotalComprehensiveIncome - totalFinancial) + totalFinancial * 0.14.
   - Wage Credit Cap (근로소득 세액공제 안분 한도): Special tax credits (medical, education, insurance, donation) can only be claimed if there is wage income (wage > 0). Their sum must be capped at:
     - CalculatedTax * (wageIncomeAmount / TotalComprehensiveIncome).
   - Female Head Deduction (부녀자공제): Check that the taxpayer's total comprehensive income is <= 30,000,000 KRW (instead of checking gross salary).
   - Pension Credit Rate Hurdle (연금계좌 세액공제 허들 스위칭): If other comprehensive incomes exist, the 15% rate threshold switches from salary <= 55,000,000 to comprehensive income <= 45,000,000.
   - Wage Tax Credit Scaling (근로소득세액공제 안분): Basic tax credit and limit are scaled by wageIncomeAmount / TotalComprehensiveIncome.
   - Business Loss Offset (결손금 통산): General business losses offset other comprehensive incomes; rental business losses do not (capping rental loss at 0).
5. Ensure the return object contains a detailed breakdown of all income types, deductions, credits, and the final tax amount (both national and local income tax, which is 10% of national tax).
6. Run build/test to verify syntax and ensure no regressions.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.
Write your changes to d:/project/New/teamwork_redesign/tax-calculator.js and document them in your handoff report handoff.md under d:/project/New/teamwork_redesign/.agents/worker_m2/.
