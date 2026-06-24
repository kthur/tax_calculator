# Tax Calculator — AGENTS.md

## Project

Vanilla JS single-page tax calculator. No framework, no build step, no test suite.

## Key files

| File | Role |
|---|---|
| `index.html` | Entire UI (all markup inline) |
| `app.js` | Controller: event bindings, input parsing, rendering, localStorage persistence |
| `tax-calculator.js` | Tax engine: income, capital gains, VAT, year-end calculations |
| `optimizer.js` | Couple dependent assignment optimization + gift/sell simulation |
| `advisor.js` | AI advice engine that generates tax-saving recommendations |
| `styles.css` | All styling, dark/light mode, responsive breakpoints (768px, 480px) |

## Developer commands

- **No build/lint/test** — open `index.html` directly in browser
- **GitHub Pages** — push to `main` → auto-deploys to `https://kthur.github.io/tax_calculator/`

## Architecture notes

- All objects are globals: `TaxCalculator`, `TaxOptimizer`, `TaxAdvisor`
- Data flow: input → `parseVal()` → `TaxCalculator.*` → `TaxOptimizer.*` → `TaxAdvisor.*` → DOM update
- State saves to `localStorage` key `tax_calculator_state` (debounced 500ms)
- Advice cards rendered as slide carousel by `renderAdvice()`

## Tax law specifics implemented

- ISA: general (₩5M limit) / 서민형 (₩10M limit, requires income ≤₩50M salary or ≤₩38M total)
- Bond separate taxation: effective 30% (national 27.27% + local 2.73%)
- Couple year-end optimization: tests all dependent assignment combinations
- 1-house non-taxable: requires holding period ≥24 months
- Gift/sell simulation: 이월과세 applies if sold within 10 years of gift

## Common pitfalls

- `calculateYearEndTax()` does NOT return `bracketRate` — always use `TaxCalculator.calculateIncomeTax(taxableIncome).rate * 100`
- `parseVal()` uses `parseInt(..., 10)` — all monetary values are integers
- All money inputs use `.money-input` class with comma formatting
- Debounced auto-save fires on `input` + `change` — avoid direct `saveStateToLocalStorage()` calls
- Advice action callback must handle both `income_*` and `yearend_*` IDs
- ISA 서민형(`sub`) requires salary ≤₩50M (wage) or total income ≤₩38M — validation blocks calculation if violated
- 해외주식 증여 시뮬레이션 결과에 부당행위계산부인 경고가 포함됨 (`gs-stock-warning` 토글)
- Bond separate tax: `bondSeparatedTax = bondSeparated * (30/110)`, local tax (10%) is added separately at the end
