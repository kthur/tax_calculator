const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
  
  page.on('request', req => console.log('REQ:', req.url()));
  page.on('response', res => console.log('RES:', res.status(), res.url()));
  page.on('requestfailed', req => console.error('REQ FAILED:', req.url(), req.failure().errorText));

  console.log('Navigating to http://localhost:8080/ ...');
  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'load', timeout: 5000 });
    console.log('Navigation completed.');
    const hasTaxCalc = await page.evaluate(() => {
      return typeof window.TaxCalculator;
    });
    console.log('window.TaxCalculator type:', hasTaxCalc);
  } catch (e) {
    console.error('Error during navigation:', e.message);
  }
  
  await browser.close();
})();
