const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log("=== STARTING CHALLENGER M3 VERIFICATION ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Handle page errors
  page.on('pageerror', err => {
    console.error('Browser Page Error:', err.message);
  });

  const url = 'file:///' + path.resolve(__dirname, 'index.html');
  await page.goto(url);
  console.log("Loaded index.html successfully.");

  // Helper to fill inputs
  async function fillInput(id, val) {
    const selector = `#${id}`;
    await page.fill(selector, '');
    await page.fill(selector, val.toString());
    await page.dispatchEvent(selector, 'input');
    await page.dispatchEvent(selector, 'change');
    await page.dispatchEvent(selector, 'blur');
  }

  // Helper to select options
  async function selectOption(id, val) {
    const selector = `#${id}`;
    await page.selectOption(selector, val);
    await page.dispatchEvent(selector, 'change');
  }

  // Helper to click elements
  async function clickElement(selector) {
    await page.click(selector);
  }

  // Helper to clear localStorage
  async function clearLocalStorage() {
    await page.evaluate(() => {
      localStorage.clear();
    });
  }

  // Results tracker
  const results = {
    test1: null,
    test2: null,
    test3: null,
    test4: null,
    test5: null
  };

  try {
    // -------------------------------------------------------------
    // Test Case 1: No special credit leakage
    // -------------------------------------------------------------
    console.log("\n--- Running Test 1: No special credit leakage ---");
    await clearLocalStorage();
    await page.reload();

    // Spouse A: business income only (Wage = 0, BizGenRevenue = 60M, BizGenExpense = 20M)
    // Enter credit card and medical expenses
    await fillInput('inc-a-wage', '0');
    await fillInput('inc-a-biz-gen-revenue', '60000000');
    await fillInput('inc-a-biz-gen-expense', '20000000');
    await fillInput('inc-a-card', '15000000'); // 15M card
    
    const calc1 = await page.evaluate(() => {
      return TaxCalculator.calculateComprehensiveIncome({
        wage: 0,
        bizGenRevenue: 60000000,
        bizGenExpense: 20000000,
        cardUsage: 15000000,
        medicalExpense: 5000000
      });
    });

    console.log(`Wage = 0, Biz = 40M net. Card Usage = 15M, Medical = 5M`);
    console.log(`Calculated Card Deduction: ${calc1.cardDeduction} KRW`);
    console.log(`Calculated Medical Credit: ${calc1.medicalCredit} KRW`);
    console.log(`Calculated Special Credit Sum: ${calc1.insuranceCredit + calc1.medicalCredit + calc1.eduCredit + calc1.donationCredit} KRW`);

    const isTest1Passed = (calc1.cardDeduction === 0 && calc1.medicalCredit === 0);
    results.test1 = {
      passed: isTest1Passed,
      cardDeduction: calc1.cardDeduction,
      medicalCredit: calc1.medicalCredit
    };
    console.log(`Test 1 Result: ${isTest1Passed ? "PASS" : "FAIL"}`);

    // -------------------------------------------------------------
    // Test Case 2: Compared tax calculations
    // -------------------------------------------------------------
    console.log("\n--- Running Test 2: Compared tax calculations ---");
    // Under Korean Tax Law, if financial income > 20M:
    // Tax1 = progressive tax on (non-financial income + financial income - 20M - deductions) + 14% on 20M
    // Tax2 = progressive tax on (non-financial income - deductions) + 14% on total financial income
    // The calculated tax must be Math.max(Tax1, Tax2), which is not lower than Tax2 (the comparison tax)
    const calc2 = await page.evaluate(() => {
      // Setup a profile with:
      // Wage = 10M, Financial = 30M
      const profile = {
        wage: 10000000,
        interestDom: 30000000,
        dividendDom: 0
      };
      const res = TaxCalculator.calculateComprehensiveIncome(profile);
      
      // Manually calculate Tax1 and Tax2 using TaxCalculator
      const totalFinancial = 30000000;
      const financialCompAmount = 10000000; // 30M - 20M
      
      const wageIncomeAmount = 10000000 - TaxCalculator.calculateSalaryDeduction(10000000); // 10M - 5.5M = 4.5M
      const TotalComprehensiveIncome = wageIncomeAmount + financialCompAmount; // 4.5M + 10M = 14.5M
      
      // Deductions: 1.5M for Spouse A (dependentsCount = 0)
      const personDeduction = 1500000; 
      const wageDeductions = 0;
      
      const taxableIncome = Math.max(0, TotalComprehensiveIncome - personDeduction - wageDeductions); // 14.5M - 1.5M = 13M
      const taxableIncomeWithoutFinancial = Math.max(0, TotalComprehensiveIncome - financialCompAmount - personDeduction - wageDeductions); // 4.5M - 1.5M = 3M
      
      const Tax1 = TaxCalculator.calculateIncomeTax(taxableIncome).tax + Math.floor(20000000 * 0.14); // Tax on 13M (rate 6%) = 780,000 + 2.8M = 3,580,000
      const Tax2 = TaxCalculator.calculateIncomeTax(taxableIncomeWithoutFinancial).tax + Math.floor(totalFinancial * 0.14); // Tax on 3M (rate 6%) = 180,000 + 4.2M = 4,380,000
      
      return {
        calculatedTax: res.calculatedTax,
        Tax1: Tax1,
        Tax2: Tax2,
        isMax: res.calculatedTax === Math.max(Tax1, Tax2)
      };
    });

    console.log(`Wage = 10M, Financial = 30M`);
    console.log(`Tax1 (Progressive + 14% on 20M): ${calc2.Tax1} KRW`);
    console.log(`Tax2 (Progressive without financial + 14% on 30M): ${calc2.Tax2} KRW`);
    console.log(`Calculated Tax in Engine: ${calc2.calculatedTax} KRW`);
    console.log(`Is Calculated Tax equal to Math.max(Tax1, Tax2)? ${calc2.isMax}`);

    const isTest2Passed = calc2.isMax && (calc2.calculatedTax >= calc2.Tax2);
    results.test2 = {
      passed: isTest2Passed,
      calculatedTax: calc2.calculatedTax,
      Tax1: calc2.Tax1,
      Tax2: calc2.Tax2
    };
    console.log(`Test 2 Result: ${isTest2Passed ? "PASS" : "FAIL"}`);

    // -------------------------------------------------------------
    // Test Case 3: Loss offset leakage
    // -------------------------------------------------------------
    console.log("\n--- Running Test 3: Loss offset leakage ---");
    const calc3 = await page.evaluate(() => {
      // Setup: Wage = 50M, General Biz Net = -15M, Rental Biz Net = -15M
      const profile = {
        wage: 50000000,
        bizGenRevenue: 10000000,
        bizGenExpense: 25000000, // -15M general biz
        bizRentRevenue: 10000000,
        bizRentExpense: 25000000  // -15M rental biz
      };
      
      const res = TaxCalculator.calculateComprehensiveIncome(profile);
      
      const wageIncomeAmount = 50000000 - TaxCalculator.calculateSalaryDeduction(50000000); // 50M - 12.25M = 37.75M
      const bizGenIncomeAmount = -15000000;
      const bizRentIncomeAmount = 0; // capped at 0
      
      const expectedCompIncome = wageIncomeAmount + bizGenIncomeAmount + bizRentIncomeAmount;
      
      return {
        wageIncomeAmount: wageIncomeAmount,
        bizGenIncomeAmount: res.bizGenIncomeAmount,
        bizRentIncomeAmount: res.bizRentIncomeAmount,
        TotalComprehensiveIncome: res.TotalComprehensiveIncome,
        expectedCompIncome: expectedCompIncome,
        isCorrect: res.TotalComprehensiveIncome === expectedCompIncome
      };
    });

    console.log(`Wage Income Amount: ${calc3.wageIncomeAmount} KRW`);
    console.log(`Biz Gen Income Amount: ${calc3.bizGenIncomeAmount} KRW`);
    console.log(`Biz Rent Income Amount: ${calc3.bizRentIncomeAmount} KRW`);
    console.log(`Total Comprehensive Income: ${calc3.TotalComprehensiveIncome} KRW`);
    console.log(`Expected Comprehensive Income: ${calc3.expectedCompIncome} KRW`);
    console.log(`Is loss offset correct? ${calc3.isCorrect}`);

    const isTest3Passed = calc3.isCorrect && (calc3.bizRentIncomeAmount === 0) && (calc3.bizGenIncomeAmount < 0);
    results.test3 = {
      passed: isTest3Passed,
      TotalComprehensiveIncome: calc3.TotalComprehensiveIncome,
      bizGenIncomeAmount: calc3.bizGenIncomeAmount,
      bizRentIncomeAmount: calc3.bizRentIncomeAmount
    };
    console.log(`Test 3 Result: ${isTest3Passed ? "PASS" : "FAIL"}`);

    // -------------------------------------------------------------
    // Test Case 4: State persistence
    // -------------------------------------------------------------
    console.log("\n--- Running Test 4: State persistence ---");
    await clearLocalStorage();
    await page.reload();

    const inputsSpouseA = {
      'inc-a-wage': 75000000,
      'inc-a-biz-gen-revenue': 20000000,
      'inc-a-biz-gen-expense': 5000000,
      'inc-a-biz-rent-revenue': 12000000,
      'inc-a-biz-rent-expense': 3000000,
      'inc-a-interest-dom': 8000000,
      'inc-a-dividend-dom': 4000000,
      'inc-a-interest-overseas': 2000000,
      'inc-a-dividend-overseas': 1000000,
      'inc-a-pension-pub': 6000000,
      'inc-a-pension-pri': 5000000,
      'inc-a-other-revenue': 10000000,
      'inc-a-other-expense': 2000000
    };

    const inputsSpouseB = {
      'inc-b-wage': 45000000,
      'inc-b-biz-gen-revenue': 15000000,
      'inc-b-biz-gen-expense': 4000000,
      'inc-b-biz-rent-revenue': 8000000,
      'inc-b-biz-rent-expense': 2000000,
      'inc-b-interest-dom': 5000000,
      'inc-b-dividend-dom': 2000000,
      'inc-b-interest-overseas': 1000000,
      'inc-b-dividend-overseas': 500000,
      'inc-b-pension-pub': 4000000,
      'inc-b-pension-pri': 3000000,
      'inc-b-other-revenue': 5000000,
      'inc-b-other-expense': 1000000
    };

    console.log("Filling Spouse A inputs...");
    // Spouse A is active by default
    for (const [id, val] of Object.entries(inputsSpouseA)) {
      await fillInput(id, val);
    }

    // Toggle unit for Spouse A wage
    await page.evaluate(() => {
      const el = document.getElementById('inc-a-wage');
      const group = el.parentNode.querySelector('.unit-toggle-group');
      if (group) {
        const manBtn = Array.from(group.querySelectorAll('.unit-toggle-btn')).find(b => b.textContent === '만원');
        if (manBtn) {
          manBtn.click();
        }
      }
    });

    console.log("Switching to Spouse B view...");
    await clickElement('.segment-btn[data-segment="profile-b"]');

    console.log("Filling Spouse B inputs...");
    for (const [id, val] of Object.entries(inputsSpouseB)) {
      await fillInput(id, val);
    }

    // Wait to let auto-save fire (500ms debounce)
    await page.waitForTimeout(600);

    // Get value from localStorage
    const savedStateStr = await page.evaluate(() => localStorage.getItem('tax_calculator_state'));
    const savedState = JSON.parse(savedStateStr);
    console.log("Saved state keys:", Object.keys(savedState.statics).length);

    // Reload page
    await page.reload();
    console.log("Page reloaded.");

    // Verify inputs are restored
    let allRestoredCorrectly = true;
    const restoreDetails = {};

    console.log("Verifying Spouse A restored values...");
    // Spouse A is active on reload
    for (const [id, originalVal] of Object.entries(inputsSpouseA)) {
      const elValue = await page.locator(`#${id}`).inputValue();
      const elUnit = await page.locator(`#${id}`).getAttribute('data-unit');
      const numericVal = parseInt(elValue.replace(/,/g, ''), 10);
      const isCorrectValue = numericVal === originalVal;
      const isFormatted = elValue.includes(',');
      const isUnitWon = elUnit === 'won';
      
      if (!isCorrectValue || !isFormatted || !isUnitWon) {
        allRestoredCorrectly = false;
        console.log(`Failed restore for ${id}: displayed="${elValue}", data-unit="${elUnit}", expected=${originalVal}`);
      }
      restoreDetails[id] = { displayed: elValue, unit: elUnit, correct: isCorrectValue && isFormatted && isUnitWon };
    }

    // Switch to Spouse B to verify Spouse B inputs
    console.log("Switching to Spouse B view to verify...");
    await clickElement('.segment-btn[data-segment="profile-b"]');

    for (const [id, originalVal] of Object.entries(inputsSpouseB)) {
      const elValue = await page.locator(`#${id}`).inputValue();
      const elUnit = await page.locator(`#${id}`).getAttribute('data-unit');
      const numericVal = parseInt(elValue.replace(/,/g, ''), 10);
      const isCorrectValue = numericVal === originalVal;
      const isFormatted = elValue.includes(',');
      const isUnitWon = elUnit === 'won';
      
      if (!isCorrectValue || !isFormatted || !isUnitWon) {
        allRestoredCorrectly = false;
        console.log(`Failed restore for ${id}: displayed="${elValue}", data-unit="${elUnit}", expected=${originalVal}`);
      }
      restoreDetails[id] = { displayed: elValue, unit: elUnit, correct: isCorrectValue && isFormatted && isUnitWon };
    }

    // Check unit toggle button for Spouse A wage is 'won' (active) after reload (switch back to A to make it visible)
    await clickElement('.segment-btn[data-segment="profile-a"]');
    const isWageToggleWonActive = await page.evaluate(() => {
      const el = document.getElementById('inc-a-wage');
      const group = el.parentNode.querySelector('.unit-toggle-group');
      if (group) {
        const wonBtn = Array.from(group.querySelectorAll('.unit-toggle-btn')).find(b => b.textContent === '원');
        return wonBtn && wonBtn.classList.contains('active');
      }
      return false;
    });

    console.log(`Is Spouse A wage unit toggle 'won' active? ${isWageToggleWonActive}`);
    const isTest4Passed = allRestoredCorrectly && isWageToggleWonActive;
    results.test4 = {
      passed: isTest4Passed,
      restoredCount: Object.keys(restoreDetails).length,
      details: restoreDetails
    };
    console.log(`Test 4 Result: ${isTest4Passed ? "PASS" : "FAIL"}`);

    // -------------------------------------------------------------
    // Test Case 5: ISA Validation
    // -------------------------------------------------------------
    console.log("\n--- Running Test 5: ISA Validation ---");
    // Clear page inputs first
    await clearLocalStorage();
    await page.reload();

    async function checkValidationMsg(wage, genRev, genExp, type) {
      await page.reload();
      await fillInput('inc-a-wage', wage);
      await fillInput('inc-a-biz-gen-revenue', genRev);
      await fillInput('inc-a-biz-gen-expense', genExp);
      await selectOption('inc-a-isa-type', type);
      
      // Click Calculate button
      await clickElement('#btn-calc-income-integrated');
      
      // Check if inline error is shown
      const errorEl = page.locator('#income-form-error');
      const isVisible = await errorEl.isVisible();
      const text = isVisible ? await errorEl.textContent() : '';
      return { isVisible, text };
    }

    // Scenario A: Wage > 50M but Comp Income <= 38M (only one threshold exceeded)
    // Wage = 60M, general biz loss = -30M
    // Comp Income = (60M - deduction) - 30M = 47.25M - 30M = 17.25M (<= 38M)
    console.log("Scenario A: Wage = 60M, Biz Loss = -30M (Comp Income <= 38M)");
    const resA = await checkValidationMsg('60000000', '10000000', '40000000', 'sub');
    console.log(`Error visible: ${resA.isVisible}, Text: "${resA.text}"`);

    // Scenario B: Wage <= 50M but Comp Income > 38M (only one threshold exceeded)
    // Wage = 40M, general biz profit = 20M
    // Comp Income = (40M - deduction) + 20M = 28.75M + 20M = 48.75M (> 38M)
    console.log("Scenario B: Wage = 40M, Biz Profit = +20M (Comp Income > 38M)");
    const resB = await checkValidationMsg('40000000', '30000000', '10000000', 'sub');
    console.log(`Error visible: ${resB.isVisible}, Text: "${resB.text}"`);

    // Scenario C: Both thresholds exceeded
    // Wage = 60M, general biz profit = 0
    // Comp Income = (60M - deduction) = 47.25M (> 38M)
    console.log("Scenario C: Wage = 60M, Biz profit = 0 (Comp Income > 38M)");
    const resC = await checkValidationMsg('60000000', '0', '0', 'sub');
    console.log(`Error visible: ${resC.isVisible}, Text: "${resC.text}"`);

    const isTest5Passed = (!resA.isVisible) && (!resB.isVisible) && resC.isVisible && resC.text.includes("서민형 자격 없음");
    results.test5 = {
      passed: isTest5Passed,
      scenarioA: { errorVisible: resA.isVisible, text: resA.text },
      scenarioB: { errorVisible: resB.isVisible, text: resB.text },
      scenarioC: { errorVisible: resC.isVisible, text: resC.text }
    };
    console.log(`Test 5 Result: ${isTest5Passed ? "PASS" : "FAIL"}`);

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await browser.close();
    
    // Write results to JSON file for report verification
    fs.writeFileSync('challenger_results.json', JSON.stringify(results, null, 2));
    console.log("\nResults written to challenger_results.json.");
    console.log("=== CHALLENGER VERIFICATION COMPLETE ===");
  }
})();
