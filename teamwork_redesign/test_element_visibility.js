const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:8080/');
  
  const visibilityInfo = await page.evaluate(() => {
    const el = document.getElementById('inc-a-wage');
    if (!el) return { exists: false };
    
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    
    // Check parents
    let parent = el.parentElement;
    const parentChain = [];
    while (parent) {
      parentChain.push({
        id: parent.id,
        className: parent.className,
        display: window.getComputedStyle(parent).display,
        visibility: window.getComputedStyle(parent).visibility
      });
      parent = parent.parentElement;
    }
    
    return {
      exists: true,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      width: rect.width,
      height: rect.height,
      parentChain
    };
  });
  
  console.log('Visibility details for inc-a-wage:', JSON.stringify(visibilityInfo, null, 2));
  await browser.close();
})();
