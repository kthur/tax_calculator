const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load tax-calculator.js in a VM context
const code = fs.readFileSync(path.resolve(__dirname, 'tax-calculator.js'), 'utf8');
const context = {};
vm.createContext(context);
const TaxCalculator = vm.runInContext(code + '\nTaxCalculator;', context);

if (!TaxCalculator) {
  console.error("TaxCalculator could not be loaded from tax-calculator.js!");
  process.exit(1);
}

let errors = 0;

function assert(condition, message) {
  if (!condition) {
    console.error("❌ ASSERTION FAILED:", message);
    errors++;
  } else {
    console.log("✅ ASSERTION PASSED:", message);
  }
}

console.log("Starting verification of refactored tax-calculator.js...");

// ==========================================
// Scenario 1: Wage only (gross 50M) with typical credits.
// ==========================================
console.log("\n--- Scenario 1: Wage only (50M) ---");
const profile1 = {
  wage: 50000000,
  cardUsage: 15000000,
  cashUsage: 5000000,
  insurancePremium: 1000000,
  medicalExpense: 2000000,
  educationExpense: 1000000,
  donationAmount: 500000
};
const res1 = TaxCalculator.calculateComprehensiveIncome(profile1);

const expectedSalaryDeduction = TaxCalculator.calculateSalaryDeduction(50000000);
const expectedWageIncomeAmount = 50000000 - expectedSalaryDeduction;
assert(res1.wageIncomeAmount === expectedWageIncomeAmount, `wageIncomeAmount should be ${expectedWageIncomeAmount}, got ${res1.wageIncomeAmount}`);
assert(res1.TotalComprehensiveIncome === expectedWageIncomeAmount, `TotalComprehensiveIncome should be ${expectedWageIncomeAmount}, got ${res1.TotalComprehensiveIncome}`);
assert(res1.cardDeduction > 0, `cardDeduction should be > 0, got ${res1.cardDeduction}`);
assert(res1.insuranceCredit > 0, `insuranceCredit should be > 0, got ${res1.insuranceCredit}`);
assert(res1.medicalCredit > 0, `medicalCredit should be > 0, got ${res1.medicalCredit}`);
assert(res1.eduCredit > 0, `eduCredit should be > 0, got ${res1.eduCredit}`);
assert(res1.donationCredit > 0, `donationCredit should be > 0, got ${res1.donationCredit}`);
assert(res1.totalTax > 0, `totalTax should be > 0, got ${res1.totalTax}`);


// ==========================================
// Scenario 2: Business only (bizGenRevenue 60M, expense 20M) with card and medical (credits capped to 0).
// ==========================================
console.log("\n--- Scenario 2: Business only (60M revenue, 20M expense) ---");
const profile2 = {
  bizGenRevenue: 60000000,
  bizGenExpense: 20000000,
  cardUsage: 15000000,
  medicalExpense: 2000000
};
const res2 = TaxCalculator.calculateComprehensiveIncome(profile2);

assert(res2.bizGenIncomeAmount === 40000000, `bizGenIncomeAmount should be 40,000,000, got ${res2.bizGenIncomeAmount}`);
assert(res2.TotalComprehensiveIncome === 40000000, `TotalComprehensiveIncome should be 40,000,000, got ${res2.TotalComprehensiveIncome}`);
assert(res2.cardDeduction === 0, `cardDeduction should be 0 for business only, got ${res2.cardDeduction}`);
assert(res2.medicalCredit === 0, `medicalCredit should be 0 for business only, got ${res2.medicalCredit}`);
assert(res2.totalTax > 0, `totalTax should be > 0, got ${res2.totalTax}`);


// ==========================================
// Scenario 3: Mixed wage (50M) and general business loss (bizGenRevenue 10M, expense 20M).
// ==========================================
console.log("\n--- Scenario 3: Mixed wage and general business loss ---");
const profile3 = {
  wage: 50000000,
  bizGenRevenue: 10000000,
  bizGenExpense: 20000000
};
const res3 = TaxCalculator.calculateComprehensiveIncome(profile3);

const expectedWageAmount3 = 50000000 - TaxCalculator.calculateSalaryDeduction(50000000);
const expectedBizGenLoss3 = 10000000 - 20000000;
const expectedTotalComp3 = Math.max(0, expectedWageAmount3 + expectedBizGenLoss3);
assert(res3.bizGenIncomeAmount === expectedBizGenLoss3, `bizGenIncomeAmount should be ${expectedBizGenLoss3}, got ${res3.bizGenIncomeAmount}`);
assert(res3.TotalComprehensiveIncome === expectedTotalComp3, `TotalComprehensiveIncome should be ${expectedTotalComp3}, got ${res3.TotalComprehensiveIncome}`);


// ==========================================
// Scenario 4: Rental loss cap (wage 50M, rental revenue 10M, rental expense 20M).
// ==========================================
console.log("\n--- Scenario 4: Rental loss cap ---");
const profile4 = {
  wage: 50000000,
  bizRentRevenue: 10000000,
  bizRentExpense: 20000000
};
const res4 = TaxCalculator.calculateComprehensiveIncome(profile4);

const expectedWageAmount4 = 50000000 - TaxCalculator.calculateSalaryDeduction(50000000);
assert(res4.bizRentIncomeAmount === 0, `bizRentIncomeAmount should be capped at 0, got ${res4.bizRentIncomeAmount}`);
assert(res4.TotalComprehensiveIncome === expectedWageAmount4, `TotalComprehensiveIncome should be exactly wageIncomeAmount ${expectedWageAmount4}, got ${res4.TotalComprehensiveIncome}`);


// ==========================================
// Scenario 5: Financial income > 20M (interest 30M, wage 40M).
// ==========================================
console.log("\n--- Scenario 5: Financial income > 20M ---");
const profile5 = {
  wage: 40000000,
  interestDom: 30000000
};
const res5 = TaxCalculator.calculateComprehensiveIncome(profile5);

assert(res5.isFinancialCompTax === true, "isFinancialCompTax should be true");
assert(res5.financialCompAmount === 10000000, `financialCompAmount should be 10,000,000, got ${res5.financialCompAmount}`);

// Check Compared Financial Tax logic manually
const wageIncomeAmount5 = 40000000 - TaxCalculator.calculateSalaryDeduction(40000000);
const totalComp5 = wageIncomeAmount5 + 10000000;
const personDeduction5 = 1500000; // single filer default

const taxableIncome5 = Math.max(0, totalComp5 - personDeduction5);
const taxableIncomeWithoutFinancial5 = Math.max(0, totalComp5 - 10000000 - personDeduction5);

const Tax1 = TaxCalculator.calculateIncomeTax(taxableIncome5).tax + 20000000 * 0.14;
const Tax2 = TaxCalculator.calculateIncomeTax(taxableIncomeWithoutFinancial5).tax + 30000000 * 0.14;
const expectedCalculatedTax5 = Math.max(Tax1, Tax2);

assert(res5.calculatedTax === expectedCalculatedTax5, `calculatedTax should be ${expectedCalculatedTax5}, got ${res5.calculatedTax}`);


// ==========================================
// Additional Checks (Wrappers & Compatibility)
// ==========================================
console.log("\n--- Compatibility Wrapper Checks ---");
const legacyProfile = {
  incomeType: 'business',
  totalIncome: 60000000,
  expense: 20000000,
  financialGeneral: 15000000,
  financialOverseas: 5000000
};
const legacyRes = TaxCalculator.calculateTax(legacyProfile);
assert(legacyRes.bizGenRevenue === 60000000, "Should map legacy totalIncome to bizGenRevenue");
assert(legacyRes.bizGenExpense === 20000000, "Should map legacy expense to bizGenExpense");
assert(legacyRes.interestDom === 15000000, "Should map legacy financialGeneral to interestDom");
assert(legacyRes.interestOverseas === 5000000, "Should map legacy financialOverseas to interestOverseas");

const yeRes = TaxCalculator.calculateYearEndTax({
  totalSalary: 50000000,
  dependents: 2
});
assert(yeRes.wage === 50000000, "calculateYearEndTax should map totalSalary to wage");
assert(yeRes.personDeduction === 4500000, "calculateYearEndTax should map dependents to dependentsCount");

console.log("\n------------------------------------");
if (errors === 0) {
  console.log("✅ All tests passed successfully with 0 errors!");
  process.exit(0);
} else {
  console.error(`❌ Completed with ${errors} error(s).`);
  process.exit(1);
}
