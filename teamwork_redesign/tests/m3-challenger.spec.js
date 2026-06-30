const { test, expect } = require('@playwright/test');

// Helper to fill inputs reliably
async function fillInput(page, id, val) {
  const el = page.locator(`#${id}`);
  await el.fill('');
  await el.fill(val.toString());
  await el.dispatchEvent('input');
  await el.dispatchEvent('change');
}

test.describe('Milestone 3 UI input data parsing and validation tests', () => {

  test('1. No special credit leakage (Wage = 0, Business = 50M)', async ({ page }) => {
    await page.goto('/');

    // Select Spouse A segment
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');

    // Fill inputs: Wage = 0, Biz Gen Revenue = 50M, Biz Gen Expense = 10M, Card = 10M
    await fillInput(page, 'inc-a-wage', '0');
    await fillInput(page, 'inc-a-biz-gen-revenue', '50000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '10000000');
    await fillInput(page, 'inc-a-card', '10000000');

    // Add a dependent with medical expense = 5M
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    
    // Clear any existing dependents, then add one
    await page.evaluate(() => {
      document.querySelectorAll('#inc-couple-ye-people .btn-remove-person').forEach(b => b.click());
    });
    await page.click('#btn-add-couple-dep');
    const medicalInput = page.locator('#inc-couple-ye-people .person-card .opt-dep-medical').first();
    await medicalInput.fill('5000000');
    await medicalInput.dispatchEvent('input');
    await medicalInput.dispatchEvent('change');

    // Click calculate
    await page.click('#btn-calc-income-integrated');

    // Calculate directly and verify inside the browser context
    const aResult = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 0,
        bizGenRevenue: 50000000,
        bizGenExpense: 10000000,
        cardUsage: 10000000,
        medicalExpense: 5000000
      });
    });

    console.log('Task 1 - calculateComprehensiveIncome result:', aResult);
    expect(aResult.cardDeduction).toBe(0);
    expect(aResult.medicalCredit).toBe(0);
  });

  test('2. Compared tax calculations (Financial Income > 20M)', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(() => {
      // Interest = 30M (total financial > 20M), other income = 0
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 0,
        interestDom: 30000000
      });
    });

    console.log('Task 2 - calculateComprehensiveIncome result:', result);
    // Method 1: progressive tax on (other income + excess financial income) + 20M * 14%
    // Method 2: progressive tax on other income + total financial income * 14%
    // Since other income = 0, Method 2 = 0 + 30M * 0.14 = 4,200,000 KRW.
    // Method 1 = calculatedIncomeTax(10M) + 20M * 14% = 600,000 + 2,800,000 = 3,400,000 KRW.
    // Max(3.4M, 4.2M) = 4,200,000 KRW.
    expect(result.calculatedTax).toBe(4200000);
  });

  test('3. Loss offset leakage (Rental loss vs General business loss)', async ({ page }) => {
    await page.goto('/');

    const resRentalLoss = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 50000000,
        bizRentRevenue: 10000000,
        bizRentExpense: 20000000
      });
    });

    const resNoLoss = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 50000000,
        bizRentRevenue: 0,
        bizRentExpense: 0
      });
    });

    const resGenLoss = await page.evaluate(() => {
      return window.TaxCalculator.calculateComprehensiveIncome({
        wage: 50000000,
        bizGenRevenue: 10000000,
        bizGenExpense: 20000000
      });
    });

    console.log('Task 3 - Rental Loss TotalComprehensiveIncome:', resRentalLoss.TotalComprehensiveIncome);
    console.log('Task 3 - No Loss TotalComprehensiveIncome:', resNoLoss.TotalComprehensiveIncome);
    console.log('Task 3 - General Business Loss TotalComprehensiveIncome:', resGenLoss.TotalComprehensiveIncome);

    expect(resRentalLoss.TotalComprehensiveIncome).toBe(resNoLoss.TotalComprehensiveIncome);
    expect(resGenLoss.TotalComprehensiveIncome).toBeLessThan(resNoLoss.TotalComprehensiveIncome);
  });

  test('4. State persistence (Formatting and unit toggles)', async ({ page }) => {
    await page.goto('/');

    // Set wage to 'man' and input 5,000 (meaning 50M won)
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    
    await page.evaluate(() => {
      const el = document.getElementById('inc-a-wage');
      const unitBtns = el.closest('.form-group').querySelectorAll('.unit-toggle-btn');
      unitBtns[1].click(); // click 'man'
      el.value = '5,000';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Wait 1 second for debounced save
    await page.waitForTimeout(1000);

    // Reload the page
    await page.reload();

    const restoredInfo = await page.evaluate(() => {
      const el = document.getElementById('inc-a-wage');
      const activeBtn = el.closest('.form-group').querySelector('.unit-toggle-btn.active');
      return {
        value: el.value,
        unit: el.dataset.unit,
        activeBtnText: activeBtn ? activeBtn.textContent : null
      };
    });

    console.log('Task 4 - Restored wage input info:', restoredInfo);
    expect(restoredInfo.unit).toBe('man');
    expect(restoredInfo.value).toBe('5,000');
  });

  test('5. ISA Validation (서민형 eligibility boundaries)', async ({ page }) => {
    await page.goto('/');

    // CASE A: Both thresholds exceeded (wage > 50M AND comprehensive income > 38M)
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '51000000');
    await page.locator('#inc-a-isa-type').selectOption('sub');
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-calc-income-integrated');

    const errorTextA = await page.locator('#income-form-error').textContent();
    console.log('Task 5 - Case A error text:', errorTextA);
    expect(errorTextA).toContain('ISA 서민형 자격 없음');

    // Clear error
    await page.evaluate(() => {
      const el = document.getElementById('income-form-error');
      el.style.display = 'none';
      el.textContent = '';
    });

    // CASE B: Only wage > 50M exceeded (comprehensive income <= 38M)
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '51000000');
    await fillInput(page, 'inc-a-biz-gen-revenue', '10000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '30000000'); // 20M business loss
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-calc-income-integrated');

    const errorTextB = await page.locator('#income-form-error').textContent();
    console.log('Task 5 - Case B error text:', errorTextB);
    expect(errorTextB).not.toContain('ISA 서민형 자격 없음');

    // Clear error
    await page.evaluate(() => {
      const el = document.getElementById('income-form-error');
      el.style.display = 'none';
      el.textContent = '';
    });

    // CASE C: Only comprehensive income > 38M exceeded (wage <= 50M)
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
    await fillInput(page, 'inc-a-wage', '45000000');
    await fillInput(page, 'inc-a-biz-gen-revenue', '20000000');
    await fillInput(page, 'inc-a-biz-gen-expense', '0'); // comprehensive income will exceed 38M
    await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
    await page.click('#btn-calc-income-integrated');

    const errorTextC = await page.locator('#income-form-error').textContent();
    console.log('Task 5 - Case C error text:', errorTextC);
    expect(errorTextC).not.toContain('ISA 서민형 자격 없음');
  });

});
