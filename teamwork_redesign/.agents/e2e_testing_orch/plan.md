# E2E Test Suite Plan for Tax Calculator Redesign

## 1. Test Suite Architecture

We will set up a Playwright E2E test suite in the project. Since the application is a client-side vanilla JavaScript single-page application, the tests can interact with the DOM directly.
To run the tests reliably, we will configure Playwright to open `index.html` using a local HTTP server or the `file://` protocol. Running a local HTTP server is generally more robust for cookies, localStorage, and modular JS loading. We can start a lightweight server using a simple Node script before running Playwright, or configure Playwright's `webServer` option in `playwright.config.js` to run a lightweight server.
Wait, let's write a simple `server.js` or use Node's built-in `http` or a library like `http-server` if installed, or just Node's built-in `http` module to serve `index.html` and assets. A built-in HTTP server has zero dependencies, making it extremely reliable.

## 2. Test Tiers and Inventory

We will implement a total of at least 60 test cases:

### Tier 1: Feature Coverage (25+ cases)
1. **F1-A-Wage**: Spouse A basic wage income tax calculation (happy path).
2. **F1-B-Wage**: Spouse B basic wage income tax calculation.
3. **F2-Biz-Gen**: General business income (revenue vs expense) and tax calculation.
4. **F3-Biz-Rent**: Rental business income and tax calculation.
5. **F4-Other**: Other income (other revenue vs other expense) calculation.
6. **F5-Pension-Pub**: Public pension income calculation.
7. **F6-Pension-Pri**: Private pension income calculation.
8. **F7-Financial-Dom**: Domestic interest and dividend income calculation (under 20M).
9. **F8-Financial-Overseas**: Overseas interest and dividend income.
10. **F9-ISA-General**: ISA general type tax optimization.
11. **F10-ISA-Sub**: ISA 서민형 type tax optimization (salary <= 50M).
12. **F11-ISA-Domestic**: ISA domestic investment type.
13. **F12-Bond**: Bond separate taxation calculation.
14. **F13-Venture**: Venture capital investment deduction.
15. **F14-Housing-Sub**: Housing subscription credit.
16. **F15-Housing-Loan**: Housing loan interest deduction.
17. **F16-Sports**: Sports facility fee deduction (happy path).
18. **F17-Hometown**: Hometown donation 20만 optimal calculation.
19. **F18-DeemedRent**: Deemed rent calculation for 2-house owners.
20. **F19-Inherit**: Inheritance tax calculation with 2025 reforms (child deduction 5억).
21. **F20-MarriageGift**: Marriage/childbirth gift exemption.
22. **F21-GiftTimeline**: 10-year gift timeline generation.
23. **F22-CoupleOpt**: Couple dependent optimization run and output check.
24. **F23-ReportShare**: Copying integrated report.
25. **F24-MedicalAllocation**: Spouse medical expense allocation visualization.
26. **F25-ConsumptionNav**: Consumption navigation recommendations display.

### Tier 2: Boundary & Corner Cases (25+ cases)
1. **B1**: Zero income case (verify 0 tax).
2. **B2**: High income tax brackets (upper limits of 45%).
3. **B3**: Business loss (negative income) offsetting wage income.
4. **B4**: Rental business loss (verify it does NOT offset wage income).
5. **B5**: Special tax credit cap for wage earners (cap = comprehensive tax * wage / total income).
6. **B6**: Basic wage tax credit cap scaling.
7. **B7**: Female worker deduction (부녀자 공제) boundary (income exactly 3,000만 vs 3,000만 1원).
8. **B8**: Pension credit rate switching boundary (income <= 4,500만 vs > 4,500만).
9. **B9**: ISA 서민형 income limit check (salary exactly 5,000만 vs 5,000만 1원).
10. **B10**: Financial income comparison tax switch (exactly 2,000만 vs 2,000만 1원).
11. **B11**: Sports facility PT fee portion adjustment (PT included: only 50% counts).
12. **B12**: Sports facility deduction salary cap (exactly 7,000만 vs 7,000만 1원).
13. **B13**: Sports facility deduction limit cap (exceeding 300만).
14. **B14**: Hometown donation disaster area switch (exceeding 20만, 33% rate).
15. **B15**: Hometown donation amount limit (exceeding 200만).
16. **B16**: Deemed rent small house exclusion (area <= 40㎡, price <= 2억).
17. **B17**: Deemed rent 1-house vs 2-house vs 3-house triggers.
18. **B18**: Inheritance child deduction count boundaries (no children, 1 child, 10 children).
19. **B19**: Inheritance coresident house deduction limit (max 6억).
20. **B20**: Inheritance financial asset deduction cap (20% up to 2억).
21. **B21**: Marriage gift exemption one-time constraint (cannot combine marriage and birth separately to exceed 1억 extra).
22. **B22**: Gift timeline minor vs adult child exemptions (2,000만 vs 5,000만).
23. **B23**: PWA service worker check.
24. **B24**: LocalStorage persistence loading on refresh.
25. **B25**: PDF file parser regex error handling.

### Tier 3: Cross-Feature Combinations (5+ cases)
1. **C1**: Mixed income (Wage + Business loss + Rental loss + Financial > 2,000만).
2. **C2**: ISA matured rollover to pension + high interest income comparison tax.
3. **C3**: Sports facility PT + Hometown donation + Housing subscription.
4. **C4**: Spouses both having business + wage income, running couple optimization with dependents card/medical/edu.
5. **C5**: Deemed rent + Inheritance tax + Marriage gift.

### Tier 4: Real-World Scenarios (5+ cases)
1. **S1: The High-Earning N-Jobber Couple**: Detailed scenario for a tech couple A (1억 salary + 3천만 IT freelancing business income) and B (8천만 salary + 1천만 youtube income), optimization of dependents.
2. **S2: The Retired Landlord**: Spouse A is retired, has pension income (1,500만) and rental income (2주택, 보증금 15억). Spouse B is housewife. Calculate taxes, deemed rent, and health insurance.
3. **S3: The Newlyweds with Parents' Support**: Young couple getting married, receiving 1.5억 gift from A's parents, 1.5억 from B's parents. Calculate gift tax and generate gift timelines.
4. **S4: The Active Investor**: Spouse A has salary (7,000만) and domestic dividends (1,500만) + overseas dividends (1,000만) + ISA (2,000만). Spouse B has salary (5,000만). Run optimization and advise.
5. **S5: Comprehensive Estate Planning**: Family inheritance scenario after owner passes away. Asset value 30억, spouse survives, 3 children, co-resident home 8억, financial asset 5억. Run calculations.

## 3. Worker Action Steps

We will spawn `teamwork_preview_worker` to:
1. Create a local node-based web server script `server.js` at `d:/project/New/teamwork_redesign/server.js` that serves the workspace files.
2. Create `playwright.config.js` at `d:/project/New/teamwork_redesign/playwright.config.js` configuring Playwright to run the web server and point to it.
3. Create `d:/project/New/teamwork_redesign/tests/tax-calculator.spec.js` implementing the ~60 test cases.
4. Write `d:/project/New/teamwork_redesign/TEST_INFRA.md`.
5. Run the Playwright test suite using PowerShell and report test results.
6. Verify and polish tests.
7. Write `d:/project/New/teamwork_redesign/TEST_READY.md`.
