## 2026-06-28T09:10:05Z

You are M3-Worker. Your task is to implement the UI refactoring for Milestone 3 (UI and Input Data Parsing) in index.html, app.js, and store.js in d:/project/New/teamwork_redesign/.

You must read the detailed code change recommendation plan produced by M3-Explorer at:
d:/project/New/teamwork_redesign/.agents/explorer_m3_1/handoff.md

Apply the modifications exactly as specified in the explorer's report:
1. Replace the Spouse A salary and type inputs, and financial inputs in index.html with the 13 new composite income inputs (wage, biz-gen-revenue, biz-gen-expense, biz-rent-revenue, biz-rent-expense, interest-dom, dividend-dom, interest-overseas, dividend-overseas, pension-pub, pension-pri, other-revenue, other-expense) with their correct tooltips and classes. Repeat for Spouse B.
2. Update setupKoreanUnitHelpers, progressInputs, updateInputProgress, and debounced recalculation event listeners in app.js to include all 26 new input IDs.
3. Update parseIncomeInputs in app.js and window.TaxStore.getData() in store.js to parse and return these 26 inputs, adding the compatibility getters/properties for aSalary, bSalary, aType, bType, aFinancialGen, bFinancialGen, aFinancialOverseas, and bFinancialOverseas.
4. Refactor validateIncomeInputs(d) in app.js to ensure all input amounts are non-negative, and check ISA 서민형 eligibility using the on-the-fly comprehensive income calculator.
5. Update any references like PDF parsing target (inc-a-salary -> inc-a-wage).

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your working directory is d:/project/New/teamwork_redesign/.agents/worker_m3_2/. Report back to me with the details of your changes when complete.
