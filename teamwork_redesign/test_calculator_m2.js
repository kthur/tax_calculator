const fs = require('fs');
const path = require('path');

// Load tax-calculator.js content and evaluate it to get TaxCalculator
const calcPath = path.join(__dirname, 'tax-calculator.js');
const calcContent = fs.readFileSync(calcPath, 'utf8');

// Evaluate in a context
const context = { Math, console };
const runInContext = new Function('context', `
  with(context) {
    ${calcContent}
    return TaxCalculator;
  }
`);
const TaxCalculator = runInContext(context);

console.log('TaxCalculator loaded successfully!');

// Test Helper
function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    process.exit(1);
  } else {
    console.log('✅ PASS:', message);
  }
}

// 1. Business Loss Offset Test
console.log('\n--- 1. Testing Business Loss Offset ---');
// Case A: General business loss should offset wage income
const profileA = {
  wage: 50000000,
  bizGenRevenue: 10000000,
  bizGenExpense: 20000000, // -10,000,000 loss
};
const resultA = TaxCalculator.calculateTax(profileA);
const expectedWageAmount = 50000000 - TaxCalculator.calculateSalaryDeduction(50000000); // 50M - 12.25M = 37.75M
assert(resultA.wageIncomeAmount === expectedWageAmount, 'wageIncomeAmount calculation');
assert(resultA.bizGenIncomeAmount === -10000000, 'bizGenIncomeAmount allows negative');
assert(resultA.TotalComprehensiveIncome === expectedWageAmount - 10000000, 'bizGen loss offsets wage income');

// Case B: Rental business loss should NOT offset wage income (capped at 0)
const profileB = {
  wage: 50000000,
  bizRentRevenue: 10000000,
  bizRentExpense: 20000000, // -10,000,000 loss
};
const resultB = TaxCalculator.calculateTax(profileB);
assert(resultB.bizRentIncomeAmount === 0, 'bizRentIncomeAmount capped at 0');
assert(resultB.TotalComprehensiveIncome === expectedWageAmount, 'bizRent loss does not offset wage income');


// 2. Compared Financial Tax Test
console.log('\n--- 2. Testing Compared Financial Tax ---');
const profileC = {
  wage: 50000000,
  interestDom: 15000000,
  dividendDom: 10000000, // Total 25,000,000 financial income (> 20M)
};
const resultC = TaxCalculator.calculateTax(profileC);
assert(resultC.isFinancialCompTax === true, 'financial income comprehensive flag');
assert(resultC.financialCompAmount === 5000000, 'financialCompAmount is excess (5M)');
// Tax1 = calculateIncomeTax(TotalComprehensiveIncome - 5M) + 20M * 0.14
// Tax2 = calculateIncomeTax(TotalComprehensiveIncome - 25M) + 25M * 0.14
const tax1Base = resultC.taxableIncome; // standard taxable income (includes 5M comp financial)
const tax2Base = resultC.taxableIncomeWithoutFinancial; // taxable income without 5M comp financial
const Tax1 = TaxCalculator.calculateIncomeTax(tax1Base).tax + 20000000 * 0.14;
const Tax2 = TaxCalculator.calculateIncomeTax(tax2Base).tax + 25000000 * 0.14;
const expectedCalculatedTax = Math.max(Tax1, Tax2);
assert(resultC.calculatedTax === expectedCalculatedTax, 'Compared Tax Math.max(Tax1, Tax2) calculation');


// 3. Wage Credit Cap Test
console.log('\n--- 3. Testing Wage Credit Cap ---');
// Case A: No wage, special credits should be 0
const profileD1 = {
  bizGenRevenue: 50000000,
  insurancePremium: 1000000, // special credit candidate
  medicalExpense: 5000000,
};
const resultD1 = TaxCalculator.calculateTax(profileD1);
assert(resultD1.insuranceCredit === 0, 'no wage -> insurance credit is 0');
assert(resultD1.medicalCredit === 0, 'no wage -> medical credit is 0');

// Case B: Wage > 0, special credits capped at CalculatedTax * (wageIncomeAmount / TotalComprehensiveIncome)
const profileD2 = {
  wage: 40000000,
  bizGenRevenue: 40000000,
  insurancePremium: 1000000, // credit: 120,000
  medicalExpense: 5000000, // credit: (5M - 40M*0.03) * 0.15 = 3.8M * 0.15 = 570,000
};
const resultD2 = TaxCalculator.calculateTax(profileD2);
const totalSpecialProposed = 120000 + 570000; // 690,000
const expectedCap = Math.floor(resultD2.calculatedTax * (resultD2.wageIncomeAmount / resultD2.TotalComprehensiveIncome));
const actualSpecialSum = resultD2.insuranceCredit + resultD2.medicalCredit + resultD2.eduCredit + resultD2.donationCredit;
assert(actualSpecialSum <= expectedCap, 'special credit sum capped at wage ratio cap');


// 4. Female Head Deduction Test
console.log('\n--- 4. Testing Female Head Deduction ---');
// Total Comprehensive Income <= 30M (wage = 35M has wage income amount = 35M - 10.5M = 24.5M <= 30M)
const profileE1 = {
  wage: 35000000,
  isFemaleHead: true,
};
const resultE1 = TaxCalculator.calculateTax(profileE1);
const profileE2 = {
  wage: 50000000,
  isFemaleHead: true,
};
const resultE2 = TaxCalculator.calculateTax(profileE2);
// Person deduction: basic 1.5M. If female head deduction is applied, it adds 500,000.
assert(resultE1.personDeduction === 2000000, 'Female head deduction applied when Total Comp Income <= 30M');
assert(resultE2.personDeduction === 1500000, 'Female head deduction NOT applied when Total Comp Income > 30M');


// 5. Pension Credit Rate Hurdle Test
console.log('\n--- 5. Testing Pension Credit Rate Hurdle ---');
// Case A: Only wage <= 55M -> 15%
const profileF1 = {
  wage: 50000000,
  pensionSavings: 4000000,
};
const resultF1 = TaxCalculator.calculateTax(profileF1);
assert(resultF1.pensionCredit === 4000000 * 0.15, '15% pension credit for wage <= 55M (no other income)');

// Case B: Wage + General Business. Other comprehensive income exists. Total Comprehensive Income <= 45M -> 15%
// wage 40M (income amount = 40M - 11.25M = 28.75M). biz 10M. Total Comp Income = 38.75M <= 45M.
const profileF2 = {
  wage: 40000000,
  bizGenRevenue: 10000000,
  pensionSavings: 4000000,
};
const resultF2 = TaxCalculator.calculateTax(profileF2);
assert(resultF2.pensionCredit === 4000000 * 0.15, '15% pension credit for Comp Income <= 45M');

// Case C: Wage + General Business. Total Comprehensive Income > 45M -> 12%
// wage 40M. biz 20M. Total Comp Income = 48.75M > 45M.
const profileF3 = {
  wage: 40000000,
  bizGenRevenue: 20000000,
  pensionSavings: 4000000,
};
const resultF3 = TaxCalculator.calculateTax(profileF3);
assert(resultF3.pensionCredit === 4000000 * 0.12, '12% pension credit for Comp Income > 45M');


// 6. Wage Tax Credit Scaling Test
console.log('\n--- 6. Testing Wage Tax Credit Scaling ---');
const profileG = {
  wage: 40000000,
  bizGenRevenue: 40000000,
};
const resultG = TaxCalculator.calculateTax(profileG);
const expectedWageRatio = resultG.wageIncomeAmount / resultG.TotalComprehensiveIncome;
const baseWorkCreditLimit = 740000;
const expectedWorkCreditLimit = Math.floor(baseWorkCreditLimit * expectedWageRatio);
assert(resultG.workTaxCredit <= expectedWorkCreditLimit, 'wage tax credit capped by scaled limit');

console.log('\nAll unit tests passed successfully!');
