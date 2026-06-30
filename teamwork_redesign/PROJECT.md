# Project: Tax Calculator Redesign

## Architecture
- Client-side vanilla JavaScript single-page application.
- **index.html**: Entry point, UI markup.
- **styles.css**: Visual styling, responsive grid, light/dark mode.
- **tax-calculator.js**: Core math engine. Refactored to support 6 composite incomes simultaneously, caps, and limit logics.
- **optimizer.js**: Spouse tax optimization logic. Updates to support brute force permutations over 6 composite incomes.
- **app.js**: Application controller, event bindings, data input/output mapping, and state persistence in `localStorage`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Exploration and Analysis | Analyze existing tax-calculator.js, app.js, index.html, optimizer.js to map exact calculations, UI inputs, and tests. | None | DONE (conv: 1cbff317-40a0-4055-ad9a-b94971c4b637) |
| 2 | M2: Unified 6-Income Engine & Caps (R1 & R2) | Refactor tax-calculator.js to calculate 6 incomes simultaneously and apply tax rules, limits, and caps. | M1 | DONE (conv: d8bf768a-cfbd-46c1-adc2-d981ddabfc7f) |
| 3 | M3: UI and Input Data Parsing (R4) | Redesign index.html and app.js to support spouses A/B separate inputs for 6 incomes, gross/expense separation, and formatting. | M1 | IN_PROGRESS (conv: ae097551-b7f6-45c6-a82b-d8e44c2702b7) |
| 4 | M4: Couple Optimization & Charts (R3) | Refactor optimizer.js to permute over 6 incomes, render comparison chart, and generate reports. | M2, M3 | DONE (conv: ca8831ae-ada7-4f61-889e-565072f85b6e) |
| 5 | M5: E2E Integration and Bug Fixing | Assemble E2E tests, pass all Tier 1-4 tests. | M4, E2E-TESTS | IN_PROGRESS (conv: a5c4a727-515c-4e86-9444-8336d58d536d) |
| 6 | M6: Adversarial Coverage Hardening (Tier 5) | Generate adversarial test cases (Tier 5), fix bugs, and finalize codebase. | M5 | PLANNED |

## Interface Contracts
### TaxCalculator
- `calculateTax(profile)`: returns comprehensive tax object with detailed breakdown of all 6 incomes.
- `calculateIncomeTax(taxableIncome)`: standard progressive tax lookup (rate, deduction, etc.).
- `calculateYearEndTax(profile)`: year-end tax credit calculations.

### TaxOptimizer
- `optimizeSpouseTax(spouseA, spouseB)`: permutes dependent assignments, calculates joint tax, and returns optimal combination and comparison details.

## Code Layout
- `d:/project/New/teamwork_redesign/index.html` - UI HTML
- `d:/project/New/teamwork_redesign/styles.css` - Styling
- `d:/project/New/teamwork_redesign/tax-calculator.js` - Calculation engine
- `d:/project/New/teamwork_redesign/optimizer.js` - Spouse optimization
- `d:/project/New/teamwork_redesign/app.js` - UI controller and state storage
- `d:/project/New/teamwork_redesign/advisor.js` - AI Advisor recommendations
