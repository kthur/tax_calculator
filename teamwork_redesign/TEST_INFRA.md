# Playwright E2E Test Infrastructure

This document outlines the testing architecture, features inventory, test tiers, and verification methods for the Tax Calculator Redesign E2E tests.

## Test Environment Configuration
- **Runner**: Playwright Chromium (Headless)
- **Local Server**: Node.js static HTTP server (`server.js`) listening on port 8080
- **Test Command**: `powershell -ExecutionPolicy Bypass -Command "npx playwright test"`
- **Configuration File**: `playwright.config.js`
- **Execution Mode**: Sequential execution with 1 worker to ensure local reliability and eliminate race conditions on shared local state (`localStorage`).

---

## Features Inventory & Testing Scope

| Feature Area | Description | Target UI Selectors / Fields |
|---|---|---|
| **A/B Inputs** | Dual inputs for Spouse A and Spouse B for separate tax calculation. | `#inc-a-wage`, `#inc-b-wage` |
| **6-Income Types** | Comprehensive income calculation simultaneously (Wage, general biz, rent biz, financial, pension, other). | `#inc-a-biz-gen-revenue`, `#inc-a-interest-dom`, `#inc-a-pension-pub`, `#inc-a-other-revenue` |
| **Deduction Caps & Limits** | Validating that caps are applied correctly (e.g. Yellow Umbrella, cards, etc.). | `#inc-a-yellow`, `#inc-a-card` |
| **Sports Facility** | 2025.7 new sports facility deduction (PT 50% only, 3M limit, 70M wage cap). | `#sports-salary`, `#sports-fee`, `#sports-has-pt`, `#btn-calc-sports` |
| **Hometown Donation** | 2026 reform: 44% credit bracket for ₩100K~₩200K, disaster area 33% for excess. | `#hometown-amount`, `#hometown-disaster`, `#btn-calc-hometown` |
| **ISA Optimization** | 2026 reform: annual 40M limit, total 200M limit, domestic type 14% separate taxation. | `#isa-annual`, `#isa-type-select`, `#isa-salary`, `#btn-calc-isa-opt` |
| **Deemed Rent** | 2026 reform: 2-house + high-price (₩1.2B+) deposit excess over 1.2B taxed. | `#deemed-house-count`, `#deemed-deposit`, `#deemed-highprice`, `#btn-calc-deemed-rent` |
| **Inheritance Tax** | 2025 reform: child deduction ₩500M/person, max rate 40% (50% bracket removed), co-resident house. | `#inherit-total-asset`, `#inherit-child-count`, `#inherit-has-spouse`, `#btn-calc-inheritance` |
| **Marriage/Childbirth** | ₩100M special exemption on top of basic ₩50M (total ₩1.5B/person, ₩3.0B couple). | `#mg-reason`, `#mg-amount`, `#mg-past`, `#btn-calc-marriage-gift` |
| **10-Year Timeline** | Generates a 10-year masterplan for tax-free child gifts. | `#gift-child-name`, `#gift-child-age`, `#btn-calc-gift-timeline` |
| **Couple Optimization** | Dependents assignment optimization (permutes all combinations). | `#btn-calc-income-integrated`, `#res-couple-ye-container` |
| **PWA & UI Elements** | Privacy lock badge, theme toggling, floating action bar, bottom sheet. | `#privacyBadge`, `#themeToggleBtn`, `#floating-result-bar`, `#mobile-result-bottom-sheet` |

---

## Test Tiers

### Tier 1: Feature Coverage (>= 25 cases)
- Direct verification of happy paths for each calculation module.
- Inputs trigger UI state updates (results display elements change from `none` to `block`).
- Tests tab switching, theme toggling, floating bar visibility, report copy, and graph rendering.

### Tier 2: Boundary & Corner Cases (>= 25 cases)
- Under-threshold, zero, negative, and extreme inputs.
- Verification of strict eligibility limits (e.g. sports deduction eligibility cap, deemed rent small house exclusions, female head worker 30M limit).
- Persistent state reload using `localStorage` simulation.
- PDF upload dropzone validation and status reporting.

### Tier 3: Cross-feature Combinations (>= 5 cases)
- Mutual interactions (e.g. business general loss offsetting wage income, ISA rollover to pension rollover tax credit).
- Complex joint spouse profiles with mixed income streams and multi-layered deductions.

### Tier 4: Real-World Application Scenarios (>= 5 cases)
- End-to-end user stories (e.g. newlyweds optimization, high-income dual-earners, freelancer transition to sole proprietor, property seller transitioning asset to spouse).

---

## Running the E2E Suite
To execute the tests:
```powershell
powershell -ExecutionPolicy Bypass -Command "npx playwright test"
```
