import { test, expect } from '@playwright/test';

test('Debug: Check photo-menu page structure', async ({ page }) => {
  // Navigate to photo-menu page
  await page.goto('/photo-menu');
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Take a screenshot to see what's actually on the page
  await page.screenshot({ path: 'debug-photo-menu-page.png', fullPage: true });
  
  // Get all input elements
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input elements`);
  
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const placeholder = await input.getAttribute('placeholder');
    const type = await input.getAttribute('type');
    const id = await input.getAttribute('id');
    const className = await input.getAttribute('class');
    
    console.log(`Input ${i}: type="${type}", placeholder="${placeholder}", id="${id}", class="${className}"`);
  }
  
  // Get all button elements
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} button elements`);
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const text = await button.textContent();
    const className = await button.getAttribute('class');
    
    console.log(`Button ${i}: text="${text}", class="${className}"`);
  }
  
  // Get page title
  const title = await page.title();
  console.log(`Page title: "${title}"`);
  
  // Get current URL
  const url = page.url();
  console.log(`Current URL: "${url}"`);
  
  // This test always passes - it's just for debugging
  expect(true).toBe(true);
});