const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log("Launching browser for E2E verification...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let pageErrors = [];
  page.on('pageerror', err => {
    console.error('Page Error:', err.message);
    pageErrors.push(err.message);
  });
  page.on('console', msg => {
    console.log('PAGE CONSOLE:', msg.text());
  });

  const url = 'file:///' + path.resolve(__dirname, 'index.html');
  await page.goto(url);
  console.log("Page loaded.");

  // Check state of Spouse B container initially
  await page.evaluate(() => {
    console.log('Initial Spouse B display:', document.getElementById('spouse-b-container').style.display);
    const btn = document.querySelector('.segment-btn[data-segment="profile-b"]');
    if (btn) {
      console.log('Btn found, clicking programmatically...');
      btn.click();
      console.log('Spouse B display after click:', document.getElementById('spouse-b-container').style.display);
    } else {
      console.log('Btn NOT found!');
    }
  });

  await browser.close();
  process.exit(0);
})();
