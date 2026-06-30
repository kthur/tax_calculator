const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../../tax-calculator.js');
console.log('Target path:', targetPath);

let content = fs.readFileSync(targetPath, 'utf8');

const calculatePublicPensionDeduction = `  // 1. Helper: Public Pension Deduction
  calculatePublicPensionDeduction(pensionPub) {
    if (pensionPub <= 0) return 0;
    if (pensionPub <= 3500000) return pensionPub;
    if (pensionPub <= 7000000) return Math.floor(3500000 + (pensionPub - 3500000) * 0.40);
    if (pensionPub <= 14000000) return Math.floor(4900000 + (pensionPub - 7000000) * 0.20);
    return Math.min(9000000, Math.floor(6300000 + (pensionPub - 14000000) * 0.10));
  },`;

const calculateComprehensiveIncomeCode = `  // 종합소득세 전체 계산 (6개 소득 종합과세 및 공제 한도 정밀 반영)
  calculateComprehensiveIncome(profile = {}) {
    let wage = profile.wage !== undefined ? profile.wage : 0;
    let bizGenRevenue = profile.bizGenRevenue !== undefined ? profile.bizGenRevenue : 0;
    let bizGenExpense = profile.bizGenExpense !== undefined ? profile.bizGenExpense : 0;
    let bizRentRevenue = profile.bizRentRevenue !== undefined ? profile.bizRentRevenue : 0;
    let bizRentExpense = profile.bizRentExpense !== undefined ? profile.bizRentExpense : 0;
    let interestDom = profile.interestDom !== undefined ? profile.interestDom : 0;
    let dividendDom = profile.dividendDom !== undefined ? profile.dividendDom : 0;
    let interestOverseas = profile.interestOverseas !== undefined ? profile.interestOverseas : 0;
    let dividendOverseas = profile.dividendOverseas !== undefined ? profile.dividendOverseas : 0;
    let pensionPub = profile.pensionPub !== undefined ? profile.pensionPub : 0;
    let pensionPri = profile.pensionPri !== undefined ? profile.pensionPri : 0;
    let otherRevenue = profile.otherRevenue !== undefined ? profile.otherRevenue : 0;
    let otherExpense = profile.otherExpense !== undefined ? profile.otherExpense : 0;

    // Backward-compatibility: map old parameter formats if profile.incomeType is defined
    if (profile.incomeType !== undefined) {
      if (profile.incomeType === 'wage') {
        if (profile.totalIncome !== undefined) {
          wage = profile.totalIncome;
        }
      } else if (profile.incomeType === 'business') {
        if (profile.totalIncome !== undefined) {
          bizGenRevenue = profile.totalIncome;
        }
        if (profile.expense !== undefined) {
          bizGenExpense = profile.expense;
        }
      }
      
      // map financialGeneral to interestDom, financialOverseas to interestOverseas
      if (profile.financialGeneral !== undefined && interestDom === 0 && dividendDom === 0) {
        interestDom = profile.financialGeneral;
      }
      if (profile.financialOverseas !== undefined && interestOverseas === 0 && dividendOverseas === 0) {
        interestOverseas = profile.financialOverseas;
      }
    }

    let totalIncome = profile.totalIncome !== undefined ? profile.totalIncome : (wage + bizGenRevenue + bizRentRevenue + interestDom + dividendDom + interestOverseas + dividendOverseas + pensionPub + pensionPri + otherRevenue);

    // 1. Calculate each income net amount
    const wageIncomeAmount = wage > 0 ? Math.max(0, wage - this.calculateSalaryDeduction(wage)) : 0;
    const bizGenIncomeAmount = bizGenRevenue - bizGenExpense; // can be negative
    const bizRentIncomeAmount = Math.max(0, bizRentRevenue - bizRentExpense); // rental loss capped at 0

    const totalFinancial = interestDom + dividendDom + interestOverseas + dividendOverseas;
    let financialCompAmount = 0;
    if (totalFinancial > 20000000) {
      financialCompAmount = totalFinancial - 20000000;
    } else {
      financialCompAmount = interestOverseas + dividendOverseas;
    }
    const financialTax = Math.floor(totalFinancial > 20000000 ? 20000000 * 0.14 : (interestDom + dividendDom) * 0.14);

    const publicPensionDeduction = this.calculatePublicPensionDeduction(pensionPub);
    const publicPensionIncomeAmount = Math.max(0, pensionPub - publicPensionDeduction);
    const privatePensionIncomeAmount = (pensionPri > 15000000 || profile.optPrivatePensionComp) ? pensionPri : 0;
    const pensionIncomeAmount = publicPensionIncomeAmount + privatePensionIncomeAmount;

    const otherNet = otherRevenue - otherExpense;
    const otherIncomeAmount = (otherNet > 3000000 || profile.optOtherComp) ? Math.max(0, otherNet) : 0;

    // Sum to get TotalComprehensiveIncome (applies General Business Loss Offset since bizGenIncomeAmount can be negative)
    const TotalComprehensiveIncome = Math.max(0, wageIncomeAmount + bizGenIncomeAmount + bizRentIncomeAmount + financialCompAmount + pensionIncomeAmount + otherIncomeAmount);

    // 2. Deductions
    const dependentsCount = profile.dependentsCount !== undefined ? profile.dependentsCount : (profile.dependents !== undefined ? profile.dependents : 0);
    let personDeduction = (1 + dependentsCount) * 1500000;
    personDeduction += (profile.hasSeniorDependent ? 1000000 : 0);
    personDeduction += (profile.hasDisabledDependent ? 2000000 : 0);
    if (profile.isSingleParent) {
      personDeduction += 1000000;
    } else if (profile.isFemaleHead && TotalComprehensiveIncome <= 30000000) {
      personDeduction += 500000;
    }

    const yellowUmbrellaDeduction = this.calculateYellowUmbrellaDeduction(Math.max(0, bizGenIncomeAmount + bizRentIncomeAmount), profile.yellowUmbrella || 0);
    const baseIncome = Math.max(0, TotalComprehensiveIncome - yellowUmbrellaDeduction);
    const ventureDeduction = this.calculateVentureInvestmentDeduction(baseIncome, profile.ventureInvestment || 0);

    let cardDeduction = 0, tradDeduction = 0, transitDeduction = 0, bookDeduction = 0, housingDeduction = 0, sportsDeduction = 0;
    let wageDeductions = 0;

    if (wage > 0) {
      const threshold = Math.floor(wage * 0.25);
      const cardUsage = profile.cardUsage || 0;
      const cashUsage = profile.cashUsage || 0;
      const totalCardUsage = cardUsage + cashUsage;
      if (totalCardUsage > threshold) {
        const excess = totalCardUsage - threshold;
        if (cardUsage >= threshold) {
          cardDeduction = Math.floor((cardUsage - threshold) * 0.15) + Math.floor(cashUsage * 0.3);
        } else {
          cardDeduction = Math.floor(excess * 0.3);
        }
        let limit = 3000000;
        if (wage > 120000000) limit = 2000000;
        else if (wage > 70000000) limit = 2500000;
        cardDeduction = Math.min(limit, cardDeduction);
      }

      const traditionalMarket = profile.traditionalMarket || 0;
      const publicTransit = profile.publicTransit || 0;
      const bookPerformance = profile.bookPerformance || 0;
      const addLimitTrad = 3000000;
      const addLimitTransit = 3000000;
      const addLimitBook = wage <= 70000000 ? 3000000 : 0;
      tradDeduction = Math.min(Math.floor(traditionalMarket * 0.3), addLimitTrad);
      transitDeduction = Math.min(Math.floor(publicTransit * 0.4), addLimitTransit);
      bookDeduction = addLimitBook > 0 ? Math.min(Math.floor(bookPerformance * 0.3), addLimitBook) : 0;

      if (wage <= 70000000) {
        const subscription = profile.housingSubscription || 0;
        housingDeduction += Math.floor(Math.min(subscription, 3000000) * 0.4);
      }
      const housingLoanRepay = profile.housingLoanRepay || 0;
      const mortgageInterest = profile.mortgageInterest || 0;
      housingDeduction += Math.min(4000000, Math.floor(housingLoanRepay * 0.4));
      housingDeduction += Math.min(18000000, mortgageInterest);

      const sportsRes = this.calculateSportsDeduction({
        totalSalary: wage,
        facilityFee: profile.facilityFee || 0,
        hasPT: profile.hasPT || false
      });
      sportsDeduction = sportsRes.isEligible ? (sportsRes.deduction || 0) : 0;

      wageDeductions = cardDeduction + tradDeduction + transitDeduction + bookDeduction + housingDeduction + sportsDeduction;
    }

    // 3. Taxable Income
    const taxableIncome = Math.max(0, TotalComprehensiveIncome - yellowUmbrellaDeduction - ventureDeduction - personDeduction - wageDeductions);
    const taxableIncomeWithoutFinancial = Math.max(0, TotalComprehensiveIncome - financialCompAmount - yellowUmbrellaDeduction - ventureDeduction - personDeduction - wageDeductions);

    // 4. Tax Calculation (Compared Financial Tax)
    let calculatedTax = 0;
    if (totalFinancial > 20000000) {
      const Tax1 = this.calculateIncomeTax(taxableIncome).tax + Math.floor(20000000 * 0.14);
      const Tax2 = this.calculateIncomeTax(taxableIncomeWithoutFinancial).tax + Math.floor(totalFinancial * 0.14);
      calculatedTax = Math.max(Tax1, Tax2);
    } else {
      calculatedTax = this.calculateIncomeTax(taxableIncome).tax;
    }

    // 5. Credits and Caps
    const wageRatio = TotalComprehensiveIncome > 0 ? Math.min(1.0, wageIncomeAmount / TotalComprehensiveIncome) : 0;

    const pensionSavings = profile.pensionSavings || 0;
    const irpSavings = profile.irpSavings || 0;
    const hasNonWageIncome = (bizGenIncomeAmount !== 0 || bizRentIncomeAmount > 0 || financialCompAmount > 0 || pensionIncomeAmount > 0 || otherIncomeAmount > 0);
    let pensionRate;
    if (hasNonWageIncome) {
      pensionRate = TotalComprehensiveIncome <= 45000000 ? 0.15 : 0.12;
    } else {
      pensionRate = wage <= 55000000 ? 0.15 : 0.12;
    }
    const pensionCredit = Math.floor(Math.min(9000000, pensionSavings + irpSavings) * pensionRate);

    let workTaxCredit = 0;
    if (calculatedTax <= 1300000) {
      workTaxCredit = Math.floor(calculatedTax * 0.55);
    } else {
      workTaxCredit = Math.floor(715000 + (calculatedTax - 1300000) * 0.3);
    }
    const workCreditLimit = wage > 70000000 ? 660000 : 740000;
    const finalWorkTaxCredit = Math.min(Math.floor(workCreditLimit * wageRatio), workTaxCredit);

    let insuranceCredit = 0, medicalCredit = 0, eduCredit = 0, donationCredit = 0;
    let cappedSpecialCreditSum = 0;

    if (wage > 0) {
      const insurancePremium = profile.insurancePremium || 0;
      const medicalExpense = profile.medicalExpense || 0;
      const educationExpense = profile.educationExpense || 0;
      const studentLoanRepay = profile.studentLoanRepay || 0;
      const localDonation = profile.localDonation || 0;
      const donationAmount = profile.donationAmount || 0;
      const isDisasterArea = profile.isDisasterArea || false;

      const insuranceCreditVal = Math.min(120000, Math.floor(insurancePremium * 0.12));
      let medicalCreditVal = 0;
      const medicalThreshold = Math.floor(wage * 0.03);
      if (medicalExpense > medicalThreshold) {
        medicalCreditVal = Math.floor((medicalExpense - medicalThreshold) * 0.15);
      }
      const eduCreditVal = Math.floor((educationExpense + studentLoanRepay) * 0.15);
      
      let hometownCredit = 0;
      if (localDonation <= 100000) {
        hometownCredit = localDonation;
      } else if (localDonation <= 200000) {
        hometownCredit = 100000 + Math.floor((localDonation - 100000) * 0.44);
      } else {
        const thirdRate = isDisasterArea ? 0.33 : 0.165;
        hometownCredit = 144000 + Math.floor((localDonation - 200000) * thirdRate);
      }
      const generalDonationCredit = Math.floor(donationAmount * 0.15);
      const donationCreditVal = hometownCredit + generalDonationCredit;

      const specialCreditSum = insuranceCreditVal + medicalCreditVal + eduCreditVal + donationCreditVal;
      const specialCreditCap = calculatedTax * wageRatio;

      insuranceCredit = insuranceCreditVal;
      medicalCredit = medicalCreditVal;
      eduCredit = eduCreditVal;
      donationCredit = donationCreditVal;
      cappedSpecialCreditSum = specialCreditSum;

      if (specialCreditSum > specialCreditCap && specialCreditSum > 0) {
        const scale = specialCreditCap / specialCreditSum;
        insuranceCredit = Math.floor(insuranceCreditVal * scale);
        medicalCredit = Math.floor(medicalCreditVal * scale);
        eduCredit = Math.floor(eduCreditVal * scale);
        donationCredit = Math.floor(donationCreditVal * scale);
        cappedSpecialCreditSum = insuranceCredit + medicalCredit + eduCredit + donationCredit;
      }
    }

    let rentCredit = 0;
    if (wage > 0 && wage <= 80000000) {
      const monthlyRent = profile.monthlyRent || 0;
      const rentRate = wage <= 55000000 ? 0.17 : 0.15;
      rentCredit = Math.floor(Math.min(10000000, monthlyRent * 12) * rentRate);
    }

    const childrenCount = profile.childrenCount || 0;
    let childCredit = 0;
    if (childrenCount === 1) childCredit = 250000;
    else if (childrenCount === 2) childCredit = 550000;
    else if (childrenCount >= 3) childCredit = 550000 + (childrenCount - 2) * 400000;

    const hasBirthOrAdoption = profile.hasBirthOrAdoption || false;
    const birthOrder = profile.birthOrder || 1;
    let birthCredit = 0;
    if (hasBirthOrAdoption) {
      if (birthOrder === 1) birthCredit = 300000;
      else if (birthOrder === 2) birthCredit = 500000;
      else birthCredit = 700000;
    }

    const isMarriedThisYear = profile.isMarriedThisYear || false;
    const marriageCredit = isMarriedThisYear ? 500000 : 0;

    // Final tax calculations
    const finalComprehensiveTax = Math.max(0, calculatedTax - finalWorkTaxCredit - pensionCredit - childCredit - birthCredit - marriageCredit - cappedSpecialCreditSum - rentCredit);

    let smeReduction = 0;
    if (profile.isSmeEmployee && wage > 0) {
      smeReduction = Math.min(2000000, Math.floor(finalComprehensiveTax * 0.9));
    }

    const isaIncome = profile.isaIncome || 0;
    const isaType = profile.isaType || 'general';
    const isaLimit = isaType === 'sub' ? 10000000 : 5000000;
    const isaTaxfreeAmount = Math.min(isaIncome, isaLimit);
    const isaOverLimitAmount = Math.max(0, isaIncome - isaLimit);
    const isaSeparatedTax = Math.floor(isaOverLimitAmount * 0.09);

    const bondSeparated = profile.bondSeparated || 0;
    const bondSeparatedTax = Math.floor(bondSeparated * (30 / 110));

    const finalNationalTax = finalComprehensiveTax - smeReduction + isaSeparatedTax + bondSeparatedTax + (totalFinancial > 20000000 ? 0 : financialTax);
    const localTax = Math.floor(finalNationalTax * 0.1);
    const totalTax = finalNationalTax + localTax;

    const financialGeneral = interestDom + dividendDom;
    const financialOverseas = interestOverseas + dividendOverseas;
    const denominator = wage + bizGenRevenue + bizRentRevenue + financialGeneral + financialOverseas + pensionPub + pensionPri + otherRevenue + isaIncome + bondSeparated;
    const effectiveRate = denominator > 0 ? Math.round((totalTax / denominator) * 10000) / 100 : 0;

    const baseTaxObj = this.calculateIncomeTax(taxableIncome);
    const rate = baseTaxObj.rate;
    const deduction = baseTaxObj.deduction;

    return {
      totalIncome: totalIncome,
      wage: wage,
      bizGenRevenue: bizGenRevenue,
      bizGenExpense: bizGenExpense,
      bizRentRevenue: bizRentRevenue,
      bizRentExpense: bizRentExpense,
      interestDom: interestDom,
      dividendDom: dividendDom,
      interestOverseas: interestOverseas,
      dividendOverseas: dividendOverseas,
      pensionPub: pensionPub,
      pensionPri: pensionPri,
      otherRevenue: otherRevenue,
      otherExpense: otherExpense,

      wageIncomeAmount: wageIncomeAmount,
      bizGenIncomeAmount: bizGenIncomeAmount,
      bizRentIncomeAmount: bizRentIncomeAmount,
      financialCompAmount: financialCompAmount,
      pensionIncomeAmount: pensionIncomeAmount,
      otherIncomeAmount: otherIncomeAmount,
      TotalComprehensiveIncome: TotalComprehensiveIncome,

      expense: (wage > 0 ? this.calculateSalaryDeduction(wage) : 0) + bizGenExpense + bizRentExpense + otherExpense,
      salaryDeduction: wage > 0 ? this.calculateSalaryDeduction(wage) : 0,
      grossIncome: wageIncomeAmount,
      personDeduction: personDeduction,
      yellowUmbrellaDeduction: yellowUmbrellaDeduction,
      ventureDeduction: ventureDeduction,
      cardDeduction: cardDeduction,
      tradDeduction: tradDeduction,
      transitDeduction: transitDeduction,
      bookDeduction: bookDeduction,
      housingDeduction: housingDeduction,
      sportsDeduction: sportsDeduction,
      taxableIncome: taxableIncome,
      taxableIncomeWithoutFinancial: taxableIncomeWithoutFinancial,

      calculatedTax: calculatedTax,

      workTaxCredit: finalWorkTaxCredit,
      pensionCredit: pensionCredit,
      childCredit: childCredit,
      birthCredit: birthCredit,
      marriageCredit: marriageCredit,
      insuranceCredit: insuranceCredit,
      medicalCredit: medicalCredit,
      eduCredit: eduCredit,
      donationCredit: donationCredit,
      rentCredit: rentCredit,
      smeReduction: smeReduction,

      finalComprehensiveTax: finalComprehensiveTax,
      isaIncome: isaIncome,
      isaTaxfreeAmount: isaTaxfreeAmount,
      isaOverLimitAmount: isaOverLimitAmount,
      isaSeparatedTax: isaSeparatedTax,
      bondSeparated: bondSeparated,
      bondSeparatedTax: bondSeparatedTax,
      financialTax: financialTax,
      financialGeneral: financialGeneral,
      financialOverseas: financialOverseas,
      isFinancialCompTax: totalFinancial > 20000000,
      
      finalNationalTax: finalNationalTax,
      tax: finalNationalTax,
      finalTax: finalNationalTax,
      localTax: localTax,
      totalTax: totalTax,
      effectiveRate: effectiveRate,
      bracketRate: rate * 100,
      bracketDeduction: deduction
    };
  },`;

const compatibilityWrappers = `  // 3. Compatibility Wrappers
  calculateTax(profile) {
    return this.calculateComprehensiveIncome(profile);
  },

  calculateYearEndTax(opts) {
    const profile = Object.assign({}, opts, {
      wage: opts.wage !== undefined ? opts.wage : (opts.totalSalary || 0),
      dependentsCount: opts.dependentsCount !== undefined ? opts.dependentsCount : (opts.dependents || 0)
    });
    return this.calculateComprehensiveIncome(profile);
  }`;

// Find token: '  // 종합소득세 전체 계산 (금융소득 세부 유형 및 벤처투자 소득공제 연동)'
// and replace up to: '  // 2. 양도소득세 계산 (장기보유특별공제 및 이월과세)'
const compStartToken = '  // 종합소득세 전체 계산 (금융소득 세부 유형 및 벤처투자 소득공제 연동)';
const compEndToken = '  // 2. 양도소득세 계산 (장기보유특별공제 및 이월과세)';

const compStartIndex = content.indexOf(compStartToken);
const compEndIndex = content.indexOf(compEndToken);

if (compStartIndex === -1 || compEndIndex === -1) {
  console.error('Could not find calculateComprehensiveIncome bounds!');
  process.exit(1);
}

const beforeComp = content.substring(0, compStartIndex);
const afterComp = content.substring(compEndIndex);

let newContent = beforeComp + calculatePublicPensionDeduction + '\n\n' + calculateComprehensiveIncomeCode + '\n\n' + afterComp;

// Find token: '  // 4. 연말정산 정밀 계산'
// and replace up to: '};' (the very end of TaxCalculator object)
// Wait! Let's find the closing }; of TaxCalculator.
// The end token for year end tax in original was: '  // 4. 연말정산 정밀 계산' to the closing brace.
// Let's identify the end of calculateYearEndTax.
const yeStartToken = '  // 4. 연말정산 정밀 계산';
const nextToken = '// ----- new feature functions added by TAX NAVI expansion -----';

const yeStartIndex = newContent.indexOf(yeStartToken);
const nextIndex = newContent.indexOf(nextToken);

if (yeStartIndex === -1 || nextIndex === -1) {
  console.error('Could not find calculateYearEndTax bounds!');
  process.exit(1);
}

// Find the last '};' before nextToken
const closingBraceIndex = newContent.lastIndexOf('};', nextIndex);
if (closingBraceIndex === -1 || closingBraceIndex < yeStartIndex) {
  console.error('Could not find closing }; of TaxCalculator!');
  process.exit(1);
}

const beforeYe = newContent.substring(0, yeStartIndex);
const afterYe = newContent.substring(closingBraceIndex);

newContent = beforeYe + compatibilityWrappers + '\n' + afterYe;

fs.writeFileSync(targetPath, newContent, 'utf8');
console.log('Successfully patched tax-calculator.js!');
