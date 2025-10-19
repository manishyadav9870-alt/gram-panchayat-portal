// Automated Testing Script for Gram Panchayat Portal
// Run: node test-all-pages.js

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
const REPORT_FILE = 'test-report.txt';

// Test results storage
let testResults = [];
let screenshotCount = 0;

// Helper function to add test result
function addResult(url, status, message, screenshotPath = null) {
  testResults.push({
    url,
    status,
    message,
    screenshot: screenshotPath,
    timestamp: new Date().toISOString()
  });
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${url}: ${message}`);
}

// Helper function to take screenshot
async function takeScreenshot(page, name) {
  const path = `screenshots/test-${++screenshotCount}-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}

// Test function for each page
async function testPage(browser, url, testName, testFunction) {
  console.log(`\n🧪 Testing: ${testName}`);
  const page = await browser.newPage();
  
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Run custom test function if provided
    if (testFunction) {
      await testFunction(page);
    }
    
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait a bit for any errors to appear
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (errors.length > 0) {
      const screenshot = await takeScreenshot(page, testName.replace(/\s+/g, '-'));
      addResult(url, 'FAIL', `Console errors: ${errors.join(', ')}`, screenshot);
    } else {
      addResult(url, 'PASS', 'Page loaded successfully');
    }
    
  } catch (error) {
    const screenshot = await takeScreenshot(page, testName.replace(/\s+/g, '-') + '-error');
    addResult(url, 'FAIL', `Error: ${error.message}`, screenshot);
  } finally {
    await page.close();
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Automated Tests...\n');
  
  // Create screenshots directory
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to true for CI/CD
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // ========== PUBLIC PAGES ==========
    console.log('\n📋 TESTING PUBLIC PAGES\n');
    
    await testPage(browser, '/', 'Home Page', async (page) => {
      await page.waitForSelector('header', { timeout: 5000 });
      const heroText = await page.$eval('h1', el => el.textContent);
      if (!heroText.includes('किशोर')) {
        throw new Error('Hero text not found');
      }
    });
    
    await testPage(browser, '/about', 'About Page', async (page) => {
      await page.waitForSelector('h1', { timeout: 5000 });
      const heading = await page.$eval('h1', el => el.textContent);
      if (!heading.includes('किशोर') && !heading.includes('About')) {
        throw new Error('About heading not found');
      }
    });
    
    await testPage(browser, '/services', 'Services Page', async (page) => {
      await page.waitForSelector('h1', { timeout: 5000 });
      // Check if service cards are present
      const cards = await page.$$('.card, [class*="Card"]');
      if (cards.length < 4) {
        throw new Error(`Expected at least 4 service cards, found ${cards.length}`);
      }
    });
    
    await testPage(browser, '/announcements', 'Announcements Page', async (page) => {
      await page.waitForSelector('h1', { timeout: 5000 });
      // Check for filter buttons
      const buttons = await page.$$('button');
      if (buttons.length < 3) {
        throw new Error('Filter buttons not found');
      }
    });
    
    await testPage(browser, '/contact', 'Contact Page', async (page) => {
      await page.waitForSelector('h1', { timeout: 5000 });
      // Check for contact cards
      const cards = await page.$$('.card, [class*="Card"]');
      if (cards.length < 4) {
        throw new Error(`Expected at least 4 contact cards, found ${cards.length}`);
      }
    });
    
    await testPage(browser, '/track', 'Track Application Page');
    
    // ========== PUBLIC SERVICE ==========
    console.log('\n🔓 TESTING PUBLIC SERVICE\n');
    
    await testPage(browser, '/services/complaint', 'Complaint Service', async (page) => {
      await page.waitForSelector('form', { timeout: 5000 });
      
      // Fill form
      await page.type('input[name="name"]', 'Test User');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if Marathi field auto-filled
      const marathiName = await page.$eval('input[name="nameMarathi"]', el => el.value);
      if (!marathiName) {
        throw new Error('Marathi auto-translation not working');
      }
      
      await page.type('input[name="phone"]', '9876543210');
      await page.type('input[name="email"]', 'test@example.com');
      await page.select('select[name="category"]', 'water');
      await page.type('textarea[name="description"]', 'Test complaint description');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Submit form
      await page.click('button[type="submit"]');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for success message or print button
      const printButton = await page.$('button:has-text("Print")');
      if (!printButton) {
        throw new Error('Print button not found after submission');
      }
    });
    
    // ========== ADMIN-ONLY PAGES (Should Redirect) ==========
    console.log('\n🔒 TESTING ADMIN-ONLY PAGES (Without Login)\n');
    
    await testPage(browser, '/services/birth-certificate', 'Birth Certificate (No Login)', async (page) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const currentUrl = page.url();
      if (!currentUrl.includes('/admin/login')) {
        throw new Error('Should redirect to login page but did not');
      }
    });
    
    await testPage(browser, '/services/death-certificate', 'Death Certificate (No Login)', async (page) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const currentUrl = page.url();
      if (!currentUrl.includes('/admin/login')) {
        throw new Error('Should redirect to login page but did not');
      }
    });
    
    // ========== ADMIN LOGIN ==========
    console.log('\n🔐 TESTING ADMIN LOGIN\n');
    
    const loginPage = await browser.newPage();
    await loginPage.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle0' });
    
    await loginPage.type('input[name="username"]', 'admin');
    await loginPage.type('input[name="password"]', 'admin123');
    await loginPage.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const dashboardUrl = loginPage.url();
    if (dashboardUrl.includes('/admin/dashboard')) {
      addResult('/admin/login', 'PASS', 'Admin login successful');
      
      // ========== ADMIN PAGES (After Login) ==========
      console.log('\n✅ TESTING ADMIN PAGES (After Login)\n');
      
      await testPage(browser, '/admin/dashboard', 'Admin Dashboard');
      await testPage(browser, '/services/birth-certificate', 'Birth Certificate (With Login)');
      await testPage(browser, '/services/death-certificate', 'Death Certificate (With Login)');
      await testPage(browser, '/admin/leaving-certificate/new', 'Leaving Certificate Form');
      await testPage(browser, '/admin/marriage-certificate/new', 'Marriage Certificate Form');
      
    } else {
      addResult('/admin/login', 'FAIL', 'Admin login failed');
    }
    
    await loginPage.close();
    
  } catch (error) {
    console.error('❌ Test suite error:', error);
  } finally {
    await browser.close();
  }
  
  // ========== GENERATE REPORT ==========
  console.log('\n📊 GENERATING TEST REPORT\n');
  
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const failCount = testResults.filter(r => r.status === 'FAIL').length;
  
  let report = `
╔══════════════════════════════════════════════════════════════╗
║          GRAM PANCHAYAT PORTAL - TEST REPORT                 ║
╚══════════════════════════════════════════════════════════════╝

Test Date: ${new Date().toLocaleString()}
Total Tests: ${testResults.length}
✅ Passed: ${passCount}
❌ Failed: ${failCount}

═══════════════════════════════════════════════════════════════

DETAILED RESULTS:
\n`;
  
  testResults.forEach((result, index) => {
    report += `\n${index + 1}. ${result.status === 'PASS' ? '✅' : '❌'} ${result.url}\n`;
    report += `   Message: ${result.message}\n`;
    if (result.screenshot) {
      report += `   Screenshot: ${result.screenshot}\n`;
    }
    report += `   Time: ${result.timestamp}\n`;
  });
  
  report += `\n═══════════════════════════════════════════════════════════════\n`;
  report += `\nSUMMARY: ${failCount === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️  ${failCount} TEST(S) FAILED`}\n`;
  
  fs.writeFileSync(REPORT_FILE, report);
  console.log(report);
  console.log(`\n📄 Full report saved to: ${REPORT_FILE}`);
  console.log(`📸 Screenshots saved to: screenshots/\n`);
}

// Run tests
runTests().catch(console.error);
