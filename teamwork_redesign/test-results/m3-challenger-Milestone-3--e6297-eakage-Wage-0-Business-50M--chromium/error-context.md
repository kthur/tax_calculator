# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: m3-challenger.spec.js >> Milestone 3 UI input data parsing and validation tests >> 1. No special credit leakage (Wage = 0, Business = 50M)
- Location: tests\m3-challenger.spec.js:14:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#inc-a-wage')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e5]
      - generic [ref=e8]:
        - heading "TAX NAVI" [level=1] [ref=e9]
        - paragraph [ref=e10]: 소득세 · 부가세 · ISA · 양도/증여/상속 통합 절세 시뮬레이터
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: 🔒
        - generic [ref=e14]: 100% 브라우저 내 처리 · 데이터 전송 없음
      - button "🌙 다크 모드" [ref=e15] [cursor=pointer]:
        - generic [ref=e16]: 🌙
        - generic [ref=e17]: 다크 모드
  - tablist "메인 메뉴" [ref=e18]:
    - tab "👤 가족 프로필" [selected] [ref=e19] [cursor=pointer]
    - tab "📊 소득세·연말정산" [ref=e20] [cursor=pointer]
    - tab "🏢 사업·자산" [ref=e21] [cursor=pointer]
    - tab "🏠 양도·증여·상속" [ref=e22] [cursor=pointer]
    - tab "🏆 통합 리포트" [ref=e23] [cursor=pointer]
  - tabpanel "가족 프로필" [ref=e24]:
    - generic [ref=e25]:
      - heading "👤 가족 프로필 (통합 입력)" [level=2] [ref=e26]
      - generic [ref=e27]:
        - generic [ref=e28] [cursor=pointer]:
          - generic [ref=e29]: "1"
          - generic [ref=e30]: 배우자 A
        - generic [ref=e32] [cursor=pointer]:
          - generic [ref=e33]: "2"
          - generic [ref=e34]: 배우자 B
        - generic [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: "3"
          - generic [ref=e38]: 부양가족
      - generic [ref=e39]:
        - button "👨 배우자 A" [active] [ref=e40] [cursor=pointer]
        - button "👩 배우자 B" [ref=e41] [cursor=pointer]
        - button "👥 부양가족" [ref=e42] [cursor=pointer]
      - button "📄 홈택스 PDF로 자동 입력하기 ▼" [ref=e44] [cursor=pointer]:
        - generic [ref=e45]: 📄 홈택스 PDF로 자동 입력하기
        - generic [ref=e46]: ▼
      - generic [ref=e47]:
        - generic [ref=e48]:
          - 'heading "📌 1단계: 배우자 A 기본정보 ▲" [level=4] [ref=e50] [cursor=pointer]':
            - generic [ref=e51]: "📌 1단계: 배우자 A 기본정보"
            - generic [ref=e52]: ▲
          - generic [ref=e53]:
            - generic [ref=e54]:
              - generic [ref=e55]:
                - text: 근로소득 (총급여)
                - tooltip "연간 총 근로소득(총급여액)입니다. ?" [ref=e56]
              - textbox [ref=e57]: 70,000,000
            - generic [ref=e58]:
              - generic [ref=e59]:
                - generic [ref=e60]:
                  - text: 사업소득 총수입(매출)
                  - tooltip "연간 총 사업 매출액입니다. ?" [ref=e61]
                - textbox [ref=e62]: "0"
              - generic [ref=e63]:
                - generic [ref=e64]:
                  - text: 사업소득 필요경비(지출)
                  - tooltip "사업수행을 위해 지출한 경비입니다. ?" [ref=e65]
                - textbox [ref=e66]: "0"
            - generic [ref=e67]:
              - generic [ref=e68]:
                - generic [ref=e69]:
                  - text: 연금소득 (종합과세대상)
                  - tooltip "공적연금 및 종합과세 대상 사적연금 수령액입니다. ?" [ref=e70]
                - textbox [ref=e71]: "0"
              - generic [ref=e72]:
                - generic [ref=e73]:
                  - text: 기타소득 총수입
                  - tooltip "일시적인 강연료, 상금 등의 총 수입입니다. ?" [ref=e74]
                - generic [ref=e75]:
                  - textbox [ref=e76]: "0"
                  - button "✖"
                - generic [ref=e77]: 0원
                - generic [ref=e78]:
                  - button "원" [ref=e79] [cursor=pointer]
                  - button "만원" [ref=e80] [cursor=pointer]
                  - button "억원" [ref=e81] [cursor=pointer]
            - generic [ref=e83]:
              - generic [ref=e84]:
                - text: 기타소득 필요경비
                - tooltip "기타소득을 위해 소요된 필요경비입니다. ?" [ref=e85]
              - generic [ref=e86]:
                - textbox [ref=e87]: "0"
                - button "✖"
              - generic [ref=e88]: 0원
              - generic [ref=e89]:
                - button "원" [ref=e90] [cursor=pointer]
                - button "만원" [ref=e91] [cursor=pointer]
                - button "억원" [ref=e92] [cursor=pointer]
            - generic [ref=e94]:
              - generic [ref=e95]:
                - text: 신용카드 사용액
                - tooltip "본인 명의 신용카드/체크카드 연간 사용액입니다. 총급여의 25% 초과분부터 소득공제가 적용됩니다. ?" [ref=e96]
              - generic [ref=e97]:
                - textbox [ref=e98]: 12,000,000
                - button "✖" [ref=e99] [cursor=pointer]
              - generic [ref=e100]: 1,200만 원
              - generic [ref=e101]:
                - button "원" [ref=e102] [cursor=pointer]
                - button "만원" [ref=e103] [cursor=pointer]
                - button "억원" [ref=e104] [cursor=pointer]
            - generic [ref=e106]:
              - generic [ref=e107]:
                - text: 노란우산공제 납입
                - tooltip "소기업·소상공인 공제(노란우산) 연간 납입액입니다. 500만 원 한도 내에서 소득공제됩니다. ?" [ref=e108]
              - textbox [ref=e109]: "0"
            - generic [ref=e110]:
              - generic [ref=e111]:
                - text: 연금저축 납입
                - tooltip "연금저축(펀드/신탁/보험) 연간 납입액입니다. 총급여에 따라 300만~600만 원 한도로 세액공제됩니다. ?" [ref=e112]
              - textbox [ref=e113]: "0"
            - generic [ref=e114]:
              - generic [ref=e115]:
                - text: IRP 추가 납입
                - tooltip "개인형퇴직연금(IRP) 추가 납입액입니다. 연금저축과 합산하여 최대 900만 원까지 세액공제됩니다. ?" [ref=e116]
              - generic [ref=e117]:
                - textbox [ref=e118]: "0"
                - button "✖"
              - generic [ref=e119]: 0원
              - generic [ref=e120]:
                - button "원" [ref=e121] [cursor=pointer]
                - button "만원" [ref=e122] [cursor=pointer]
                - button "억원" [ref=e123] [cursor=pointer]
            - generic [ref=e125]:
              - heading "💰 배우자 A 금융소득" [level=5] [ref=e126]
              - generic [ref=e127]:
                - generic [ref=e128]:
                  - text: 국내 일반 이자/배당
                  - tooltip "국내 금융기관의 이자소득과 배당소득 합계입니다. 2,000만 원 초과 시 금융소득종합과세 대상이 됩니다. ?" [ref=e129]
                - textbox [ref=e130]: "0"
              - generic [ref=e131]:
                - generic [ref=e132]:
                  - text: 해외 이자/배당 (무조건합산)
                  - tooltip "해외에서 발생한 이자/배당소득입니다. 금액에 관계없이 종합소득에 합산됩니다. ?" [ref=e133]
                - textbox [ref=e134]: "0"
              - generic [ref=e135]:
                - generic [ref=e136]:
                  - generic [ref=e137]:
                    - text: ISA 연수익
                    - tooltip "ISA 계좌에서 발생한 연간 수익(평가이익)입니다. ISA 유형에 따라 비과세 혜택이 적용됩니다. ?" [ref=e138]
                  - textbox [ref=e139]: "0"
                - generic [ref=e140]:
                  - generic [ref=e141]:
                    - text: ISA 유형
                    - tooltip "일반형(500만 한도)과 서민형(1,000만 한도, 조건 충족 시) 중 선택하세요. ?" [ref=e142]
                  - combobox [ref=e143]:
                    - option "일반(500만)" [selected]
                    - option "서민(1,000만)"
              - generic [ref=e144]:
                - generic [ref=e145]:
                  - text: 장기채권 분리과세(30%)
                  - tooltip "장기 회사채 등 분리과세 대상 채권의 이자소득입니다. 30% 분리과세(지방세 포함)가 적용됩니다. ?" [ref=e146]
                - textbox [ref=e147]: "0"
            - generic [ref=e148]:
              - heading "🚀 배우자 A 공제성 투자 & 주택자금" [level=5] [ref=e149]
              - generic [ref=e150]:
                - generic [ref=e151]:
                  - generic [ref=e152]:
                    - text: 벤처기업 투자금액
                    - tooltip "벤처기업 투자 시 투자금액의 100%~(최대 3,000만) 소득공제 또는 세액공제를 선택할 수 있습니다. ?" [ref=e153]
                  - textbox [ref=e154]: "0"
                - generic [ref=e155]:
                  - generic [ref=e156]:
                    - text: 주택청약저축 납입
                    - tooltip "주택청약종합저축 연간 납입액입니다. 총급여 7,000만 원 이하 시 소득공제 혜택이 있습니다. ?" [ref=e157]
                  - textbox [ref=e158]: "0"
              - generic [ref=e159]:
                - generic [ref=e160]:
                  - text: 전세대출 원리금상환액
                  - tooltip "전세자금대출의 연간 원리금 상환액입니다. 주택 마련 공제 대상입니다. ?" [ref=e161]
                - textbox [ref=e162]: "0"
        - text: 연간 총 근로소득(총급여액)입니다. 연간 총 사업 매출액입니다. 사업수행을 위해 지출한 경비입니다. 공적연금 및 종합과세 대상 사적연금 수령액입니다. 일시적인 강연료, 상금 등의 총 수입입니다. 기타소득을 위해 소요된 필요경비입니다. 본인 명의 신용카드/체크카드 연간 사용액입니다. 총급여의 25% 초과분부터 소득공제가 적용됩니다. 소기업·소상공인 공제(노란우산) 연간 납입액입니다. 500만 원 한도 내에서 소득공제됩니다. 연금저축(펀드/신탁/보험) 연간 납입액입니다. 총급여에 따라 300만~600만 원 한도로 세액공제됩니다. 개인형퇴직연금(IRP) 추가 납입액입니다. 연금저축과 합산하여 최대 900만 원까지 세액공제됩니다. 국내 금융기관의 이자소득과 배당소득 합계입니다. 2,000만 원 초과 시 금융소득종합과세 대상이 됩니다. 해외에서 발생한 이자/배당소득입니다. 금액에 관계없이 종합소득에 합산됩니다. ISA 계좌에서 발생한 연간 수익(평가이익)입니다. ISA 유형에 따라 비과세 혜택이 적용됩니다. 일반형(500만 한도)과 서민형(1,000만 한도, 조건 충족 시) 중 선택하세요. 장기 회사채 등 분리과세 대상 채권의 이자소득입니다. 30% 분리과세(지방세 포함)가 적용됩니다. 벤처기업 투자 시 투자금액의 100%~(최대 3,000만) 소득공제 또는 세액공제를 선택할 수 있습니다. 주택청약종합저축 연간 납입액입니다. 총급여 7,000만 원 이하 시 소득공제 혜택이 있습니다. 전세자금대출의 연간 원리금 상환액입니다. 주택 마련 공제 대상입니다.
      - text: 부양가족 명의의 신용카드/체크카드 사용액입니다. 기본공제를 받는 배우자에게 자동으로 합산되어 한도 내 소득공제됩니다. 해당 가족을 위해 지출한 연간 의료비입니다. 의료비 세액공제는 총급여의 3% 초과 지출액부터 15% 공제 혜택이 적용됩니다. 가족의 학원비, 학교 등록금 등 교육 비용입니다. 취학전아동/초중고생 1인당 연 300만원, 대학생 연 900만원 한도로 15% 공제됩니다. 본인 또는 부양가족 명의의 학자금 대출 상환 원리금입니다. 연 한도 없이 15% 세액공제를 받습니다.
      - generic [ref=e163]:
        - button "◀ 이전" [disabled] [ref=e164]
        - button "다음 ▶" [ref=e165] [cursor=pointer]
      - button "🎯 원스톱 절세 계산 & 시뮬레이션" [ref=e167] [cursor=pointer]
  - text: ▾ ▾ ▾ 연말정산 시 적용되는 연간 총급여액입니다. 올해 1월부터 현재까지 납입한 연금저축 총액입니다. 올해 1월부터 현재까지 납입한 IRP 총액입니다. 연간 총급여액을 입력하세요. 카드 소득공제 한도 계산에 사용됩니다. 올해 1월부터 현재까지의 신용카드 사용액입니다. 올해 1월부터 현재까지의 체크카드/현금 사용액입니다. 체크카드는 30% 공제율이 적용됩니다. 전통시장에서 신용/체크카드 사용 시 30% 공제율, 별도 한도 300만 원 대중교통(버스/지하철) 사용 시 40% 공제율, 별도 한도 300만 원 도서 구입/공연 관람 시 30% 공제율, 별도 한도 300만 원 (총급여 7천만↓) 연간 총급여액입니다. 7,000만 원 이하 시 체육시설 공제 혜택을 받을 수 있습니다. 수영장, 체육단련장 등 시설 이용료 연간 합계액입니다. 고향사랑기부제 연간 기부금액입니다. 200만 원 한도 내에서 세액공제됩니다. ISA 계좌에 납입한 연간 금액입니다. 2026년 개편으로 연 최대 4,000만 원까지 납입 가능합니다. 서민형 ISA 가입 자격 확인을 위한 연간 총급여입니다. ISA 만기 후 연금계좌로 전환하는 금액입니다. 전환 금액의 10% 세액공제(최대 300만 원) 혜택이 있습니다. 부가가치세 공급가액 기준 연간 매출액입니다. 부가가치세 공급가액 기준 연간 매입액입니다. 신용카드 매출에 대해 1.3%의 세액공제가 적용됩니다. 프리랜서 또는 사업자의 연간 총수입금액입니다. 부동산 또는 주식을 취득할 당시의 실제 매입 가격입니다. 부동산 또는 주식을 양도(매도)한 가격입니다. 자산을 취득한 후 보유한 개월 수입니다. 24개월 이상 보유 시 1세대 1주택 비과세 요건을 충족할 수 있습니다. 양도 시점 기준 보유 주택 수입니다. 해외주식 양도로 인한 실현 손익(매도가-매입가-수수료)입니다. 매수일과 매도일의 평균 환율입니다. 주택 공시가격(국토교통부 고시)입니다. 실제 시장 가격입니다. 공시가격과 다른 경우 입력합니다. 1주택자는 종합부동산세 공제 한도가 12억 원이며 공정시장가액비율 60%가 적용됩니다. 보유한 주택의 총 수량입니다. 2주택 이상이면서 고가주택(12억 초과)을 보유한 경우 간주임대료 과세 대상이 됩니다. 모든 임대주택의 전세보증금 합계액입니다. 12억 초과분에 대해 간주임대료가 산정됩니다. 전용면적 40㎡ 이하이면서 기준시가 2억 원 이하인 소형주택은 2026.12.31까지 간주임대료 과세에서 제외됩니다. 상속이 개시된 피상속인의 총 재산 가액입니다. 상속 대상 자녀 수입니다. 1인당 5억 원(2025 개정)의 자녀 공제가 적용됩니다. 배우자가 실제로 상속받는 금액입니다. 0 입력 시 최소공제(5억)만 적용됩니다. 예금, 주식 등 금융재산에서 금융부채를 차감한 금액입니다. 20%(최대 2억) 공제됩니다. 피상속인이 10년 이내에 상속인에게 사전 증여한 금액의 합계입니다. 혼인 또는 출산 시 증여하는 금액입니다. 최근 10년간 동일인에게 증여한 금액입니다. 증여 대상 자녀의 현재 만 나이입니다. 10년 단위 비과세 증여 플랜 생성에 사용됩니다. 이번에 증여할 금액입니다. 최근 10년간 동일인에게 증여한 금액입니다. 증여세는 10년간 누계로 계산됩니다. 증여자가 원래 자산을 취득할 당시의 가격입니다. 증여일 현재의 자산 평가액(시가)입니다. ▾ ▾
  - contentinfo [ref=e168]: 본 계산기는 입력된 데이터를 바탕으로 한 모의 시뮬레이션 결과이며, 사용자의 실제 세액 및 공제 요건에 따라 차이가 발생할 수 있습니다. 정확한 과세 여부는 세무 전문가와 상의하시기 바랍니다.
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | // Helper to fill inputs reliably
  4   | async function fillInput(page, id, val) {
  5   |   const el = page.locator(`#${id}`);
> 6   |   await el.fill('');
      |            ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  7   |   await el.fill(val.toString());
  8   |   await el.dispatchEvent('input');
  9   |   await el.dispatchEvent('change');
  10  | }
  11  | 
  12  | test.describe('Milestone 3 UI input data parsing and validation tests', () => {
  13  | 
  14  |   test('1. No special credit leakage (Wage = 0, Business = 50M)', async ({ page }) => {
  15  |     await page.goto('/');
  16  | 
  17  |     // Select Spouse A segment
  18  |     await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
  19  | 
  20  |     // Fill inputs: Wage = 0, Biz Gen Revenue = 50M, Biz Gen Expense = 10M, Card = 10M
  21  |     await fillInput(page, 'inc-a-wage', '0');
  22  |     await fillInput(page, 'inc-a-biz-gen-revenue', '50000000');
  23  |     await fillInput(page, 'inc-a-biz-gen-expense', '10000000');
  24  |     await fillInput(page, 'inc-a-card', '10000000');
  25  | 
  26  |     // Add a dependent with medical expense = 5M
  27  |     await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-dep"]');
  28  |     
  29  |     // Clear any existing dependents, then add one
  30  |     await page.evaluate(() => {
  31  |       document.querySelectorAll('#inc-couple-ye-people .btn-remove-person').forEach(b => b.click());
  32  |     });
  33  |     await page.click('#btn-add-couple-dep');
  34  |     const medicalInput = page.locator('#inc-couple-ye-people .person-card .opt-dep-medical').first();
  35  |     await medicalInput.fill('5000000');
  36  |     await medicalInput.dispatchEvent('input');
  37  |     await medicalInput.dispatchEvent('change');
  38  | 
  39  |     // Click calculate
  40  |     await page.click('#btn-calc-income-integrated');
  41  | 
  42  |     // Calculate directly and verify inside the browser context
  43  |     const aResult = await page.evaluate(() => {
  44  |       return window.TaxCalculator.calculateComprehensiveIncome({
  45  |         wage: 0,
  46  |         bizGenRevenue: 50000000,
  47  |         bizGenExpense: 10000000,
  48  |         cardUsage: 10000000,
  49  |         medicalExpense: 5000000
  50  |       });
  51  |     });
  52  | 
  53  |     console.log('Task 1 - calculateComprehensiveIncome result:', aResult);
  54  |     expect(aResult.cardDeduction).toBe(0);
  55  |     expect(aResult.medicalCredit).toBe(0);
  56  |   });
  57  | 
  58  |   test('2. Compared tax calculations (Financial Income > 20M)', async ({ page }) => {
  59  |     await page.goto('/');
  60  | 
  61  |     const result = await page.evaluate(() => {
  62  |       // Interest = 30M (total financial > 20M), other income = 0
  63  |       return window.TaxCalculator.calculateComprehensiveIncome({
  64  |         wage: 0,
  65  |         interestDom: 30000000
  66  |       });
  67  |     });
  68  | 
  69  |     console.log('Task 2 - calculateComprehensiveIncome result:', result);
  70  |     // Method 1: progressive tax on (other income + excess financial income) + 20M * 14%
  71  |     // Method 2: progressive tax on other income + total financial income * 14%
  72  |     // Since other income = 0, Method 2 = 0 + 30M * 0.14 = 4,200,000 KRW.
  73  |     // Method 1 = calculatedIncomeTax(10M) + 20M * 14% = 600,000 + 2,800,000 = 3,400,000 KRW.
  74  |     // Max(3.4M, 4.2M) = 4,200,000 KRW.
  75  |     expect(result.calculatedTax).toBe(4200000);
  76  |   });
  77  | 
  78  |   test('3. Loss offset leakage (Rental loss vs General business loss)', async ({ page }) => {
  79  |     await page.goto('/');
  80  | 
  81  |     const resRentalLoss = await page.evaluate(() => {
  82  |       return window.TaxCalculator.calculateComprehensiveIncome({
  83  |         wage: 50000000,
  84  |         bizRentRevenue: 10000000,
  85  |         bizRentExpense: 20000000
  86  |       });
  87  |     });
  88  | 
  89  |     const resNoLoss = await page.evaluate(() => {
  90  |       return window.TaxCalculator.calculateComprehensiveIncome({
  91  |         wage: 50000000,
  92  |         bizRentRevenue: 0,
  93  |         bizRentExpense: 0
  94  |       });
  95  |     });
  96  | 
  97  |     const resGenLoss = await page.evaluate(() => {
  98  |       return window.TaxCalculator.calculateComprehensiveIncome({
  99  |         wage: 50000000,
  100 |         bizGenRevenue: 10000000,
  101 |         bizGenExpense: 20000000
  102 |       });
  103 |     });
  104 | 
  105 |     console.log('Task 3 - Rental Loss TotalComprehensiveIncome:', resRentalLoss.TotalComprehensiveIncome);
  106 |     console.log('Task 3 - No Loss TotalComprehensiveIncome:', resNoLoss.TotalComprehensiveIncome);
```