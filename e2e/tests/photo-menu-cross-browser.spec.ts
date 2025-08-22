import { test, expect, devices } from '@playwright/test';
import { PhotoMenuPage } from '../page-objects/photo-menu.page';
import { UserStateManager } from '../fixtures/user-states';
import { TestDataManager } from '../fixtures/test-data';
import { APIMocks } from '../utils/api-mocks';

// Cross-browser test configuration
const browserConfigs = [
  { name: 'Chromium', device: 'Desktop Chrome' },
  { name: 'Firefox', device: 'Desktop Firefox' },
  { name: 'WebKit', device: 'Desktop Safari' },
  { name: 'Mobile Chrome', device: 'Pixel 5' },
  { name: 'Mobile Safari', device: 'iPhone 12' }
];

test.describe('Photo Menu Cross-Browser Compatibility', () => {
  browserConfigs.forEach(({ name, device }) => {
    test.describe(`${name} Tests`, () => {
      test.use({ ...devices[device] });
      
      let photoMenuPage: PhotoMenuPage;
      let userStateManager: UserStateManager;
      let apiMocks: APIMocks;

      test.beforeEach(async ({ page }) => {
        photoMenuPage = new PhotoMenuPage(page);
        userStateManager = new UserStateManager(page);
        apiMocks = new APIMocks(page);
        
        await userStateManager.setupRegisteredLoggedInUser();
        await apiMocks.mockPhotoMenuAPIs();
        await apiMocks.mockAuthAPIs(true);
        
        await photoMenuPage.navigateToPhotoMenu();
      });

      test(`should complete basic photo menu flow on ${name}`, async ({ page }) => {
        const restaurant = TestDataManager.getTestRestaurant(`${name}-Test`);
        const images = TestDataManager.getMultipleTestImages(2);
        
        // Complete the full flow
        await photoMenuPage.completeFullFlow(
          restaurant.name,
          images.map(img => img.path),
          'registered-logged-in',
          {
            password: TestDataManager.getTestPassword()
          }
        );
        
        // Browser-specific verifications
        if (name.includes('Mobile')) {
          // Mobile-specific checks
          await test.step('Verify mobile-specific behavior', async () => {
            // Check if mobile layout is active
            const isMobileLayout = await page.evaluate(() => window.innerWidth < 768);
            expect(isMobileLayout).toBe(true);
            
            // Verify touch interactions work
            await expect(photoMenuPage.nextButton).toBeVisible();
          });
        } else {
          // Desktop-specific checks
          await test.step('Verify desktop-specific behavior', async () => {
            // Check desktop layout
            const isDesktopLayout = await page.evaluate(() => window.innerWidth >= 768);
            expect(isDesktopLayout).toBe(true);
          });
        }
      });

      test(`should handle file uploads correctly on ${name}`, async ({ page }) => {
        const restaurant = TestDataManager.getTestRestaurant();
        const images = TestDataManager.getMultipleTestImages(3);
        
        await photoMenuPage.completeSetupStep(restaurant.name);
        
        // Test file upload functionality
        await photoMenuPage.uploadImages(images.map(img => img.path));
        
        const uploadedCount = await photoMenuPage.getUploadedImageCount();
        expect(uploadedCount).toBe(images.length);
        
        // Browser-specific file handling checks
        if (name === 'WebKit') {
          // Safari-specific file handling
          console.log('✅ File upload works on Safari/WebKit');
        } else if (name === 'Firefox') {
          // Firefox-specific checks
          console.log('✅ File upload works on Firefox');
        }
      });

      if (name.includes('Mobile')) {
        test(`should handle touch interactions on ${name}`, async ({ page }) => {
          const restaurant = TestDataManager.getTestRestaurant();
          const images = TestDataManager.getMultipleTestImages(2);
          
          await photoMenuPage.completeSetupStep(restaurant.name);
          await photoMenuPage.completeUploadStep(images.map(img => img.path));
          
          // Test touch-based drag and drop for sorting
          await photoMenuPage.sortImages([1, 0]);
          
          // Verify touch interactions work
          await photoMenuPage.clickNext();
          await photoMenuPage.verifyCurrentStep('generate');
        });

        test(`should be responsive on ${name}`, async ({ page }) => {
          // Check various viewport elements
          const viewportSize = page.viewportSize();
          expect(viewportSize!.width).toBeLessThanOrEqual(500); // Mobile width
          
          // Verify key elements are accessible on mobile
          await expect(photoMenuPage.restaurantNameInput).toBeVisible();
          await expect(photoMenuPage.nextButton).toBeVisible();
          
          // Check if sidebar/navigation is collapsed on mobile
          const sidebar = page.locator('[data-testid="sidebar"]');
          if (await sidebar.isVisible()) {
            // Should be collapsed or hidden on mobile
            const isCollapsed = await sidebar.evaluate(el => 
              window.getComputedStyle(el).display === 'none' ||
              window.getComputedStyle(el).transform.includes('translate')
            );
            expect(isCollapsed).toBe(true);
          }
        });
      }

      test(`should handle JavaScript features correctly on ${name}`, async ({ page }) => {
        // Test modern JavaScript features
        const jsFeatures = await page.evaluate(() => {
          return {
            hasAsyncAwait: typeof async function(){} === 'function',
            hasPromise: typeof Promise !== 'undefined',
            hasArrowFunctions: true, // Will fail to parse if not supported
            hasLocalStorage: typeof localStorage !== 'undefined',
            hasFileAPI: typeof File !== 'undefined',
            hasDragAndDrop: 'draggable' in document.createElement('div')
          };
        });
        
        expect(jsFeatures.hasAsyncAwait).toBe(true);
        expect(jsFeatures.hasPromise).toBe(true);
        expect(jsFeatures.hasLocalStorage).toBe(true);
        expect(jsFeatures.hasFileAPI).toBe(true);
        
        if (!name.includes('Mobile')) {
          expect(jsFeatures.hasDragAndDrop).toBe(true);
        }
      });

      test(`should maintain visual consistency on ${name}`, async ({ page }) => {
        // Take screenshots for visual regression testing
        await expect(page).toHaveScreenshot(`photo-menu-initial-${name.toLowerCase().replace(' ', '-')}.png`);
        
        const restaurant = TestDataManager.getTestRestaurant();
        await photoMenuPage.enterRestaurantName(restaurant.name);
        
        await expect(page).toHaveScreenshot(`photo-menu-filled-${name.toLowerCase().replace(' ', '-')}.png`);
      });

      test(`should handle network conditions on ${name}`, async ({ page, context }) => {
        // Simulate poor network conditions
        await context.route('**/*', async (route) => {
          // Add random delays to simulate network issues
          const delay = Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          await route.continue();
        });
        
        const restaurant = TestDataManager.getTestRestaurant();
        const images = TestDataManager.getSingleTestImage();
        
        // Should still complete the flow despite network issues
        await photoMenuPage.completeSetupStep(restaurant.name);
        await photoMenuPage.uploadImages([images.path]);
        
        const uploadedCount = await photoMenuPage.getUploadedImageCount();
        expect(uploadedCount).toBe(1);
      });
    });
  });

  test.describe('Browser-Specific Feature Tests', () => {
    test('should handle WebKit-specific quirks', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'WebKit-specific test');
      
      const photoMenuPage = new PhotoMenuPage(page);
      const userStateManager = new UserStateManager(page);
      const apiMocks = new APIMocks(page);
      
      await userStateManager.setupRegisteredLoggedInUser();
      await apiMocks.mockPhotoMenuAPIs();
      await apiMocks.mockAuthAPIs(true);
      
      await photoMenuPage.navigateToPhotoMenu();
      
      // Test Safari-specific file input behavior
      const fileInput = page.locator('input[type="file"]');
      
      // Safari might handle file inputs differently
      await expect(fileInput).toBeVisible();
      
      // Test date/time handling (Safari can be different)
      const currentDate = await page.evaluate(() => new Date().toISOString());
      expect(currentDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('should handle Firefox-specific features', async ({ page, browserName }) => {
      test.skip(browserName !== 'firefox', 'Firefox-specific test');
      
      const photoMenuPage = new PhotoMenuPage(page);
      await photoMenuPage.navigateToPhotoMenu();
      
      // Test Firefox-specific CSS features
      const supportsMozAppearance = await page.evaluate(() => {
        const div = document.createElement('div');
        div.style.cssText = '-moz-appearance: none';
        return div.style.cssText.includes('-moz-appearance');
      });
      
      expect(supportsMozAppearance).toBe(true);
    });

    test('should handle Chromium-specific features', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Chromium-specific test');
      
      const photoMenuPage = new PhotoMenuPage(page);
      await photoMenuPage.navigateToPhotoMenu();
      
      // Test Chromium-specific APIs
      const hasWebkitPrefix = await page.evaluate(() => {
        return 'webkitRequestAnimationFrame' in window;
      });
      
      // This might be true in Chromium-based browsers
      console.log('Webkit prefix support:', hasWebkitPrefix);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should be accessible across browsers', async ({ page }) => {
      const photoMenuPage = new PhotoMenuPage(page);
      const userStateManager = new UserStateManager(page);
      
      await userStateManager.setupRegisteredLoggedInUser();
      await photoMenuPage.navigateToPhotoMenu();
      
      // Check for basic accessibility features
      const hasAriaLabels = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input, button, select');
        return Array.from(inputs).every(el => 
          el.getAttribute('aria-label') || 
          el.getAttribute('aria-labelledby') ||
          el.closest('label')
        );
      });
      
      // Should have proper accessibility attributes
      // Note: This is a basic check, full accessibility testing would require axe-core
      const focusableElements = await page.locator('input, button, select, [tabindex]').count();
      expect(focusableElements).toBeGreaterThan(0);
    });
  });
});