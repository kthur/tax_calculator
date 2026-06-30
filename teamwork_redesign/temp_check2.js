const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE ERROR STACK:', err.stack || err.message);
  });
  
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });

  const url = 'file:///' + path.resolve(__dirname, 'index.html');
  console.log('Loading URL:', url);
  await page.goto(url);
  
  await browser.close();
})();
