const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const url = 'file:///' + path.resolve(__dirname, 'index.html');
  await page.goto(url);
  
  const hasCapitalType = await page.evaluate(() => {
    const el = document.getElementById('capital-type');
    return el ? { id: el.id, tagName: el.tagName, outerHTML: el.outerHTML.substring(0, 100) } : null;
  });
  console.log('capital-type element in page:', hasCapitalType);
  
  await browser.close();
})();
