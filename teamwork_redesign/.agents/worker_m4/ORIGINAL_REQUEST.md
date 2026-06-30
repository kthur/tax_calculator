## 2026-06-28T21:41:06+09:00
You are the Worker for Milestone 4: Couple Optimization & Charts. Your mission is to refactor optimizer.js (located at d:/project/New/teamwork_redesign/optimizer.js) and app.js (located at d:/project/New/teamwork_redesign/app.js) to support couple year-end optimization over the new 6 composite incomes.
Specifically:
1. Update TaxOptimizer.optimizeCoupleYearEnd in optimizer.js to accept personA and personB profile objects containing all 6 incomes (wage, bizGenRevenue, bizGenExpense, bizRentRevenue, bizRentExpense, interestDom, interestOverseas, dividendDom, dividendOverseas, pensionPub, pensionPri, otherRevenue, otherExpense) plus the other credit inputs (card, pension, irp, yellowUmbrella, housingSubscription, housingLoanRepay, ventureInvestment, etc.).
2. Inside the permutations loop, construct the profile objects for personA and personB by merging their static 6-income fields and other credit fields with the dynamically permuted dependent fields (dependentsCount, cardUsage, cashUsage, medicalExpense, educationExpense, childrenCount, hasSeniorDependent, hasDisabledDependent, hasBirthOrAdoption, birthOrder).
3. Call TaxCalculator.calculateTax (or calculateComprehensiveIncome) instead of TaxCalculator.calculateYearEndTax in optimizer.js to calculate individual taxes for Spouse A and B in each permutation step.
4. Update TaxOptimizer.getCoupleTaxWithTarget in optimizer.js in the same manner.
5. In app.js, update runOptimizerAndRender to build personAOptData and personBOptData using all 6 incomes from the parsed object d:
   - wage: d.aWage (or d.bWage)
   - bizGenRevenue: d.aBizGenRevenue (or d.bBizGenRevenue)
   - bizGenExpense: d.aBizGenExpense (or d.bBizGenExpense)
   - bizRentRevenue: d.aBizRentRevenue (or d.bBizRentRevenue)
   - bizRentExpense: d.aBizRentExpense (or d.bBizRentExpense)
   - interestDom: d.aInterestDom (or d.bInterestDom)
   - dividendDom: d.aDividendDom (or d.bDividendDom)
   - interestOverseas: d.aInterestOverseas (or d.bInterestOverseas)
   - dividendOverseas: d.aDividendOverseas (or d.bDividendOverseas)
   - pensionPub: d.aPensionPub (or d.bPensionPub)
   - pensionPri: d.aPensionPri (or d.bPensionPri)
   - otherRevenue: d.aOtherRevenue (or d.bOtherRevenue)
   - otherExpense: d.aOtherExpense (or d.bOtherExpense)
   - card: d.aCard (or d.bCard)
   - pension: d.aPension (or d.bPension)
   - irp: d.aIrp (or d.bIrp)
   - yellowUmbrella: d.aYellow (or d.bYellow)
   - ventureInvestment: d.aVentureInvestment (or d.bVentureInvestment)
   - housingSubscription: d.aHousingSubscription (or d.bHousingSubscription)
   - housingLoanRepay: d.aHousingLoanRepay (or d.bHousingLoanRepay)
   - isaIncome: d.aIsaIncome (or d.bIsaIncome)
   - isaType: d.aIsaType (or d.bIsaType)
   - bondSeparated: d.aBondSeparated (or d.bBondSeparated)
6. In app.js, refactor card navigation recommendations and medical comparison chart rendering (renderMedicalComparison) to use d.aWage and d.bWage instead of d.aSalary and d.bSalary for the 25% and 3% thresholds, to maintain consistency with the tax calculator engine.
7. Verify syntax using node -c, and write/run a unit test file or use browser rendering verification.
MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.
Write your changes to optimizer.js and app.js and document them in your handoff report handoff.md under d:/project/New/teamwork_redesign/.agents/worker_m4/.
