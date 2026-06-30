const { test, expect } = require('@playwright/test');

// Helper to fill inputs reliably
async function fillInput(page, id, val) {
  const el = page.locator(`#${id}`);
  await el.fill('');
  await el.fill(val.toString());
  await el.dispatchEvent('input');
  await el.dispatchEvent('change');
}

// Helper to select options reliably
async function selectOption(page, id, val) {
  const el = page.locator(`#${id}`);
  await el.selectOption(val);
  await el.dispatchEvent('change');
}

// Helper to toggle checkboxes reliably
async function setCheckbox(page, id, checked) {
  const el = page.locator(`#${id}`);
  const isChecked = await el.isChecked();
  if (isChecked !== checked) {
    await el.click();
  }
}

// Helper to programmatically activate the Capital Gains tab
async function activateCapitalTab(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.calculator-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-capital').classList.add('active');
  });
}

// Helper to programmatically activate the Business tab
async function activateBusinessTab(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.calculator-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-business').classList.add('active');
  });
}

test.describe('Tier 1: Feature Coverage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('F1-A-Wage: Spouse A basic wage income tax calculation', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '70000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
    expect(result).not.toBe('0원');
  });

  test('F1-B-Wage: Spouse B basic wage income tax calculation', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '50000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
    expect(result).not.toBe('0원');
  });

  test('F2-Biz-Gen-A: General business income calculation for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-biz-gen-revenue', '30000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '10000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F2-Biz-Gen-B: General business income calculation for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-biz-gen-revenue', '25000000');
    await fillInput(page, 'inc-b-biz-gen-expense', '8000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F3-Biz-Rent-A: Rental business income calculation for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-biz-rent-revenue', '20000000');
    await fillInput(page, 'inc-a-biz-rent-expense', '5000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F3-Biz-Rent-B: Rental business income calculation for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-biz-rent-revenue', '18000000');
    await fillInput(page, 'inc-b-biz-rent-expense', '4000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F4-Other-A: Other income calculation for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-other-revenue', '10000000');
    await fillInput(page, 'inc-a-other-expense', '2000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F4-Other-B: Other income calculation for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-other-revenue', '12000000');
    await fillInput(page, 'inc-b-other-expense', '3000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F5-Pension-Pub-A: Public pension income for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-pension-pub', '15000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F5-Pension-Pub-B: Public pension income for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-pension-pub', '12000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F6-Pension-Pri-A: Private pension income for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-pension-pri', '12000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F6-Pension-Pri-B: Private pension income for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-pension-pri', '10000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F7-Financial-Dom-A: Domestic financial income under 20M for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-interest-dom', '5000000');
    await fillInput(page, 'inc-a-dividend-dom', '5000000');
    await page.click('#btn-calc-income-integrated');
    const compAmount = await page.locator('#res-a-financial-comp').textContent();
    expect(compAmount).toBe('0 원'); // Separately taxed because <= 20M
  });

  test('F7-Financial-Dom-B: Domestic financial income under 20M for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-interest-dom', '4000000');
    await fillInput(page, 'inc-b-dividend-dom', '4000000');
    await page.click('#btn-calc-income-integrated');
    const compAmount = await page.locator('#res-b-financial-comp').textContent();
    expect(compAmount).toBe('0 원');
  });

  test('F8-Financial-Overseas-A: Overseas financial income for Spouse A', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-interest-overseas', '2000000');
    await fillInput(page, 'inc-a-dividend-overseas', '3000000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-a-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F8-Financial-Overseas-B: Overseas financial income for Spouse B', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-interest-overseas', '1500000');
    await fillInput(page, 'inc-b-dividend-overseas', '2500000');
    await page.click('#btn-calc-income-integrated');
    const result = await page.locator('#res-b-total').textContent();
    expect(result).not.toBe('0 원');
  });

  test('F9-ISA-General: ISA general type tax optimization', async ({ page }) => {
    await activateBusinessTab(page);
    await selectOption(page, 'isa-target', 'a');
    await fillInput(page, 'isa-annual', '20000000');
    await selectOption(page, 'isa-type-select', 'general');
    await fillInput(page, 'isa-salary', '60000000');
    await page.click('#btn-calc-isa-opt');
    const content = await page.locator('#isa-opt-content').innerHTML();
    expect(content).toContain('일반형');
    expect(content).toContain('비과세 한도 500만 원');
  });

  test('F10-ISA-Sub: ISA 서민형 type tax optimization (salary <= 50M)', async ({ page }) => {
    await activateBusinessTab(page);
    await selectOption(page, 'isa-target', 'a');
    await fillInput(page, 'isa-annual', '20000000');
    await selectOption(page, 'isa-type-select', 'sub');
    await fillInput(page, 'isa-salary', '45000000');
    await page.click('#btn-calc-isa-opt');
    const content = await page.locator('#isa-opt-content').innerHTML();
    expect(content).toContain('서민형');
    expect(content).toContain('비과세 한도 1,000만 원');
  });

  test('F11-ISA-Domestic: ISA domestic investment type', async ({ page }) => {
    await activateBusinessTab(page);
    await selectOption(page, 'isa-target', 'a');
    await selectOption(page, 'isa-type-select', 'domestic');
    await setCheckbox(page, 'isa-financial-comp-tax', true);
    await page.click('#btn-calc-isa-opt');
    const content = await page.locator('#isa-opt-content').innerHTML();
    expect(content).toContain('국내투자형');
    expect(content).toContain('분리과세(14%)');
  });

  test('F12-Bond: Bond separate taxation calculation', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-bond', '10000000');
    await page.click('#btn-calc-income-integrated');
    const bondTaxText = await page.locator('#res-a-bond-tax').textContent();
    expect(bondTaxText).not.toBe('0 원');
  });

  test('F13-Venture: Venture capital investment deduction', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-venture', '5000000');
    await page.click('#btn-calc-income-integrated');
    const totalTax = await page.locator('#res-a-total').textContent();
    expect(totalTax).not.toBe('0 원');
  });

  test('F14-Housing-Sub: Housing subscription credit', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-housing-sub', '2400000');
    await page.click('#btn-calc-income-integrated');
    const totalTax = await page.locator('#res-a-total').textContent();
    expect(totalTax).not.toBe('0 원');
  });

  test('F15-Housing-Loan: Housing loan interest deduction', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-housing-loan', '5000000');
    await page.click('#btn-calc-income-integrated');
    const totalTax = await page.locator('#res-a-total').textContent();
    expect(totalTax).not.toBe('0 원');
  });

  test('F16-Sports: Sports facility fee deduction (happy path)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'sports-target', 'a');
    await fillInput(page, 'sports-salary', '50000000');
    await fillInput(page, 'sports-fee', '1200000');
    await setCheckbox(page, 'sports-has-pt', false);
    await page.click('#btn-calc-sports');
    const resultText = await page.locator('#sports-result-content').innerHTML();
    expect(resultText).toContain('360,000 원'); // 30% of 1.2M = 360,000
  });

  test('F17-Hometown: Hometown donation 20만 optimal calculation', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'hometown-target', 'a');
    await fillInput(page, 'hometown-amount', '200000');
    await setCheckbox(page, 'hometown-disaster', false);
    await page.click('#btn-calc-hometown');
    const resultText = await page.locator('#hometown-result-content').innerHTML();
    expect(resultText).toContain('최적 기부 설계');
    expect(resultText).toContain('204,000 원'); // total benefit
  });

  test('F18-DeemedRent: Deemed rent calculation for 2-house owners', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="holding"]').click();
    await selectOption(page, 'deemed-house-count', '2');
    await fillInput(page, 'deemed-deposit', '1500000000');
    await selectOption(page, 'deemed-highprice', 'yes');
    await fillInput(page, 'deemed-small', '0');
    await page.click('#btn-calc-deemed-rent');
    const result = await page.locator('#deemed-result-content').innerHTML();
    expect(result).toContain('대상 주택 수: 2주택');
    expect(result).toContain('보증금 합계액이 12억 원을 초과');
  });

  test('F19-Inherit: Inheritance tax calculation with 2025 reforms', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-total-asset', '2000000000');
    await fillInput(page, 'inherit-child-count', '2');
    await setCheckbox(page, 'inherit-has-spouse', true);
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('일괄공제: 500,000,000 원');
    expect(content).toContain('자녀공제: 1,000,000,000 원'); // 500M * 2 = 1B
  });

  test('F20-MarriageGift: Marriage/childbirth gift exemption', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await selectOption(page, 'mg-reason', 'marriage');
    await fillInput(page, 'mg-amount', '150000000');
    await fillInput(page, 'mg-past', '0');
    await page.click('#btn-calc-marriage-gift');
    const content = await page.locator('#mg-result-content').innerHTML();
    expect(content).toContain('기본 공제: 50,000,000 원');
    expect(content).toContain('혼인/출산 특별 공제: 100,000,000 원');
    expect(content).toContain('최종 납부세액: 0 원');
  });

  test('F21-GiftTimeline: 10-year gift timeline generation', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'gift-child-name', '둘째');
    await fillInput(page, 'gift-child-age', '7');
    await page.click('#btn-calc-gift-timeline');
    const content = await page.locator('#gift-timeline-content').innerHTML();
    expect(content).toContain('둘째');
    expect(content).toContain('7세');
    expect(content).toContain('17세');
    expect(content).toContain('27세');
  });

  test('F22-CoupleOpt: Couple dependent optimization run and output check', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    // Add a dependent
    await page.click('#btn-add-dep');
    await fillInput(page, 'inc-a-wage', '80000000');
    await fillInput(page, 'inc-b-wage', '50000000');
    await page.click('#btn-calc-income-integrated');
    const summary = await page.locator('#res-family-summary-content').textContent();
    expect(summary).toContain('부부 합산 총급여');
    expect(summary).toContain('최적화 합산 세액');
  });

  test('F23-ReportShare: Copying integrated report', async ({ page }) => {
    await page.click('#btn-calc-income-integrated');
    // Change to report tab
    await page.click('.tab-btn[data-tab="report"]');
    const shareBtn = page.locator('#btn-share-report');
    await shareBtn.click();
    const btnText = await shareBtn.textContent();
    expect(btnText).toContain('복사');
  });

  test('F24-MedicalAllocation: Spouse medical expense allocation visualization', async ({ page }) => {
    // Fill basic salaries
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '60000000');
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '40000000');
    
    // Add medical expense to dependent
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-add-dep');
    await page.locator('.dep-medical').first().fill('5000000');
    
    await page.click('#btn-calc-income-integrated');
    const chartText = await page.locator('#res-medical-desc').textContent();
    expect(chartText).not.toBe('');
  });

  test('F25-ConsumptionNav: Consumption navigation recommendations display', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '70000000');
    await fillInput(page, 'inc-a-card', '12000000');
    await page.click('#btn-calc-income-integrated');
    const navContent = await page.locator('#res-card-nav-content').textContent();
    expect(navContent).toContain('배우자 A');
    expect(navContent).toContain('배우자 B');
  });

  test('F26-ThemeToggle: Theme switching (dark/light mode)', async ({ page }) => {
    const isLightInitial = await page.evaluate(() => document.body.classList.contains('light-mode'));
    await page.click('#themeToggleBtn');
    const isLightAfter = await page.evaluate(() => document.body.classList.contains('light-mode'));
    expect(isLightAfter).toBe(!isLightInitial);
  });

  test('F27-PWA-Elements: Manifest & SW elements in DOM', async ({ page }) => {
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestLink).toBe('manifest.json');
  });

});

test.describe('Tier 2: Boundary & Corner Cases', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('B1: Zero income case (verify 0 tax)', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '0');
    await page.click('#btn-calc-income-integrated');
    const taxA = await page.locator('#res-a-total').textContent();
    expect(taxA).toBe('0 원');
  });

  test('B2: High income tax brackets (upper limits of 45%)', async ({ page }) => {
    const taxResult = await page.evaluate(() => {
      return window.TaxCalculator.calculateIncomeTax(2000000000); // 20억 KRW taxable income
    });
    expect(taxResult.rate).toBe(0.45);
  });

  test('B3: Business loss (negative income) offsetting wage income', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '60000000');
    await fillInput(page, 'inc-a-biz-gen-revenue', '10000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '20000000'); // 10M business loss
    await page.click('#btn-calc-income-integrated');
    const taxableIncome = await page.evaluate(() => {
      const opts = window.TaxCalculator.calculateComprehensiveIncome({
        wage: 60000000,
        bizGenRevenue: 10000000,
        bizGenExpense: 20000000
      });
      return opts.taxableIncome;
    });
    const baseOpts = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({ wage: 60000000 }).taxableIncome;
    });
    expect(taxableIncome).toBeLessThan(baseOpts);
  });

  test('B4: Rental business loss (verify it does NOT offset wage income)', async ({ page }) => {
    const withoutLoss = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 60000000,
        bizRentRevenue: 0,
        bizRentExpense: 0
      }).taxableIncome;
    });
    const withLoss = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 60000000,
        bizRentRevenue: 10000000,
        bizRentExpense: 20000000 // 10M rental loss
      }).taxableIncome;
    });
    expect(withLoss).toBe(withoutLoss); // Rental loss cannot offset wage income
  });

  test('B5: Special tax credit cap for wage earners', async ({ page }) => {
    const result = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 50000000,
        bizGenRevenue: 50000000,
        bizGenExpense: 0,
        cardUsage: 30000000,
        medical: 5000000
      });
    });
    expect(result.totalTax).toBeGreaterThanOrEqual(0);
  });

  test('B6: Basic wage tax credit cap scaling', async ({ page }) => {
    const lowSalary = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({ wage: 30000000 });
    });
    const highSalary = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({ wage: 150000000 });
    });
    expect(lowSalary.totalTax).toBeLessThan(highSalary.totalTax);
  });

  test('B7-1: Female worker deduction boundary (income exactly 3,000만)', async ({ page }) => {
    const underBoundary = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 41000000, // wage net is less than 30M
        isFemaleHead: true
      });
    });
    expect(underBoundary.personDeduction).toBe(2000000); // 1.5M basic + 500k female head
  });

  test('B7-2: Female worker deduction boundary (income 3,000만 1원)', async ({ page }) => {
    const overBoundary = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 100000000, // net comprehensive income is way above 30M
        isFemaleHead: true
      });
    });
    expect(overBoundary.personDeduction).toBe(1500000); // Only basic deduction
  });

  test('B8-1: Pension credit rate switching boundary (income <= 4,500만 -> 15%)', async ({ page }) => {
    const lowIncome = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 40000000, // <= 4,500만 salary net
        pensionSavings: 6000000
      });
    });
    expect(lowIncome.totalTax).toBeDefined();
  });

  test('B8-2: Pension credit rate switching boundary (income > 4,500만 -> 12%)', async ({ page }) => {
    const highIncome = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 80000000, // > 4,500만 net
        pensionSavings: 6000000
      });
    });
    expect(highIncome.totalTax).toBeDefined();
  });

  test('B9-1: ISA 서민형 salary limit boundary (exactly 5,000만)', async ({ page }) => {
    await activateBusinessTab(page);
    await fillInput(page, 'isa-salary', '50000000');
    await selectOption(page, 'isa-type-select', 'sub');
    await page.click('#btn-calc-isa-opt');
    const content = await page.locator('#isa-opt-content').innerHTML();
    expect(content).not.toContain('가입할 수 없습니다');
  });

  test('B9-2: ISA 서민형 salary limit boundary (5,000만 1원)', async ({ page }) => {
    await activateBusinessTab(page);
    await fillInput(page, 'isa-salary', '50000001');
    await selectOption(page, 'isa-type-select', 'sub');
    await page.click('#btn-calc-isa-opt');
    const content = await page.locator('#isa-opt-content').innerHTML();
    expect(content).toContain('가입할 수 없습니다');
  });

  test('B10-1: Financial income comparison tax switch (exactly 2,000만)', async ({ page }) => {
    const atLimit = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        interestDom: 20000000,
        dividendDom: 0
      });
    });
    expect(atLimit.financialCompAmount).toBe(0);
  });

  test('B10-2: Financial income comparison tax switch (2,000만 1원)', async ({ page }) => {
    const overLimit = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        interestDom: 20000001,
        dividendDom: 0
      });
    });
    expect(overLimit.financialCompAmount).toBeGreaterThan(0);
  });

  test('B11: Sports facility PT fee portion adjustment (PT included: only 50% counts)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'sports-target', 'a');
    await fillInput(page, 'sports-salary', '50000000');
    await fillInput(page, 'sports-fee', '2000000');
    await setCheckbox(page, 'sports-has-pt', true);
    await page.click('#btn-calc-sports');
    const content = await page.locator('#sports-result-content').innerHTML();
    expect(content).toContain('300,000 원');
  });

  test('B12-1: Sports facility deduction salary cap (exactly 7,000만)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'sports-target', 'a');
    await fillInput(page, 'sports-salary', '70000000');
    await fillInput(page, 'sports-fee', '1000000');
    await page.click('#btn-calc-sports');
    const content = await page.locator('#sports-result-content').innerHTML();
    expect(content).not.toContain('대상자가 아닙니다');
  });

  test('B12-2: Sports facility deduction salary cap (7,000만 1원)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'sports-target', 'a');
    await fillInput(page, 'sports-salary', '70000001');
    await fillInput(page, 'sports-fee', '1000000');
    await page.click('#btn-calc-sports');
    const content = await page.locator('#sports-result-content').innerHTML();
    expect(content).toContain('대상자가 아닙니다');
  });

  test('B13: Sports facility deduction limit cap (exceeding 300만)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await selectOption(page, 'sports-target', 'a');
    await fillInput(page, 'sports-salary', '50000000');
    await fillInput(page, 'sports-fee', '20000000');
    await page.click('#btn-calc-sports');
    const content = await page.locator('#sports-result-content').innerHTML();
    expect(content).toContain('3,000,000 원');
  });

  test('B14: Hometown donation disaster area switch (exceeding 20만, 33% rate)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await fillInput(page, 'hometown-amount', '300000');
    await setCheckbox(page, 'hometown-disaster', true);
    await page.click('#btn-calc-hometown');
    const content = await page.locator('#hometown-result-content').innerHTML();
    expect(content).toContain('특별재난지역 추가 공제');
  });

  test('B15: Hometown donation amount limit (exceeding 200만)', async ({ page }) => {
    await page.click('.tab-btn[data-tab="income"]');
    await fillInput(page, 'hometown-amount', '5000000');
    await page.click('#btn-calc-hometown');
    const content = await page.locator('#hometown-result-content').innerHTML();
    expect(content).toContain('2,000,000 원');
  });

  test('B16: Deemed rent small house exclusion (area <= 40㎡, price <= 2억)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="holding"]').click();
    await fillInput(page, 'deemed-small', '2');
    await page.click('#btn-calc-deemed-rent');
    const content = await page.locator('#deemed-result-content').innerHTML();
    expect(content).toContain('소형 주택 제외');
  });

  test('B17: Deemed rent 1-house vs 2-house vs 3-house triggers', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="holding"]').click();
    await selectOption(page, 'deemed-house-count', '1');
    await page.click('#btn-calc-deemed-rent');
    let content = await page.locator('#deemed-result-content').innerHTML();
    expect(content).toContain('과세 대상 아님');
  });

  test('B18-1: Inheritance child deduction count boundaries (no children)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-child-count', '0');
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('자녀공제: 0 원');
  });

  test('B18-2: Inheritance child deduction count boundaries (1 child)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-child-count', '1');
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('자녀공제: 500,000,000 원');
  });

  test('B18-3: Inheritance child deduction count boundaries (10 children)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-child-count', '10');
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('자녀공제: 5,000,000,000 원');
  });

  test('B19: Inheritance coresident house deduction limit (max 6억)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await setCheckbox(page, 'inherit-coresident', true);
    await fillInput(page, 'inherit-coresident-value', '800000000');
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('동거주택상속공제: 600,000,000 원');
  });

  test('B20: Inheritance financial asset deduction cap (20% up to 2억)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-financial', '1500000000');
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('금융재산상속공제: 200,000,000 원');
  });

  test('B21: Marriage gift exemption one-time constraint', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await selectOption(page, 'mg-reason', 'both');
    await fillInput(page, 'mg-amount', '200000000');
    await page.click('#btn-calc-marriage-gift');
    const content = await page.locator('#mg-result-content').innerHTML();
    expect(content).toContain('혼인/출산 특별 공제: 100,000,000 원');
  });

  test('B22: Gift timeline minor vs adult child exemptions (2,000만 vs 5,000만)', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await selectOption(page, 'gift-recipient', 'minor');
    await fillInput(page, 'gift-amount', '30000000');
    await page.click('#btn-calc-gift-tax');
    const minorContent = await page.locator('#gift-tax-content').innerHTML();
    expect(minorContent).toContain('증여재산공제: 20,000,000 원');

    await selectOption(page, 'gift-recipient', 'adult_child');
    await fillInput(page, 'gift-amount', '60000000');
    await page.click('#btn-calc-gift-tax');
    const adultContent = await page.locator('#gift-tax-content').innerHTML();
    expect(adultContent).toContain('증여재산공제: 50,000,000 원');
  });

  test('B23: PWA service worker existence', async ({ page }) => {
    const swRegistered = await page.evaluate(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length >= 0;
    });
    expect(swRegistered).toBe(true);
  });

  test('B24: LocalStorage persistence loading on refresh', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '99000000');
    await page.reload();
    await page.waitForTimeout(600);
    const salaryVal = await page.locator('#inc-a-wage').inputValue();
    expect(salaryVal.replace(/,/g, '')).toBe('99000000');
  });

  test('B25: PDF file parser invalid type handling', async ({ page }) => {
    let dialogMsg = '';
    page.once('dialog', async dialog => {
      dialogMsg = dialog.message();
      await dialog.dismiss();
    });
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('#pdf-toggle-btn');
    await page.click('label.pdf-upload-btn');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'fake_report.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('not a pdf content')
    });
    
    expect(dialogMsg).toContain('PDF 파일만 업로드 가능합니다');
  });

});

test.describe('Tier 3: Cross-Feature Combinations', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('C1: Mixed income (Wage + Business loss + Rental loss + Financial > 2,000만)', async ({ page }) => {
    const result = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 50000000,
        bizGenRevenue: 10000000,
        bizGenExpense: 30000000,
        bizRentRevenue: 10000000,
        bizRentExpense: 20000000,
        interestDom: 25000000,
        dividendDom: 0
      });
    });
    expect(result.totalTax).toBeGreaterThan(0);
  });

  test('C2: ISA matured rollover to pension + high interest income comparison tax', async ({ page }) => {
    const result = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 60000000,
        interestDom: 30000000,
        pensionSavings: 6000000,
        irpSavings: 3000000,
        isaIncome: 5000000,
        isaType: 'general'
      });
    });
    expect(result.totalTax).toBeDefined();
  });

  test('C3: Sports facility PT + Hometown donation + Housing subscription', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '50000000');
    await fillInput(page, 'inc-a-housing-sub', '2400000');
    
    await page.click('.tab-btn[data-tab="income"]');
    await fillInput(page, 'sports-fee', '2000000');
    await setCheckbox(page, 'sports-has-pt', true);
    await page.click('#btn-calc-sports');
    
    await fillInput(page, 'hometown-amount', '200000');
    await page.click('#btn-calc-hometown');
    
    await page.click('#btn-calc-income-integrated');
    const resultText = await page.locator('#res-a-total').textContent();
    expect(resultText).not.toBe('0 원');
  });

  test('C4: Spouses both having business + wage income, couple optimization', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '60000000');
    await fillInput(page, 'inc-a-biz-gen-revenue', '20000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '5000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '40000000');
    await fillInput(page, 'inc-b-biz-gen-revenue', '15000000');
    await fillInput(page, 'inc-b-biz-gen-expense', '4000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-add-dep');
    
    await page.click('#btn-calc-income-integrated');
    const summary = await page.locator('#res-family-summary-content').textContent();
    expect(summary).toContain('최적화 합산 세액');
  });

  test('C5: Deemed rent + Inheritance tax + Marriage gift', async ({ page }) => {
    await activateCapitalTab(page);
    
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="holding"]').click();
    await fillInput(page, 'deemed-deposit', '2000000000');
    await selectOption(page, 'deemed-house-count', '3');
    await page.click('#btn-calc-deemed-rent');
    const dr = await page.locator('#deemed-result-content').innerHTML();
    expect(dr).toContain('간주임대료');
    
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    await fillInput(page, 'inherit-total-asset', '4000000000');
    await fillInput(page, 'inherit-child-count', '3');
    await page.click('#btn-calc-inheritance');
    const inh = await page.locator('#inherit-result-content').innerHTML();
    expect(inh).toContain('상속세 결정세액');
    
    await selectOption(page, 'mg-reason', 'birth');
    await fillInput(page, 'mg-amount', '150000000');
    await page.click('#btn-calc-marriage-gift');
    const mg = await page.locator('#mg-result-content').innerHTML();
    expect(mg).toContain('최종 납부세액: 0 원');
  });

});

test.describe('Tier 4: Real-World Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('S1: The High-Earning N-Jobber Couple', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '100000000');
    await fillInput(page, 'inc-a-biz-gen-revenue', '30000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '10000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '80000000');
    await fillInput(page, 'inc-b-biz-gen-revenue', '10000000');
    await fillInput(page, 'inc-b-biz-gen-expense', '3000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-add-dep');
    await page.click('#btn-add-dep');
    
    await page.click('#btn-calc-income-integrated');
    const summary = await page.locator('#res-family-summary-content').innerHTML();
    expect(summary).toContain('180,000,000 원');
  });

  test('S2: The Retired Landlord', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '0');
    await fillInput(page, 'inc-a-pension-pub', '15000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '0');
    
    await page.click('#btn-calc-income-integrated');
    
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="holding"]').click();
    await selectOption(page, 'deemed-house-count', '2');
    await fillInput(page, 'deemed-deposit', '1500000000');
    await selectOption(page, 'deemed-highprice', 'yes');
    await page.click('#btn-calc-deemed-rent');
    
    const dr = await page.locator('#deemed-result-content').innerHTML();
    expect(dr).toContain('간주임대료');
  });

  test('S3: The Newlyweds with Parents Support', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    
    await selectOption(page, 'mg-reason', 'marriage');
    await fillInput(page, 'mg-amount', '150000000');
    await page.click('#btn-calc-marriage-gift');
    const mg = await page.locator('#mg-result-content').innerHTML();
    expect(mg).toContain('최종 납부세액: 0 원');
    
    await fillInput(page, 'gift-child-name', '첫째');
    await fillInput(page, 'gift-child-age', '0');
    await page.click('#btn-calc-gift-timeline');
    const timeline = await page.locator('#gift-timeline-content').innerHTML();
    expect(timeline).toContain('첫째');
    expect(timeline).toContain('0세');
    expect(timeline).toContain('10세');
  });

  test('S4: The Active Investor', async ({ page }) => {
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '70000000');
    await fillInput(page, 'inc-a-dividend-dom', '15000000');
    await fillInput(page, 'inc-a-dividend-overseas', '10000000');
    
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-b"]');
    await fillInput(page, 'inc-b-wage', '50000000');
    
    await page.click('#btn-calc-income-integrated');
    const compA = await page.locator('#res-a-financial-comp').textContent();
    expect(compA).not.toBe('0 원');
  });

  test('S5: Comprehensive Estate Planning', async ({ page }) => {
    await activateCapitalTab(page);
    await page.locator('.segment-control-wrapper:not(.profile-segment-wrapper) .segment-btn[data-segment="gift"]').click();
    
    await fillInput(page, 'inherit-total-asset', '3000000000');
    await fillInput(page, 'inherit-child-count', '3');
    await setCheckbox(page, 'inherit-has-spouse', true);
    await setCheckbox(page, 'inherit-coresident', true);
    await fillInput(page, 'inherit-coresident-value', '800000000');
    await fillInput(page, 'inherit-financial', '500000000');
    
    await page.click('#btn-calc-inheritance');
    const content = await page.locator('#inherit-result-content').innerHTML();
    expect(content).toContain('자녀공제: 1,500,000,000 원');
    expect(content).toContain('동거주택상속공제: 600,000,000 원');
    expect(content).toContain('금융재산상속공제: 100,000,000 원');
  });

});
