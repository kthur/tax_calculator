/**
 * 맞벌이 연말정산 최적 배정 및 가족 간 자산 이전 절세 시뮬레이터 (금융자산 소득 분산 포함)
 */

const TaxOptimizer = {
  // 1. 맞벌이 부부 연말정산 몰아주기 (부양가족 배정 조합 시뮬레이션)
  optimizeCoupleYearEnd({ personA, personB, dependents }) {
    const depCount = dependents.length;
    let bestAssignment = null;
    let minCoupleTax = Infinity;
    
    const maxCombinations = Math.pow(2, depCount);
    
    for (let c = 0; c < maxCombinations; c++) {
      const aDeps = [];
      const bDeps = [];
      
      let aCardSum = personA.card || 0;
      let aCashSum = personA.cash || 0;
      let aMedicalSum = 0;
      let aEduSum = 0;
      let aChildCount = 0;

      let bCardSum = personB.card || 0;
      let bCashSum = personB.cash || 0;
      let bMedicalSum = 0;
      let bEduSum = 0;
      let bChildCount = 0;

      let aSenior = false, aDisabled = false, aBirth = false, aBirthOrder = 1;
      let bSenior = false, bDisabled = false, bBirth = false, bBirthOrder = 1;

      for (let i = 0; i < depCount; i++) {
        const dep = dependents[i];
        const isB = (c >> i) & 1;
        
        if (isB) {
          bDeps.push(dep);
          bCardSum += dep.card || 0;
          bMedicalSum += dep.medical || 0;
          bEduSum += dep.edu || 0;
          if (dep.relation === 'child') bChildCount++;
          if (dep.senior) bSenior = true;
          if (dep.disabled) bDisabled = true;
          if (dep.birth) { bBirth = true; bBirthOrder = dep.birthOrder; }
        } else {
          aDeps.push(dep);
          aCardSum += dep.card || 0;
          aMedicalSum += dep.medical || 0;
          aEduSum += dep.edu || 0;
          if (dep.relation === 'child') aChildCount++;
          if (dep.senior) aSenior = true;
          if (dep.disabled) aDisabled = true;
          if (dep.birth) { aBirth = true; aBirthOrder = dep.birthOrder; }
        }
      }

      // 의료비 몰아주기 예외 조합 시뮬레이션
      const medicalScenarios = [
        { aMed: aMedicalSum + bMedicalSum, bMed: 0 },
        { aMed: 0, bMed: aMedicalSum + bMedicalSum }
      ];

      for (const med of medicalScenarios) {
        const aProfile = {
          wage: personA.wage !== undefined ? personA.wage : 0,
          bizGenRevenue: personA.bizGenRevenue !== undefined ? personA.bizGenRevenue : 0,
          bizGenExpense: personA.bizGenExpense !== undefined ? personA.bizGenExpense : 0,
          bizRentRevenue: personA.bizRentRevenue !== undefined ? personA.bizRentRevenue : 0,
          bizRentExpense: personA.bizRentExpense !== undefined ? personA.bizRentExpense : 0,
          interestDom: personA.interestDom !== undefined ? personA.interestDom : 0,
          dividendDom: personA.dividendDom !== undefined ? personA.dividendDom : 0,
          interestOverseas: personA.interestOverseas !== undefined ? personA.interestOverseas : 0,
          dividendOverseas: personA.dividendOverseas !== undefined ? personA.dividendOverseas : 0,
          pensionPub: personA.pensionPub !== undefined ? personA.pensionPub : 0,
          pensionPri: personA.pensionPri !== undefined ? personA.pensionPri : 0,
          otherRevenue: personA.otherRevenue !== undefined ? personA.otherRevenue : 0,
          otherExpense: personA.otherExpense !== undefined ? personA.otherExpense : 0,

          pensionSavings: personA.pension !== undefined ? personA.pension : 0,
          irpSavings: personA.irp !== undefined ? personA.irp : 0,
          yellowUmbrella: personA.yellowUmbrella !== undefined ? personA.yellowUmbrella : 0,
          ventureInvestment: personA.ventureInvestment !== undefined ? personA.ventureInvestment : 0,
          housingSubscription: personA.housingSubscription !== undefined ? personA.housingSubscription : 0,
          housingLoanRepay: personA.housingLoanRepay !== undefined ? personA.housingLoanRepay : 0,
          isaIncome: personA.isaIncome !== undefined ? personA.isaIncome : 0,
          isaType: personA.isaType !== undefined ? personA.isaType : 'general',
          bondSeparated: personA.bondSeparated !== undefined ? personA.bondSeparated : 0,
          isSmeEmployee: personA.SME !== undefined ? personA.SME : false,

          dependentsCount: aDeps.length,
          cardUsage: aCardSum,
          cashUsage: aCashSum,
          medicalExpense: med.aMed,
          educationExpense: aEduSum,
          childrenCount: aChildCount,
          hasSeniorDependent: aSenior,
          hasDisabledDependent: aDisabled,
          hasBirthOrAdoption: aBirth,
          birthOrder: aBirthOrder
        };

        const bProfile = {
          wage: personB.wage !== undefined ? personB.wage : 0,
          bizGenRevenue: personB.bizGenRevenue !== undefined ? personB.bizGenRevenue : 0,
          bizGenExpense: personB.bizGenExpense !== undefined ? personB.bizGenExpense : 0,
          bizRentRevenue: personB.bizRentRevenue !== undefined ? personB.bizRentRevenue : 0,
          bizRentExpense: personB.bizRentExpense !== undefined ? personB.bizRentExpense : 0,
          interestDom: personB.interestDom !== undefined ? personB.interestDom : 0,
          dividendDom: personB.dividendDom !== undefined ? personB.dividendDom : 0,
          interestOverseas: personB.interestOverseas !== undefined ? personB.interestOverseas : 0,
          dividendOverseas: personB.dividendOverseas !== undefined ? personB.dividendOverseas : 0,
          pensionPub: personB.pensionPub !== undefined ? personB.pensionPub : 0,
          pensionPri: personB.pensionPri !== undefined ? personB.pensionPri : 0,
          otherRevenue: personB.otherRevenue !== undefined ? personB.otherRevenue : 0,
          otherExpense: personB.otherExpense !== undefined ? personB.otherExpense : 0,

          pensionSavings: personB.pension !== undefined ? personB.pension : 0,
          irpSavings: personB.irp !== undefined ? personB.irp : 0,
          yellowUmbrella: personB.yellowUmbrella !== undefined ? personB.yellowUmbrella : 0,
          ventureInvestment: personB.ventureInvestment !== undefined ? personB.ventureInvestment : 0,
          housingSubscription: personB.housingSubscription !== undefined ? personB.housingSubscription : 0,
          housingLoanRepay: personB.housingLoanRepay !== undefined ? personB.housingLoanRepay : 0,
          isaIncome: personB.isaIncome !== undefined ? personB.isaIncome : 0,
          isaType: personB.isaType !== undefined ? personB.isaType : 'general',
          bondSeparated: personB.bondSeparated !== undefined ? personB.bondSeparated : 0,
          isSmeEmployee: personB.SME !== undefined ? personB.SME : false,

          dependentsCount: bDeps.length,
          cardUsage: bCardSum,
          cashUsage: bCashSum,
          medicalExpense: med.bMed,
          educationExpense: bEduSum,
          childrenCount: bChildCount,
          hasSeniorDependent: bSenior,
          hasDisabledDependent: bDisabled,
          hasBirthOrAdoption: bBirth,
          birthOrder: bBirthOrder
        };

        const aResult = TaxCalculator.calculateTax(aProfile);
        const bResult = TaxCalculator.calculateTax(bProfile);

        const coupleTax = aResult.totalTax + bResult.totalTax;

        if (coupleTax < minCoupleTax) {
          minCoupleTax = coupleTax;
          bestAssignment = {
            combinationIndex: c,
            medicalTarget: med.aMed > 0 ? 'a' : 'b',
            aDeps: aDeps.map(d => d.name),
            bDeps: bDeps.map(d => d.name),
            aTax: aResult.totalTax,
            bTax: bResult.totalTax,
            totalTax: coupleTax,
            aResult: aResult,
            bResult: bResult
          };
        }
      }
    }

    const allATax = this.getCoupleTaxWithTarget(personA, personB, dependents, 'a');
    const allBTax = this.getCoupleTaxWithTarget(personA, personB, dependents, 'b');

    return {
      best: bestAssignment,
      minCoupleTax,
      allATax,
      allBTax,
      savings: Math.max(0, Math.min(allATax, allBTax) - minCoupleTax)
    };
  },

  getCoupleTaxWithTarget(personA, personB, dependents, target) {
    const isBTarget = target === 'b';
    const aDeps = isBTarget ? [] : dependents;
    const bDeps = isBTarget ? dependents : [];

    const aSenior = !isBTarget && dependents.some(d => d.senior);
    const aDisabled = !isBTarget && dependents.some(d => d.disabled);
    const aBirth = !isBTarget && dependents.some(d => d.birth);
    const aBirthOrder = (!isBTarget && dependents.find(d => d.birth)) ? dependents.find(d => d.birth).birthOrder : 1;

    const bSenior = isBTarget && dependents.some(d => d.senior);
    const bDisabled = isBTarget && dependents.some(d => d.disabled);
    const bBirth = isBTarget && dependents.some(d => d.birth);
    const bBirthOrder = (isBTarget && dependents.find(d => d.birth)) ? dependents.find(d => d.birth).birthOrder : 1;

    const aCardSum = (personA.card || 0) + (isBTarget ? 0 : dependents.reduce((sum, d) => sum + d.card, 0));
    const bCardSum = (personB.card || 0) + (isBTarget ? dependents.reduce((sum, d) => sum + d.card, 0) : 0);

    const aCashSum = personA.cash || 0;
    const bCashSum = personB.cash || 0;

    const aMedicalSum = isBTarget ? 0 : dependents.reduce((sum, d) => sum + d.medical, 0);
    const bMedicalSum = isBTarget ? dependents.reduce((sum, d) => sum + d.medical, 0) : 0;

    const aEduSum = isBTarget ? 0 : dependents.reduce((sum, d) => sum + d.edu, 0);
    const bEduSum = isBTarget ? dependents.reduce((sum, d) => sum + d.edu, 0) : 0;

    const aChildCount = isBTarget ? 0 : dependents.filter(d => d.relation === 'child').length;
    const bChildCount = isBTarget ? dependents.filter(d => d.relation === 'child').length : 0;

    const aProfile = {
      wage: personA.wage !== undefined ? personA.wage : 0,
      bizGenRevenue: personA.bizGenRevenue !== undefined ? personA.bizGenRevenue : 0,
      bizGenExpense: personA.bizGenExpense !== undefined ? personA.bizGenExpense : 0,
      bizRentRevenue: personA.bizRentRevenue !== undefined ? personA.bizRentRevenue : 0,
      bizRentExpense: personA.bizRentExpense !== undefined ? personA.bizRentExpense : 0,
      interestDom: personA.interestDom !== undefined ? personA.interestDom : 0,
      dividendDom: personA.dividendDom !== undefined ? personA.dividendDom : 0,
      interestOverseas: personA.interestOverseas !== undefined ? personA.interestOverseas : 0,
      dividendOverseas: personA.dividendOverseas !== undefined ? personA.dividendOverseas : 0,
      pensionPub: personA.pensionPub !== undefined ? personA.pensionPub : 0,
      pensionPri: personA.pensionPri !== undefined ? personA.pensionPri : 0,
      otherRevenue: personA.otherRevenue !== undefined ? personA.otherRevenue : 0,
      otherExpense: personA.otherExpense !== undefined ? personA.otherExpense : 0,

      pensionSavings: personA.pension !== undefined ? personA.pension : 0,
      irpSavings: personA.irp !== undefined ? personA.irp : 0,
      yellowUmbrella: personA.yellowUmbrella !== undefined ? personA.yellowUmbrella : 0,
      ventureInvestment: personA.ventureInvestment !== undefined ? personA.ventureInvestment : 0,
      housingSubscription: personA.housingSubscription !== undefined ? personA.housingSubscription : 0,
      housingLoanRepay: personA.housingLoanRepay !== undefined ? personA.housingLoanRepay : 0,
      isaIncome: personA.isaIncome !== undefined ? personA.isaIncome : 0,
      isaType: personA.isaType !== undefined ? personA.isaType : 'general',
      bondSeparated: personA.bondSeparated !== undefined ? personA.bondSeparated : 0,
      isSmeEmployee: personA.SME !== undefined ? personA.SME : false,

      dependentsCount: aDeps.length,
      cardUsage: aCardSum,
      cashUsage: aCashSum,
      medicalExpense: aMedicalSum,
      educationExpense: aEduSum,
      childrenCount: aChildCount,
      hasSeniorDependent: aSenior,
      hasDisabledDependent: aDisabled,
      hasBirthOrAdoption: aBirth,
      birthOrder: aBirthOrder
    };

    const bProfile = {
      wage: personB.wage !== undefined ? personB.wage : 0,
      bizGenRevenue: personB.bizGenRevenue !== undefined ? personB.bizGenRevenue : 0,
      bizGenExpense: personB.bizGenExpense !== undefined ? personB.bizGenExpense : 0,
      bizRentRevenue: personB.bizRentRevenue !== undefined ? personB.bizRentRevenue : 0,
      bizRentExpense: personB.bizRentExpense !== undefined ? personB.bizRentExpense : 0,
      interestDom: personB.interestDom !== undefined ? personB.interestDom : 0,
      dividendDom: personB.dividendDom !== undefined ? personB.dividendDom : 0,
      interestOverseas: personB.interestOverseas !== undefined ? personB.interestOverseas : 0,
      dividendOverseas: personB.dividendOverseas !== undefined ? personB.dividendOverseas : 0,
      pensionPub: personB.pensionPub !== undefined ? personB.pensionPub : 0,
      pensionPri: personB.pensionPri !== undefined ? personB.pensionPri : 0,
      otherRevenue: personB.otherRevenue !== undefined ? personB.otherRevenue : 0,
      otherExpense: personB.otherExpense !== undefined ? personB.otherExpense : 0,

      pensionSavings: personB.pension !== undefined ? personB.pension : 0,
      irpSavings: personB.irp !== undefined ? personB.irp : 0,
      yellowUmbrella: personB.yellowUmbrella !== undefined ? personB.yellowUmbrella : 0,
      ventureInvestment: personB.ventureInvestment !== undefined ? personB.ventureInvestment : 0,
      housingSubscription: personB.housingSubscription !== undefined ? personB.housingSubscription : 0,
      housingLoanRepay: personB.housingLoanRepay !== undefined ? personB.housingLoanRepay : 0,
      isaIncome: personB.isaIncome !== undefined ? personB.isaIncome : 0,
      isaType: personB.isaType !== undefined ? personB.isaType : 'general',
      bondSeparated: personB.bondSeparated !== undefined ? personB.bondSeparated : 0,
      isSmeEmployee: personB.SME !== undefined ? personB.SME : false,

      dependentsCount: bDeps.length,
      cardUsage: bCardSum,
      cashUsage: bCashSum,
      medicalExpense: bMedicalSum,
      educationExpense: bEduSum,
      childrenCount: bChildCount,
      hasSeniorDependent: bSenior,
      hasDisabledDependent: bDisabled,
      hasBirthOrAdoption: bBirth,
      birthOrder: bBirthOrder
    };

    const aResult = TaxCalculator.calculateTax(aProfile);
    const bResult = TaxCalculator.calculateTax(bProfile);

    return aResult.totalTax + bResult.totalTax;
  },

  // 2. 해외주식/부동산 배우자 증여 후 매도 시뮬레이터
  optimizeGiftAndSell({ type, originalPurchasePrice, currentPrice, years = 0, giftLimit = 600000000 }) {
    const originalGain = Math.max(0, currentPrice - originalPurchasePrice);
    
    let originalTax = 0;
    let afterGiftTax = 0;

    // Calculate original tax first
    if (type === 'stock') {
      const originalTaxable = Math.max(0, originalGain - 2500000);
      originalTax = Math.floor(originalTaxable * 0.22);
    } else {
      const origCalc = TaxCalculator.calculateCapitalGains({
        type: 'real_estate',
        purchasePrice: originalPurchasePrice,
        sellPrice: currentPrice,
        holdingPeriodMonths: 24,
        houseCount: 2
      });
      originalTax = origCalc.totalTax;
    }

    // Determine if carryover tax applies
    let isCarryoverTaxApplied = false;
    if (type === 'stock' && years < 1) {
      isCarryoverTaxApplied = true;
    } else if (type === 'real_estate' && years < 10) {
      isCarryoverTaxApplied = true;
    }

    const giftAmount = isCarryoverTaxApplied ? 0 : Math.min(currentPrice, giftLimit);

    if (isCarryoverTaxApplied) {
      afterGiftTax = originalTax;
    } else {
      if (type === 'stock') {
        const afterGain = Math.max(0, currentPrice - giftAmount);
        const afterTaxable = Math.max(0, afterGain - 2500000);
        afterGiftTax = Math.floor(afterTaxable * 0.22);
      } else {
        const afterCalc = TaxCalculator.calculateCapitalGains({
          type: 'real_estate',
          purchasePrice: giftAmount,
          sellPrice: currentPrice,
          holdingPeriodMonths: 120,
          houseCount: 2
        });
        afterGiftTax = afterCalc.totalTax;
      }
    }

    return {
      originalGain,
      originalTax,
      afterGiftTax,
      savings: Math.max(0, originalTax - afterGiftTax),
      giftAmount,
      isCarryoverTaxApplied
    };
  },

  // 3. 공동대표 소득 분배 최적화 (종합소득세 분산)
  optimizeIncomeDistribution({ members, totalDistributeAmount }) {
    const memberCount = members.length;
    if (memberCount < 2) return null;

    let bestDistribution = [];
    let minTotalTax = Infinity;
    const steps = 20; 
    
    function recurse(index, currentAllocations, remainingSum) {
      if (index === memberCount - 1) {
        currentAllocations.push(remainingSum);
        
        let totalTaxSum = 0;
        const currentTaxDetails = [];
        
        for (let i = 0; i < memberCount; i++) {
          const alloc = currentAllocations[i];
          const newIncome = members[i].existingIncome + alloc;
          const result = TaxCalculator.calculateComprehensiveIncome({
            totalIncome: newIncome,
            incomeType: 'business',
            expense: 0
          });
          
          totalTaxSum += result.totalTax;
          currentTaxDetails.push({
            id: members[i].id,
            name: members[i].name,
            allocated: alloc,
            existingIncome: members[i].existingIncome,
            totalIncome: newIncome,
            tax: result.totalTax
          });
        }

        if (totalTaxSum < minTotalTax) {
          minTotalTax = totalTaxSum;
          bestDistribution = JSON.parse(JSON.stringify(currentTaxDetails));
        }
        
        currentAllocations.pop();
        return;
      }

      for (let i = 0; i <= steps; i++) {
        const alloc = Math.floor((totalDistributeAmount * i) / steps);
        if (alloc <= remainingSum) {
          currentAllocations.push(alloc);
          recurse(index + 1, currentAllocations, remainingSum - alloc);
          currentAllocations.pop();
        }
      }
    }

    recurse(0, [], totalDistributeAmount);

    let singleTaxSum = 0;
    const singleDetails = members.map((m, idx) => {
      const alloc = idx === 0 ? totalDistributeAmount : 0;
      const result = TaxCalculator.calculateComprehensiveIncome({
        totalIncome: m.existingIncome + alloc,
        incomeType: 'business',
        expense: 0
      });
      singleTaxSum += result.totalTax;
      return { name: m.name, allocated: alloc, tax: result.totalTax };
    });

    let equalTaxSum = 0;
    const equalDetails = members.map(m => {
      const alloc = Math.floor(totalDistributeAmount / memberCount);
      const result = TaxCalculator.calculateComprehensiveIncome({
        totalIncome: m.existingIncome + alloc,
        incomeType: 'business',
        expense: 0
      });
      equalTaxSum += result.totalTax;
      return { name: m.name, allocated: alloc, tax: result.totalTax };
    });

    return {
      best: bestDistribution,
      minTotalTax,
      singleTaxSum,
      singleDetails,
      equalTaxSum,
      equalDetails,
      savings: Math.max(0, equalTaxSum - minTotalTax),
      singleSavings: Math.max(0, singleTaxSum - minTotalTax)
    };
  }
};
