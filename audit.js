const { chromium } = require('playwright');
const fs = require('fs');

const breakpoints = [320, 375, 390, 414, 768];
const pagesToTest = [
  { name: 'Landing', path: '/' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
  { name: 'Onboarding', path: '/onboarding' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Progress', path: '/progress' },
];

const artifactsDir = 'C:/Users/makra/.gemini/antigravity-ide/brain/2a221c3a-895f-4d8c-99bf-807b6c180735/scratch/screenshots';

async function run() {
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create a user and log in to get session for protected routes
  // Let's try to just sign in directly.
  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  // Actually, we don't know if test user exists, but we can register one first.
  console.log('Registering test user...');
  await page.goto('http://localhost:3000/register');
  const testEmail = `test${Date.now()}@example.com`;
  
  // Fill the registration form
  await page.fill('input[type="text"]', 'Test User'); // name
  await page.fill('input[type="email"]', testEmail); // email
  await page.fill('input[type="password"]', 'password123'); // password
  await page.click('button[type="submit"]');
  
  // Wait for redirect to onboarding or dashboard
  await page.waitForTimeout(3000); 

  for (const { name, path } of pagesToTest) {
    console.log(`Testing ${name}...`);
    await page.goto(`http://localhost:3000${path}`);
    await page.waitForTimeout(1000); // Wait for rendering

    for (const width of breakpoints) {
      console.log(`  Breakpoint: ${width}`);
      await page.setViewportSize({ width, height: 800 });
      await page.waitForTimeout(500); // wait for layout shift
      
      const screenshotPath = `${artifactsDir}/${name}_${width}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
  }

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);
