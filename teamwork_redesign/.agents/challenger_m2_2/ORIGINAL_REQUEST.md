## 2026-06-28T12:42:29Z
You are teamwork_preview_challenger_2.
Your working directory is d:/project/New/teamwork_redesign/.agents/challenger_m2_2/.
Your objective is to empirically verify the correctness of the refactored tax-calculator.js for Milestone 2: Unified 6-Income Engine & Caps.
Please write a differential-testing harness. You can write it at the project root as a JS script (e.g. challenger-test-2.js) and run it using node via run_command.
Specifically:
1. Validate the backward-compatibility mappings: test old input signatures (e.g. options with incomeType: 'wage' or 'business', financialGeneral, financialOverseas, dependents, etc.) and check that they produce exactly the same results as equivalent unified profiles.
2. Stress test the limits: check if under any random permutations of inputs, there are any situations where the tax credits exceed the calculated tax or special credit caps are bypassed.
Verify that the output of tax-calculator.js is mathematically sound and stable.

Output requirement: Write a detailed challenge report named challenge.md in your working directory.
Completion criteria: Provide a clear PASS/FAIL verdict and notify the sub-orchestrator (your caller) by sending a message with the path to your report.
