const fs = require('fs');
const path = require('path');

// Load tax-calculator.js and optimizer.js
const calcPath = path.join(__dirname, 'tax-calculator.js');
const calcContent = fs.readFileSync(calcPath, 'utf8');

const optPath = path.join(__dirname, 'optimizer.js');
const optContent = fs.readFileSync(optPath, 'utf8');

// Evaluate in a context
const context = { Math, console };
const runInContext = new Function('context', `
  with(context) {
    ${calcContent}
    ${optContent}
    return { TaxCalculator, TaxOptimizer };
  }
`);

const { TaxCalculator, TaxOptimizer } = runInContext(context);

console.log('TaxCalculator and TaxOptimizer loaded successfully for testing!');

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    process.exit(1);
  } else {
    console.log('✅ PASS:', message);
  }
}

// 1. Setup sample couple profiles and dependents with 6 composite incomes
const personA = {
  wage: 60000000,
  bizGenRevenue: 15000000,
  bizGenExpense: 5000000,
  bizRentRevenue: 12000000,
  bizRentExpense: 4000000,
  interestDom: 5000000,
  dividendDom: 2000000,
  interestOverseas: 1000000,
  dividendOverseas: 1500000,
  pensionPub: 3000000,
  pensionPri: 10000000,
  otherRevenue: 4000000,
  otherExpense: 1000000,
  card: 15000000,
  pension: 4000000,
  irp: 3000000,
  yellowUmbrella: 2000000,
  ventureInvestment: 5000000,
  housingSubscription: 2000000,
  housingLoanRepay: 1500000,
  isaIncome: 3000000,
  isaType: 'general',
  bondSeparated: 20000000,
  cash: 0,
  SME: false
};

const personB = {
  wage: 45000000,
  bizGenRevenue: 20000000,
  bizGenExpense: 12000000,
  bizRentRevenue: 0,
  bizRentExpense: 0,
  interestDom: 10000000,
  dividendDom: 5000000,
  interestOverseas: 0,
  dividendOverseas: 0,
  pensionPub: 0,
  pensionPri: 0,
  otherRevenue: 0,
  otherExpense: 0,
  card: 10000000,
  pension: 3000000,
  irp: 2000000,
  yellowUmbrella: 0,
  ventureInvestment: 0,
  housingSubscription: 1200000,
  housingLoanRepay: 0,
  isaIncome: 0,
  isaType: 'general',
  bondSeparated: 0,
  cash: 0,
  SME: false
};

const dependents = [
  { name: '자녀1', relation: 'child', card: 2000000, medical: 1500000, edu: 3000000, senior: false, disabled: false, birth: false },
  { name: '어머님', relation: 'parent', card: 1000000, medical: 4000000, edu: 0, senior: true, disabled: false, birth: false },
  { name: '자녀2', relation: 'child', card: 500000, medical: 800000, edu: 2000000, senior: false, disabled: true, birth: true, birthOrder: 2 }
];

console.log('\n--- Test 1: optimizeCoupleYearEnd Permutations ---');
const optResult = TaxOptimizer.optimizeCoupleYearEnd({ personA, personB, dependents });

assert(optResult !== null, 'optimizeCoupleYearEnd returns a result');
assert(optResult.best !== null, 'optResult has a best assignment');
assert(typeof optResult.minCoupleTax === 'number', 'minCoupleTax is a number');
assert(typeof optResult.allATax === 'number', 'allATax is a number');
assert(typeof optResult.allBTax === 'number', 'allBTax is a number');
assert(typeof optResult.savings === 'number', 'savings is a number');

console.log('Optimal assignment total tax:', optResult.minCoupleTax.toLocaleString(), '원');
console.log('All to A total tax:', optResult.allATax.toLocaleString(), '원');
console.log('All to B total tax:', optResult.allBTax.toLocaleString(), '원');
console.log('Calculated savings:', optResult.savings.toLocaleString(), '원');

// Verify that the best combination index is correct and reproduces the minimum tax
const best = optResult.best;
assert(best.totalTax === optResult.minCoupleTax, 'best.totalTax matches optResult.minCoupleTax');

// Verify getCoupleTaxWithTarget output
console.log('\n--- Test 2: getCoupleTaxWithTarget Verification ---');
const taxAllA = TaxOptimizer.getCoupleTaxWithTarget(personA, personB, dependents, 'a');
const taxAllB = TaxOptimizer.getCoupleTaxWithTarget(personA, personB, dependents, 'b');

assert(taxAllA === optResult.allATax, 'getCoupleTaxWithTarget matches optResult.allATax');
assert(taxAllB === optResult.allBTax, 'getCoupleTaxWithTarget matches optResult.allBTax');

console.log('\nAll optimizer unit tests passed successfully!');
