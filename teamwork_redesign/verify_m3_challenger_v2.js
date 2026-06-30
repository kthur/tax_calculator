const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log("=== STARTING CHALLENGER M3 VERIFICATION V2 ===");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.error('Browser Page Error:', err.message);
  });
  page.on('console', msg => {
    console.log('PAGE CONSOLE:', msg.text());
  });

  const url = 'file:///' + path.resolve(__dirname, 'index.html');
  await page.goto(url);
  console.log("Loaded index.html successfully.");

  // Get all input[id] and select[id]
  const domIds = await page.evaluate(() => {
    const elms = document.querySelectorAll('input[id], select[id]');
    return Array.from(elms).map(el => ({ id: el.id, tagName: el.tagName, type: el.type, value: el.value }));
  });
  console.log(`\nFound ${domIds.length} input/select elements with IDs in index.html:`);
  console.log(domIds.map(d => `${d.tagName.toLowerCase()}#${d.id} (type: ${d.type}, default: "${d.value}")`).join('\n'));

  // Let's verify mismatches between index.html and app.js/store.js
  const expectedAppIds = [
    'inc-a-wage', 'inc-a-biz-gen-revenue', 'inc-a-biz-gen-expense', 'inc-a-biz-rent-revenue', 'inc-a-biz-rent-expense',
    'inc-a-interest-dom', 'inc-a-dividend-dom', 'inc-a-interest-overseas', 'inc-a-dividend-overseas',
    'inc-a-pension-pub', 'inc-a-pension-pri', 'inc-a-other-revenue', 'inc-a-other-expense'
  ];
  const missingIds = expectedAppIds.filter(id => !domIds.some(d => d.id === id));
  console.log(`\nID Mismatch Analysis:`);
  console.log(`The following IDs are expected by app.js/store.js but are MISSING from index.html:`);
  console.log(missingIds.join(', '));

  const results = {
    test1: null,
    test2: null,
    test3: null,
    test4: null,
    test5: null
  };

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

  try {
    // -------------------------------------------------------------
    // Test Case 1: No special credit leakage
    // -------------------------------------------------------------
    console.log("\n--- Running Test 1: No special credit leakage (Engine) ---");
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
    console.log("\n--- Running Test 2: Compared tax calculations (Engine) ---");
    const calc2 = await page.evaluate(() => {
      // Setup a profile with: Wage = 10M, Financial = 30M
      const profile = {
        wage: 10000000,
        interestDom: 30000000,
        dividendDom: 0
      };
      const res = TaxCalculator.calculateComprehensiveIncome(profile);
      
      const totalFinancial = 30000000;
      const financialCompAmount = 10000000; 
      
      const wageIncomeAmount = 10000000 - TaxCalculator.calculateSalaryDeduction(10000000); 
      const TotalComprehensiveIncome = wageIncomeAmount + financialCompAmount; 
      
      const personDeduction = 1500000; 
      const wageDeductions = 0;
      
      const taxableIncome = Math.max(0, TotalComprehensiveIncome - personDeduction - wageDeductions); 
      const taxableIncomeWithoutFinancial = Math.max(0, TotalComprehensiveIncome - financialCompAmount - personDeduction - wageDeductions); 
      
      const Tax1 = TaxCalculator.calculateIncomeTax(taxableIncome).tax + Math.floor(20000000 * 0.14); 
      const Tax2 = TaxCalculator.calculateIncomeTax(taxableIncomeWithoutFinancial).tax + Math.floor(totalFinancial * 0.14); 
      
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
    console.log("\n--- Running Test 3: Loss offset leakage (Engine) ---");
    const calc3 = await page.evaluate(() => {
      // Setup: Wage = 50M, General Biz Net = -15M, Rental Biz Net = -15M
      const profile = {
        wage: 50000000,
        bizGenRevenue: 10000000,
        bizGenExpense: 25000000, 
        bizRentRevenue: 10000000,
        bizRentExpense: 25000000  
      };
      
      const res = TaxCalculator.calculateComprehensiveIncome(profile);
      
      const wageIncomeAmount = 50000000 - TaxCalculator.calculateSalaryDeduction(50000000); 
      const bizGenIncomeAmount = -15000000;
      const bizRentIncomeAmount = 0; 
      
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
    console.log("\n--- Running Test 4: State persistence (UI with actual elements) ---");
    await clearLocalStorage();
    await page.reload();

    // Collect 26 actual IDs that exist in the DOM to test persistence
    const actualIdsToTest = domIds.filter(d => d.type === 'text' && d.id.startsWith('inc-a-')).map(d => d.id).slice(0, 13)
      .concat(domIds.filter(d => d.type === 'text' && d.id.startsWith('inc-b-')).map(d => d.id).slice(0, 13));
    
    console.log(`Selected ${actualIdsToTest.length} actual text inputs to test persistence:`);
    console.log(actualIdsToTest.join(', '));

    const testValues = {};
    actualIdsToTest.forEach((id, idx) => {
      testValues[id] = (idx + 1) * 1000000;
    });

    console.log("Filling Spouse A inputs...");
    for (const id of actualIdsToTest.filter(i => i.startsWith('inc-a-'))) {
      await fillInput(id, testValues[id]);
    }

    // Toggle unit for Spouse A salary
    const salaryId = actualIdsToTest.find(id => id.includes('salary'));
    if (salaryId) {
      console.log(`Toggling unit for ${salaryId} to '만원'`);
      await page.evaluate((sId) => {
        const el = document.getElementById(sId);
        const group = el.parentNode.querySelector('.unit-toggle-group');
        if (group) {
          const manBtn = Array.from(group.querySelectorAll('.unit-toggle-btn')).find(b => b.textContent === '만원');
          if (manBtn) manBtn.click();
        }
      }, salaryId);
    }

    console.log("Switching to Spouse B view...");
    await clickElement('.segment-btn[data-segment="profile-b"]');

    console.log("Filling Spouse B inputs...");
    for (const id of actualIdsToTest.filter(i => i.startsWith('inc-b-'))) {
      await fillInput(id, testValues[id]);
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

    let allRestoredCorrectly = true;
    const restoreDetails = {};

    console.log("Verifying Spouse A restored values...");
    for (const id of actualIdsToTest.filter(i => i.startsWith('inc-a-'))) {
      const elValue = await page.locator(`#${id}`).inputValue();
      const elUnit = await page.locator(`#${id}`).getAttribute('data-unit');
      const numericVal = parseInt(elValue.replace(/,/g, ''), 10);
      const isCorrectValue = numericVal === testValues[id];
      const isFormatted = elValue.includes(',');
      const isUnitWon = elUnit === 'won';
      
      if (!isCorrectValue || !isFormatted || !isUnitWon) {
        allRestoredCorrectly = false;
        console.log(`Failed restore for ${id}: displayed="${elValue}", data-unit="${elUnit}", expected=${testValues[id]}`);
      }
      restoreDetails[id] = { displayed: elValue, unit: elUnit, correct: isCorrectValue && isFormatted && isUnitWon };
    }

    console.log("Switching to Spouse B view to verify...");
    await clickElement('.segment-btn[data-segment="profile-b"]');

    for (const id of actualIdsToTest.filter(i => i.startsWith('inc-b-'))) {
      const elValue = await page.locator(`#${id}`).inputValue();
      const elUnit = await page.locator(`#${id}`).getAttribute('data-unit');
      const numericVal = parseInt(elValue.replace(/,/g, ''), 10);
      const isCorrectValue = numericVal === testValues[id];
      const isFormatted = elValue.includes(',');
      const isUnitWon = elUnit === 'won';
      
      if (!isCorrectValue || !isFormatted || !isUnitWon) {
        allRestoredCorrectly = false;
        console.log(`Failed restore for ${id}: displayed="${elValue}", data-unit="${elUnit}", expected=${testValues[id]}`);
      }
      restoreDetails[id] = { displayed: elValue, unit: elUnit, correct: isCorrectValue && isFormatted && isUnitWon };
    }

    // Switch back to A to verify unit toggle
    await clickElement('.segment-btn[data-segment="profile-a"]');
    const isSalaryToggleWonActive = salaryId ? await page.evaluate((sId) => {
      const el = document.getElementById(sId);
      const group = el.parentNode.querySelector('.unit-toggle-group');
      if (group) {
        const wonBtn = Array.from(group.querySelectorAll('.unit-toggle-btn')).find(b => b.textContent === '원');
        return wonBtn && wonBtn.classList.contains('active');
      }
      return false;
    }, salaryId) : false;

    console.log(`Is Spouse A salary unit toggle 'won' active? ${isSalaryToggleWonActive}`);
    const isTest4Passed = allRestoredCorrectly && isSalaryToggleWonActive;
    results.test4 = {
      passed: isTest4Passed,
      restoredCount: Object.keys(restoreDetails).length,
      details: restoreDetails
    };
    console.log(`Test 4 Result: ${isTest4Passed ? "PASS" : "FAIL"}`);

    // -------------------------------------------------------------
    // Test Case 5: ISA Validation
    // -------------------------------------------------------------
    console.log("\n--- Running Test 5: ISA Validation (Broken due to ID mismatch, testing logic) ---");
    // Since the validation checks:
    // if (d.aWage > 50000000 && totalIncomeVal > 38000000)
    // but d.aWage is gathered from parseVal("inc-a-wage"), which is always 0.
    // So in the actual page UI, setting ISA to 서민형 with high salary does NOT trigger validation error!
    // Let's verify this!
    await clearLocalStorage();
    await page.reload();

    // 1. Try to set inc-a-salary = 60M (which is Wage > 50M in UI)
    await fillInput('inc-a-salary', '60000000');
    await selectOption('inc-a-isa-type', 'sub');
    
    // Click Calculate button
    await clickElement('#btn-calc-income-integrated');
    
    const errorEl = page.locator('#income-form-error');
    const isVisible = await errorEl.isVisible();
    const text = isVisible ? await errorEl.textContent() : '';
    console.log(`UI Validation Triggered: ${isVisible}, Error text: "${text}"`);
    console.log(`(This confirms the UI validation is broken because it reads inc-a-wage which is 0, so 0 > 50M is false!)`);

    // Let's test the logic directly in the page environment by passing parameters directly
    const logicTest = await page.evaluate(() => {
      const dSuccess = {
        aWage: 60000000,
        aBizGenRevenue: 0,
        aBizGenExpense: 0,
        aIsaType: 'sub'
      };
      // Let's mock a validation call by mimicking the check in validateIncomeInputs:
      const aOpts = {
        totalIncome: dSuccess.aWage,
        incomeType: 'wage',
        expense: 0,
        wage: dSuccess.aWage,
        isaType: dSuccess.aIsaType
      };
      const aRes = TaxCalculator.calculateComprehensiveIncome(aOpts);
      const totalIncomeVal = aRes.TotalComprehensiveIncome;
      const isTriggered = dSuccess.aWage > 50000000 && totalIncomeVal > 38000000;
      
      return {
        aWage: dSuccess.aWage,
        TotalComprehensiveIncome: totalIncomeVal,
        isTriggered: isTriggered
      };
    });

    console.log(`Direct logic test: Wage = ${logicTest.aWage}, Comp Income = ${logicTest.TotalComprehensiveIncome}`);
    console.log(`Would validation trigger if correct IDs were read? ${logicTest.isTriggered}`);

    const isTest5Passed = (!isVisible) && logicTest.isTriggered;
    results.test5 = {
      passed: isTest5Passed,
      uiVisible: isVisible,
      logicTriggered: logicTest.isTriggered
    };
    console.log(`Test 5 Result: ${isTest5Passed ? "PASS (Behavior matches logic check and confirms bug)" : "FAIL"}`);

  } catch (error) {
    console.error("Test execution failed:", error);
  } finally {
    await browser.close();
    fs.writeFileSync('challenger_results.json', JSON.stringify(results, null, 2));
    console.log("\nResults written to challenger_results.json.");
    console.log("=== CHALLENGER VERIFICATION COMPLETE ===");
  }
})();
