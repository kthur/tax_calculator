const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/');
  
  const results = await page.evaluate(() => {
    return {
      windowTaxCalculator: typeof window.TaxCalculator,
      directTaxCalculator: typeof TaxCalculator,
      directTaxOptimizer: typeof TaxOptimizer,
      directTaxStore: typeof TaxStore,
      windowTaxStore: typeof window.TaxStore
    };
  });
  console.log('Global checks:', results);
  
  await browser.close();
})();
