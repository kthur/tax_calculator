const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadCalculator(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const context = { Math, console };
  vm.createContext(context);
  return vm.runInContext(code + '\nTaxCalculator;', context);
}

const originalPath = path.resolve(__dirname, 'tax-calculator.js');
const refactoredPath = path.resolve(__dirname, 'teamwork_redesign', 'tax-calculator.js');

const originalCalc = loadCalculator(originalPath);
const refactoredCalc = loadCalculator(refactoredPath);

let testFailures = 0;

function assertEquals(actual, expected, path = '', excludeKeys = []) {
  if (typeof expected === 'object' && expected !== null && actual !== null) {
    for (const key in expected) {
      if (excludeKeys.includes(key)) continue;
      assertEquals(actual[key], expected[key], path ? `${path}.${key}` : key, excludeKeys);
    }
  } else {
    if (actual !== expected) {
      console.error(`❌ DIFFERENCE at [${path}]: Expected ${expected}, got ${actual}`);
      testFailures++;
    }
  }
}

// ----------------------------------------------------
// 1. Backward Compatibility Mappings Check
// ----------------------------------------------------
console.log('--- Checking Backward Compatibility Mappings (excluding totalIncome metadata field) ---');

// Case A: Legacy Wage Profile
const legacyWageOpts = {
  incomeType: 'wage',
  totalIncome: 65000000,
  dependents: 3,
  pensionSavings: 4000000,
  irpSavings: 3000000,
  yellowUmbrella: 2000000,
  ventureInvestment: 5000000,
  financialGeneral: 12000000,
  financialOverseas: 4000000,
  isaIncome: 6000000,
  isaType: 'sub',
  bondSeparated: 3000000
};

const unifiedWageOpts = {
  wage: 65000000,
  dependentsCount: 3,
  pensionSavings: 4000000,
  irpSavings: 3000000,
  yellowUmbrella: 2000000,
  ventureInvestment: 5000000,
  interestDom: 12000000,
  interestOverseas: 4000000,
  isaIncome: 6000000,
  isaType: 'sub',
  bondSeparated: 3000000
};

const resLegacyWage = refactoredCalc.calculateComprehensiveIncome(legacyWageOpts);
const resUnifiedWage = refactoredCalc.calculateComprehensiveIncome(unifiedWageOpts);

// Verify all fields match except 'totalIncome'
assertEquals(resLegacyWage, resUnifiedWage, 'Legacy vs Unified Wage', ['totalIncome']);

// Case B: Legacy Business Profile
const legacyBizOpts = {
  incomeType: 'business',
  totalIncome: 80000000,
  expense: 30000000,
  dependents: 2,
  yellowUmbrella: 3000000,
  ventureInvestment: 12000000,
  financialGeneral: 25000000,
  financialOverseas: 6000000,
  isaIncome: 8000000,
  isaType: 'general',
  bondSeparated: 4000000
};

const unifiedBizOpts = {
  bizGenRevenue: 80000000,
  bizGenExpense: 30000000,
  dependentsCount: 2,
  yellowUmbrella: 3000000,
  ventureInvestment: 12000000,
  interestDom: 25000000,
  interestOverseas: 6000000,
  isaIncome: 8000000,
  isaType: 'general',
  bondSeparated: 4000000
};

const resLegacyBiz = refactoredCalc.calculateComprehensiveIncome(legacyBizOpts);
const resUnifiedBiz = refactoredCalc.calculateComprehensiveIncome(unifiedBizOpts);

assertEquals(resLegacyBiz, resUnifiedBiz, 'Legacy vs Unified Business', ['totalIncome']);

// Case C: calculateYearEndTax legacy vs unified
const legacyYearEndOpts = {
  totalSalary: 75000000,
  dependents: 4,
  cardUsage: 25000000,
  cashUsage: 10000000,
  pensionSavings: 3000000,
  irpSavings: 2000000,
  medicalExpense: 4000000,
  educationExpense: 3000000,
  monthlyRent: 1000000,
  childrenCount: 2,
  isMarriedThisYear: true,
  isSmeEmployee: true,
  hasSeniorDependent: true,
  hasDisabledDependent: false,
  isFemaleHead: true,
  isSingleParent: false,
  hasBirthOrAdoption: true,
  birthOrder: 2,
  housingSubscription: 2000000,
  housingLoanRepay: 3000000,
  mortgageInterest: 5000000,
  insurancePremium: 1000000,
  studentLoanRepay: 1500000,
  donationAmount: 2000000,
  localDonation: 150000,
  ventureInvestment: 4000000,
  traditionalMarket: 2000000,
  publicTransit: 1000000,
  bookPerformance: 500000
};

const unifiedYearEndOpts = {
  wage: 75000000,
  dependentsCount: 4,
  cardUsage: 25000000,
  cashUsage: 10000000,
  pensionSavings: 3000000,
  irpSavings: 2000000,
  medicalExpense: 4000000,
  educationExpense: 3000000,
  monthlyRent: 1000000,
  childrenCount: 2,
  isMarriedThisYear: true,
  isSmeEmployee: true,
  hasSeniorDependent: true,
  hasDisabledDependent: false,
  isFemaleHead: true,
  isSingleParent: false,
  hasBirthOrAdoption: true,
  birthOrder: 2,
  housingSubscription: 2000000,
  housingLoanRepay: 3000000,
  mortgageInterest: 5000000,
  insurancePremium: 1000000,
  studentLoanRepay: 1500000,
  donationAmount: 2000000,
  localDonation: 150000,
  ventureInvestment: 4000000,
  traditionalMarket: 2000000,
  publicTransit: 1000000,
  bookPerformance: 500000
};

const resLegacyYE = refactoredCalc.calculateYearEndTax(legacyYearEndOpts);
const resUnifiedYE = refactoredCalc.calculateComprehensiveIncome(unifiedYearEndOpts);

assertEquals(resLegacyYE, resUnifiedYE, 'calculateYearEndTax legacy vs unified', ['totalIncome']);

if (testFailures === 0) {
  console.log('✅ Backward Compatibility Mappings verified successfully (all calculation fields are identical)!');
} else {
  console.error(`❌ Backward Compatibility Mappings failed with ${testFailures} differences!`);
}

// ----------------------------------------------------
// 2. Core Stability Comparison (Original vs Refactored)
// ----------------------------------------------------
console.log('\n--- Checking Core Tax Engine Stability (Original vs Refactored) ---');
// For a pure business profile with no new 2025/2026 tax credits/reforms, the two engines should match exactly.
// Note: We use dependentsCount instead of dependents since the original calculateComprehensiveIncome did not support the dependents mapping.
const stableBizOpts = {
  incomeType: 'business',
  totalIncome: 120000000,
  expense: 40000000,
  dependentsCount: 1, // Using dependentsCount for fair comparison
  yellowUmbrella: 2000000,
  ventureInvestment: 0,
  financialGeneral: 15000000,
  financialOverseas: 0,
  isaIncome: 0,
  bondSeparated: 0
};

const origRes = originalCalc.calculateComprehensiveIncome(stableBizOpts);
const refactRes = refactoredCalc.calculateComprehensiveIncome(stableBizOpts);

let origRefactDiffs = 0;
const keysToCompare = ['totalIncome', 'financialGeneral', 'financialOverseas', 'isaIncome', 'bondSeparated', 'isFinancialCompTax', 'financialCompAmount', 'expense', 'personDeduction', 'yellowUmbrellaDeduction', 'taxableIncome', 'tax', 'localTax', 'totalTax', 'bracketRate', 'bracketDeduction'];
for (const key of keysToCompare) {
  if (origRes[key] !== refactRes[key]) {
    console.error(`❌ STABILITY DIFFERENCE [${key}]: Original ${origRes[key]} vs Refactored ${refactRes[key]}`);
    origRefactDiffs++;
  }
}
if (origRefactDiffs === 0) {
  console.log('✅ Core Stability comparison passed!');
} else {
  console.error(`❌ Core Stability comparison failed with ${origRefactDiffs} differences!`);
  testFailures += origRefactDiffs;
}

// ----------------------------------------------------
// 3. Stress Testing & Cap Verification (10k random runs)
// ----------------------------------------------------
console.log('\n--- Running 10,000 Stress Tests for Caps and Limits ---');
let stressFailures = 0;

for (let run = 1; run <= 10000; run++) {
  const profile = {
    // 6 Incomes (Random)
    wage: Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 250000000),
    bizGenRevenue: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 180000000),
    bizGenExpense: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 80000000),
    bizRentRevenue: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 90000000),
    bizRentExpense: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 40000000),
    interestDom: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 40000000),
    dividendDom: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 20000000),
    interestOverseas: Math.random() < 0.6 ? 0 : Math.floor(Math.random() * 15000000),
    dividendOverseas: Math.random() < 0.6 ? 0 : Math.floor(Math.random() * 10000000),
    pensionPub: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 30000000),
    pensionPri: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 25000000),
    otherRevenue: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 35000000),
    otherExpense: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 15000000),
    
    // Deductions & Credits
    yellowUmbrella: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 6000000),
    ventureInvestment: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 80000000),
    pensionSavings: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 12000000),
    irpSavings: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 12000000),
    cardUsage: Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 60000000),
    cashUsage: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 30000000),
    traditionalMarket: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 10000000),
    publicTransit: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 8000000),
    bookPerformance: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 5000000),
    housingSubscription: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 4000000),
    housingLoanRepay: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 6000000),
    mortgageInterest: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 20000000),
    insurancePremium: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3000000),
    medicalExpense: Math.random() < 0.2 ? 0 : Math.floor(Math.random() * 15000000),
    educationExpense: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 20000000),
    studentLoanRepay: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 10000000),
    localDonation: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 1000000),
    donationAmount: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 5000000),
    monthlyRent: Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 2500000),
    
    // Family & Status
    dependentsCount: Math.floor(Math.random() * 6),
    childrenCount: Math.floor(Math.random() * 4),
    hasBirthOrAdoption: Math.random() < 0.1,
    birthOrder: Math.floor(Math.random() * 3) + 1,
    isMarriedThisYear: Math.random() < 0.05,
    isSmeEmployee: Math.random() < 0.1,
    hasSeniorDependent: Math.random() < 0.15,
    hasDisabledDependent: Math.random() < 0.1,
    isFemaleHead: Math.random() < 0.1,
    isSingleParent: Math.random() < 0.05,
    isDisasterArea: Math.random() < 0.05,
    
    // Other Financial
    isaIncome: Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 20000000),
    isaType: Math.random() < 0.5 ? 'general' : 'sub',
    bondSeparated: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 40000000),
    facilityFee: Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 4000000),
    hasPT: Math.random() < 0.5
  };

  let res;
  try {
    res = refactoredCalc.calculateComprehensiveIncome(profile);
  } catch (err) {
    console.error(`❌ EXCEPTION in stress run ${run}:`, err);
    stressFailures++;
    continue;
  }

  // 1. Verify taxes are non-negative
  if (res.finalComprehensiveTax < 0 || res.finalNationalTax < 0 || res.localTax < 0 || res.totalTax < 0) {
    console.error(`❌ Negative Tax in run ${run}: compTax=${res.finalComprehensiveTax}, natTax=${res.finalNationalTax}, total=${res.totalTax}`);
    stressFailures++;
  }

  // 2. Verify Work Tax Credit
  const workCreditLimit = res.wage > 70000000 ? 660000 : 740000;
  if (res.workTaxCredit > workCreditLimit) {
    console.error(`❌ Work Tax Credit exceeds limit in run ${run}: credit=${res.workTaxCredit}, limit=${workCreditLimit}`);
    stressFailures++;
  }
  if (res.workTaxCredit > res.calculatedTax) {
    console.error(`❌ Work Tax Credit exceeds calculatedTax in run ${run}: credit=${res.workTaxCredit}, calculatedTax=${res.calculatedTax}`);
    stressFailures++;
  }

  // 3. Verify Pension Credit Limit
  const maxPensionAllowed = 9000000;
  const expectedPensionRate = res.TotalComprehensiveIncome - res.financialCompAmount <= 45000000 ? 0.15 : 0.12; 
  if (res.pensionCredit > 9000000 * 0.15) {
    console.error(`❌ Pension Credit exceeds absolute maximum in run ${run}: credit=${res.pensionCredit}`);
    stressFailures++;
  }

  // 4. Verify Special Tax Credits Cap
  const specialCreditSum = res.insuranceCredit + res.medicalCredit + res.eduCredit + res.donationCredit;
  const wageRatio = res.TotalComprehensiveIncome > 0 ? Math.min(1.0, res.wageIncomeAmount / res.TotalComprehensiveIncome) : 0;
  const expectedSpecialCap = Math.floor(res.calculatedTax * wageRatio);
  if (specialCreditSum > expectedSpecialCap + 10) { 
    console.error(`❌ Special Tax Credits sum (${specialCreditSum}) exceeds wage-ratio cap (${expectedSpecialCap}) in run ${run}`);
    stressFailures++;
  }
  if (res.wage === 0 && specialCreditSum > 0) {
    console.error(`❌ Special Tax Credits positive for non-wage filer in run ${run}: sum=${specialCreditSum}`);
    stressFailures++;
  }

  // 5. Verify Rent Credit Limits
  if (res.wage > 80000000 && res.rentCredit > 0) {
    console.error(`❌ Rent Credit allowed for high income wage earner (>80M) in run ${run}: wage=${res.wage}, credit=${res.rentCredit}`);
    stressFailures++;
  }
  if (res.rentCredit > 10000000 * 0.17) {
    console.error(`❌ Rent Credit exceeds maximum cap of 1,700,000 in run ${run}: credit=${res.rentCredit}`);
    stressFailures++;
  }

  // 6. Verify Yellow Umbrella Deduction Cap
  let umbrellaLimit = 2000000;
  const bizIncomeForUmbrella = Math.max(0, res.bizGenIncomeAmount + res.bizRentIncomeAmount);
  if (bizIncomeForUmbrella <= 40000000) {
    umbrellaLimit = 5000000;
  } else if (bizIncomeForUmbrella <= 100000000) {
    umbrellaLimit = 3000000;
  }
  if (res.yellowUmbrellaDeduction > umbrellaLimit) {
    console.error(`❌ Yellow Umbrella Deduction exceeds limit in run ${run}: deduction=${res.yellowUmbrellaDeduction}, limit=${umbrellaLimit}`);
    stressFailures++;
  }

  // 7. Verify Venture Investment Deduction Cap
  const baseIncomeForVenture = Math.max(0, res.TotalComprehensiveIncome - res.yellowUmbrellaDeduction);
  const maxVentureDeduction = Math.floor(baseIncomeForVenture * 0.5);
  if (res.ventureDeduction > maxVentureDeduction) {
    console.error(`❌ Venture Deduction exceeds 50% limit in run ${run}: deduction=${res.ventureDeduction}, limit=${maxVentureDeduction}`);
    stressFailures++;
  }

  // 8. Verify Sports Deduction Cap
  if (res.sportsDeduction > 3000000 * 0.3) {
    console.error(`❌ Sports Deduction exceeds limit in run ${run}: deduction=${res.sportsDeduction}`);
    stressFailures++;
  }
  if (res.wage > 70000000 && res.sportsDeduction > 0) {
    console.error(`❌ Sports Deduction allowed for wage > 70M in run ${run}: wage=${res.wage}, deduction=${res.sportsDeduction}`);
    stressFailures++;
  }
}

console.log(`Stress test complete. Total runs: 10,000. Failures: ${stressFailures}`);
if (stressFailures > 0) {
  testFailures += stressFailures;
}

// Exit code based on failures
if (testFailures === 0) {
  console.log('\n🌟 ALL TESTS PASSED SUCCESSFULLY! 🌟');
  process.exit(0);
} else {
  console.error(`\n❌ TEST SUITE FAILED WITH ${testFailures} ERRORS!`);
  process.exit(1);
}
