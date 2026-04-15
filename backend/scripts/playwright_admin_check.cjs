const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const tokenPath = path.join(__dirname, '..', 'tmp_admin_token.txt');
    const userPath = path.join(__dirname, '..', 'tmp_admin_user.json');

    if (!fs.existsSync(tokenPath)) {
      console.error('Token file not found:', tokenPath);
      process.exit(2);
    }

    const token = fs.readFileSync(tokenPath, 'utf-8').trim();
    const user = fs.existsSync(userPath) ? JSON.parse(fs.readFileSync(userPath, 'utf-8')) : { email: 'unknown' };

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Load base page then set localStorage (so React reads it on load)
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    await page.evaluate(({ token, user }) => {
      localStorage.setItem('jojma_token', token);
      localStorage.setItem('jojma_user', JSON.stringify(user));
    }, { token, user });

    // Navigate to admin demandes
    await page.goto('http://localhost:5173/admin/demandes', { waitUntil: 'networkidle' });

    // Wait a bit for client-side requests to finish and render
    await page.waitForTimeout(2000);

    const outDir = path.join(__dirname, '..', '..', 'outputs');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const screenshotPath = path.join(outDir, 'admin_demandes_authenticated.png');

    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to', screenshotPath);

    // Grab page content and check for presence of 'Gestion des demandes' or table rows
    const content = await page.content();
    const hasTable = content.includes('Gestion des demandes') || content.includes('Aucune demande') || content.includes('<table');
    console.log('Presence vérifiée:', hasTable);

    await browser.close();
  } catch (err) {
    console.error('Playwright error:', err);
    process.exit(3);
  }
})();
