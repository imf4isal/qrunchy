import { test, expect } from '@playwright/test';
import { PhotoMenuPage } from '../page-objects/photo-menu.page';
import { TestDataManager } from '../fixtures/test-data';

test('Simple Photo Menu Flow Test', async ({ page }) => {
  const photoMenuPage = new PhotoMenuPage(page);
  
  // Navigate to photo menu page
  await photoMenuPage.navigateToPhotoMenu();
  
  // Step 1: Enter restaurant name
  const restaurantName = 'Test Restaurant ' + Date.now();
  await photoMenuPage.enterRestaurantName(restaurantName);
  
  // Take screenshot after entering name
  await page.screenshot({ path: 'step1-restaurant-name.png' });
  
  // Verify the name was entered
  await expect(photoMenuPage.restaurantNameInput).toHaveValue(restaurantName);
  
  // Try to click Continue
  await photoMenuPage.clickNext();
  
  // Take screenshot after clicking continue
  await page.screenshot({ path: 'step2-after-continue.png' });
  
  // Wait a moment to see what happens
  await page.waitForTimeout(2000);
  
  // Take final screenshot
  await page.screenshot({ path: 'step3-final-state.png' });
  
  console.log('✅ Simple flow test completed - check screenshots for results');
});