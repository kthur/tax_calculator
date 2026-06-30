# E2E Test Suite Ready — TEST_READY.md

## Test Execution Command
To run all tests in the E2E test suite, use the following PowerShell command:
```powershell
powershell -ExecutionPolicy Bypass -Command "npx playwright test"
```

## E2E Test Coverage Checklist

### Tier 1: Feature Coverage (35 cases)
- [x] **F1-A/B-Wage**: Spouse A/B wage income tax calculations (happy path)
- [x] **F2-Biz-Gen-A/B**: General business income (revenue vs expense) tax calculations
- [x] **F3-Biz-Rent-A/B**: Rental business income and tax calculations
- [x] **F4-Other-A/B**: Other income calculation
- [x] **F5-Pension-Pub-A/B**: Public pension income calculation
- [x] **F6-Pension-Pri-A/B**: Private pension income calculation
- [x] **F7-Financial-Dom-A/B**: Domestic interest & dividend income (< 20M separate taxation)
- [x] **F8-Financial-Overseas-A/B**: Overseas interest & dividend income
- [x] **F9-ISA-General**: ISA general type tax optimization
- [x] **F10-ISA-Sub**: ISA 서민형 type tax optimization (salary <= 50M)
- [x] **F11-ISA-Domestic**: ISA domestic investment type
- [x] **F12-Bond**: Bond separate taxation calculation
- [x] **F13-Venture**: Venture capital investment deduction
- [x] **F14-Housing-Sub**: Housing subscription credit
- [x] **F15-Housing-Loan**: Housing loan interest deduction
- [x] **F16-Sports**: Sports facility fee deduction (happy path)
- [x] **F17-Hometown**: Hometown donation 20만 optimal calculation
- [x] **F18-DeemedRent**: Deemed rent calculation for 2-house owners
- [x] **F19-Inherit**: Inheritance tax calculation with 2025 reforms (child deduction 5억)
- [x] **F20-MarriageGift**: Marriage/childbirth gift exemption
- [x] **F21-GiftTimeline**: 10-year gift timeline generation
- [x] **F22-CoupleOpt**: Couple dependent optimization run and output check
- [x] **F23-ReportShare**: Copying integrated report
- [x] **F24-MedicalAllocation**: Spouse medical expense allocation visualization
- [x] **F25-ConsumptionNav**: Consumption navigation recommendations display
- [x] **F26-ThemeToggle**: Dark/Light mode theme switching
- [x] **F27-PWA-Elements**: PWA manifest checking

### Tier 2: Boundary & Corner Cases (25 cases)
- [x] **B1**: Zero income case (verify 0 tax)
- [x] **B2**: High income tax brackets (upper limits of 45% rate)
- [x] **B3**: Business loss (negative income) offsetting wage income
- [x] **B4**: Rental business loss (verify it does NOT offset wage income)
- [x] **B5**: Special tax credit cap for wage earners
- [x] **B6**: Basic wage tax credit cap scaling
- [x] **B7-1/2**: Female worker deduction (부녀자 공제) boundary (income <= 30M vs > 30M)
- [x] **B8-1/2**: Pension credit rate switching boundary (income <= 45M vs > 45M)
- [x] **B9-1/2**: ISA 서민형 income limit boundary (exactly 50M vs 50M + 1원)
- [x] **B10-1/2**: Financial income comparison tax switch (exactly 20M vs 20M + 1원)
- [x] **B11**: Sports facility PT fee portion adjustment (PT included: only 50% counts)
- [x] **B12-1/2**: Sports facility deduction salary cap (exactly 70M vs 70M + 1원)
- [x] **B13**: Sports facility deduction limit cap (exceeding 300만)
- [x] **B14**: Hometown donation disaster area switch (exceeding 20만, 33% rate)
- [x] **B15**: Hometown donation amount limit (exceeding 200만)
- [x] **B16**: Deemed rent small house exclusion (area <= 40㎡, price <= 2억)
- [x] **B17**: Deemed rent 1-house vs 2-house vs 3-house triggers
- [x] **B18-1/2/3**: Inheritance child deduction count boundaries (0, 1, 10 children)
- [x] **B19**: Inheritance coresident house deduction limit (max 6억)
- [x] **B20**: Inheritance financial asset deduction cap (20% up to 2억)
- [x] **B21**: Marriage gift exemption one-time constraint
- [x] **B22**: Gift timeline minor vs adult child exemptions (2,000만 vs 5,000만)
- [x] **B23**: PWA service worker existence check
- [x] **B24**: LocalStorage persistence loading on refresh
- [x] **B25**: PDF file parser invalid file type handling

### Tier 3: Cross-Feature Combinations (5 cases)
- [x] **C1**: Mixed income (Wage + Business loss + Rental loss + Financial > 20M)
- [x] **C2**: ISA matured rollover to pension + high interest income comparison tax
- [x] **C3**: Sports facility PT + Hometown donation + Housing subscription
- [x] **C4**: Spouses both having business + wage income, couple optimization
- [x] **C5**: Deemed rent + Inheritance tax + Marriage gift

### Tier 4: Real-World Application Scenarios (5 cases)
- [x] **S1**: The High-Earning N-Jobber Couple
- [x] **S2**: The Retired Landlord
- [x] **S3**: The Newlyweds with Parents' Support
- [x] **S4**: The Active Investor
- [x] **S5**: Comprehensive Estate Planning
