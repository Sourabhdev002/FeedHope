const { chromium } = require('playwright');

async function runSmokeTests() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const baseUrl = 'http://localhost:3000';

  console.log('Starting Smoke Tests...');
  let hasError = false;

  try {
    // 1. Register
    console.log('1. Testing Registration...');
    await page.goto(`${baseUrl}/register`);
    const randomEmail = `beta-tester-${Date.now()}@example.com`;
    await page.fill('input[type="text"][placeholder="Jane"]', 'Beta');
    await page.fill('input[type="text"][placeholder="Smith"]', 'Tester');
    await page.fill('input[type="email"]', randomEmail);
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to onboarding or dashboard
    await page.waitForURL(url => url.pathname === '/onboarding' || url.pathname === '/dashboard');
    console.log('✅ Registration successful.');

    // 2. Onboarding
    if (page.url().includes('/onboarding')) {
      console.log('2. Testing Onboarding...');
      
      // Welcome Step
      await page.waitForSelector('text=Get Started');
      await page.click('text=Get Started');

      // Basic Info Step
      await page.waitForSelector('text=Basic Info');
      await page.fill('input[type="date"]', '1990-01-01');
      await page.fill('input[placeholder="e.g. 70"]', '70');
      await page.fill('input[placeholder="e.g. 175"]', '175');
      await page.selectOption('select', 'male');
      await page.click('button:has-text("Next")');

      // Lifestyle Step
      await page.waitForSelector('text=Lifestyle');
      await page.click('button:has-text("Active")');
      await page.click('button:has-text("Next")');

      // Goals Step
      await page.waitForSelector('text=Goals');
      await page.click('button:has-text("Build Muscle")');
      await page.click('button:has-text("Next")');

      // Health Conditions
      await page.waitForSelector('text=Health Conditions');
      await page.click('button:has-text("None")');
      await page.click('button:has-text("Next")');

      // Review Step
      await page.waitForSelector('text=Review Your Answers');
      await page.click('button:has-text("Generate Health Plan")');
      
      // Generating...
      await page.waitForSelector('text=Generating your health plan...');
      
      // Success Step
      await page.waitForSelector('text=Plan Ready');
      await page.click('text=Go to Dashboard');
      
      await page.waitForURL('**/dashboard');
      console.log('✅ Onboarding & Plan Generation successful.');
    }

    // 3. Daily Check-in
    console.log('3. Testing Dashboard & Daily Check-in...');
    await page.waitForSelector('text=Today\'s Plan');
    // Click +250ml water
    await page.click('button:has-text("+250ml")');
    await page.waitForTimeout(500); // give it a moment for the server action
    console.log('✅ Daily Check-in (Water) successful.');

    // 4. Progress
    console.log('4. Testing Progress View...');
    await page.click('text=Habits');
    await page.waitForURL('**/progress');
    await page.waitForSelector('text=Insights');
    console.log('✅ Progress view successful.');

    // 5. Logout
    console.log('5. Testing Logout...');
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL('**/login');
    console.log('✅ Logout successful.');

    // 6. Login
    console.log('6. Testing Login...');
    await page.fill('input[type="email"]', randomEmail);
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    console.log('✅ Login successful.');

  } catch (err) {
    console.error('❌ Smoke Test Failed:', err.message);
    await page.screenshot({ path: 'smoke-test-failure.png' });
    hasError = true;
  } finally {
    await browser.close();
  }

  if (hasError) process.exit(1);
}

runSmokeTests();
