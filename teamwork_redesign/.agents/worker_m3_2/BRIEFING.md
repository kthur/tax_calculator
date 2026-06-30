# BRIEFING — 2026-06-28T18:10:05+09:00

## Mission
Implement the UI refactoring for Milestone 3 (UI and Input Data Parsing) in index.html, app.js, and store.js in d:/project/New/teamwork_redesign/.

## 🔒 My Identity
- Archetype: teamwork_preview_worker
- Roles: implementer, qa, specialist
- Working directory: d:\project\New\teamwork_redesign\.agents\worker_m3_2\
- Original parent: ae097551-b7f6-45c6-a82b-d8e44c2702b7
- Milestone: Milestone 3

## 🔒 Key Constraints
- Apply modifications exactly as specified in the explorer's report.
- Maintain compatibility getters/properties for aSalary, bSalary, aType, bType, aFinancialGen, bFinancialGen, aFinancialOverseas, and bFinancialOverseas.
- Refactor validateIncomeInputs(d) to ensure all inputs are non-negative and check ISA 서민형 eligibility.
- Update PDF parsing target to inc-a-wage.
- No "while I'm here" refactoring outside of scope.
- Write only to your folder for agent metadata, write to code files for implementation.

## Current Parent
- Conversation ID: ae097551-b7f6-45c6-a82b-d8e44c2702b7
- Updated: not yet

## Task Summary
- **What to build**: UI input parsing refactoring for 26 composite income fields in index.html, app.js, and store.js.
- **Success criteria**: Calculations pass correctly, state loads/saves correctly, ISA validation operates on comprehensive income, and unit test/E2E behaviors are preserved.
- **Interface contracts**: window.TaxStore.getData() and parseIncomeInputs return compatibility getters.

## Change Tracker
- **Files modified**:
  - `d:/project/New/teamwork_redesign/store.js` — Updated `window.TaxStore.getData()` to parse 26 new inputs and added compatibility getters.
  - `d:/project/New/teamwork_redesign/app.js` — Updated `parseIncomeInputs()`, `validateIncomeInputs()`, `buildSpouseCalcOpts()`, `progressInputs` array, PDF parser target, and advice action handler `income_isa_switch`.
- **Build status**: Pass (syntax verified successfully via `node -c`)
- **Pending issues**: None

## Quality Status
- **Build/test result**: Pass (syntax check only; no built-in test suite)
- **Lint status**: Pass
- **Tests added/modified**: None (no built-in test suite)

## Loaded Skills
- None

## Key Decisions Made
- Use Object.defineProperties to attach compatibility getters to return objects of parseIncomeInputs and TaxStore.getData() so existing references do not break.
