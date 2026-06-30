const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.stack || err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('CONSOLE ERROR:', msg.text());
    } else {
      console.log('CONSOLE:', msg.text());
    }
  });

  const url = 'http://localhost:8080/';
  console.log('Loading URL:', url);
  await page.goto(url);
  
  console.log('Clicking profile-a button...');
  await page.click('.profile-segment-wrapper .segment-btn[data-segment="profile-a"]');
  
  console.log('Entering wage...');
  await page.fill('#inc-a-wage', '70000000');
  await page.dispatchEvent('#inc-a-wage', 'input');
  await page.dispatchEvent('#inc-a-wage', 'change');

  console.log('Clicking calculate...');
  await page.click('#btn-calc-income-integrated');

  console.log('Waiting for calculation to complete...');
  await page.waitForTimeout(1000);

  const result = await page.locator('#res-a-total').textContent();
  console.log('Result for Spouse A:', result);

  await browser.close();
})();
