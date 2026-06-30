# Handoff Report — Milestone 2: Unified 6-Income Engine & Caps Complete

## 1. Milestone State

- **M1: Exploration and Analysis** → **DONE**
- **M2: Unified 6-Income Engine & Caps (R1 & R2)** → **DONE** (this milestone)
- **M3: UI and Input Data Parsing (R4)** → **IN_PROGRESS** (in parallel sub-orchestrator conversation `ae097551-b7f6-45c6-a82b-d8e44c2702b7`)
- **M4: Couple Optimization & Charts (R3)** → **PLANNED** (depends on M2 & M3)
- **M5: E2E Integration and Bug Fixing** → **PLANNED**
- **M6: Adversarial Coverage Hardening (Tier 5)** → **PLANNED**

---

## 2. Active Subagents

None. All subagents spawned for M2 have completed their execution:
- **Explorers**: `f376d03a-a674-42aa-833d-9b7732b13ba7`, `112e690f-39e9-4848-871e-1412bf2ac3b2`, `64ce5d3e-13df-41aa-8771-ed90925ea247` (all reports completed and integrated)
- **Worker**: `020f4460-a9d9-4a0c-bb37-ec1ae25449c1` (implementation and testing harness complete, unit tests passing)
- **Reviewers**: `a3ee0731-2110-4e77-b61e-b55069585570`, `bccd930a-7674-48d8-b14b-82401d250214` (both verified correctness, completeness, and backward-compatibility with PASS verdict)
- **Challengers**: `012f066f-6706-4a10-af62-818b1d9bdcb9`, `009ba253-c8dc-4661-8433-d180c26bc7f9` (both stress-tested up to 1,000+ randomized profiles and verified differential correctness with PASS verdict)
- **Forensic Auditor**: `c7424911-dcaf-4281-b946-530f5c86d4fa` (audited implementation and verified authenticity with CLEAN verdict)

---

## 3. Synthesis of Verification Findings

The refactoring of the calculation engine in `tax-calculator.js` was verified against all tax specifications:
1. **6 Incomes**: Wage, general business, rental business, financial (interest/dividend), pension, and other income streams are calculated concurrently.
2. **Business Loss Offset**: General business losses correctly offset other comprehensive income streams, whereas rental losses are capped at zero and do not offset.
3. **Compared Financial Tax**: If financial income exceeds 20M KRW, it compares progressive tax on comprehensive taxable income (including excess) + 14% on the first 20M vs progressive tax on non-financial comprehensive taxable income + 14% on the entire financial income, taking the maximum of the two.
4. **Special Credit Cap**: Special credits (insurance, medical, education, donation) are only applied when `wage > 0` and are capped using `calculatedTax * wageRatio` scaled proportionally.
5. **Female Head Income Cap**: Additional 500k KRW personal deduction for female householders is correctly limited to Total Comprehensive Income <= 30M KRW.
6. **Pension Credit Rate Hurdle**: Pension tax credit rate (15% vs 12%) is selected based on the presence of non-wage income (using comprehensive income threshold of 45M KRW) or salary-only income (using wage threshold of 55M KRW).
7. **Basic Credit Scaling**: The worker tax credit and its limit scale down based on the `wageRatio` (`wageIncomeAmount / TotalComprehensiveIncome`).
8. **Compatibility Wrappers**: Thin wrappers `calculateTax(profile)` and `calculateYearEndTax(opts)` are present and correctly delegate to `calculateComprehensiveIncome` with parameter mappings for legacy callers.

### Key Challenger/Reviewer Discoveries & Enhancements:
- **Baseline Bug Fixed**: The baseline `calculateYearEndTax` function had a bug where omitting `educationExpense` and other fields resulted in `NaN` propagating through the entire tax credit sum, yielding `NaN` total tax. The refactored code successfully resolves this issue by defaulting all inputs using the `|| 0` pattern.
- **Robustness recommendation**: Intermediate components (like flat financial tax and individual tax terms) are capped at 0 using `Math.max(0, ...)` to prevent negative tax outputs on negative inputs. Coercion is used to prevent NaN propagation on unparsed inputs.

---

## 4. Pending Decisions

None. The mathematical engine is fully validated and locked.

---

## 5. Remaining Work

1. Ensure Milestone 3 (UI and Input Data Parsing) successfully completes.
2. Spawn the sub-orchestrator for Milestone 4 (Couple Optimization & Charts) which will consume this unified `calculateTax` engine to simulate dependent combinations across all 6 incomes.
3. Integrate the UI and the engine under E2E integration test suites in Milestone 5.

---

## 6. Key Artifacts

- **Refactored Engine**: `d:/project/New/teamwork_redesign/tax-calculator.js`
- **Testing Harnesses**:
  - `d:/project/New/teamwork_redesign/verify-calc.js` (5 unit test scenarios)
  - `d:/project/New/teamwork_redesign/test_calculator_m2.js` (unit testing suite)
- **M2 Coordination Metadata**:
  - Progress: `d:/project/New/teamwork_redesign/.agents/sub_orch_m2/progress.md`
  - Briefing: `d:/project/New/teamwork_redesign/.agents/sub_orch_m2/BRIEFING.md`
  - Scope: `d:/project/New/teamwork_redesign/.agents/sub_orch_m2/SCOPE.md`
