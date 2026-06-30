## 2026-06-28T12:40:12Z
You are teamwork_preview_reviewer_4 (expert critic).
Your working directory is d:/project/New/teamwork_redesign/.agents/reviewer_m2_4/.
Your objective is to independently review the refactoring of tax-calculator.js for Milestone 2: Unified 6-Income Engine & Caps.
Please examine:
1. Correctness: Does the implementation of 6 incomes, compared financial tax, business loss offset, and caps perfectly match the requirements in SCOPE.md, ORIGINAL_REQUEST.md, and AGENTS.md?
2. Completeness: Are all 5 limits and special logics correctly implemented?
3. Robustness: Are edge cases (like zero inputs, very large values, negative values, missing properties) handled gracefully without throwing exceptions?
4. Interface conformance & Compatibility: Does it maintain full backward compatibility with app.js and optimizer.js as specified?
5. Test Execution: Run `node verify-calc.js` and `node test_calculator_m2.js` on the user's system using run_command to verify that all tests pass. If there are any other test suites or custom scenarios you want to run, feel free to run them.

Output requirement: Write a detailed review report named review.md in your working directory.
Completion criteria: Your review must provide a clear PASS or FAIL verdict and you must notify the sub-orchestrator (your caller) by sending a message with the path to your report.
