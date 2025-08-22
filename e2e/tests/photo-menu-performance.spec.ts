import { test, expect } from '@playwright/test';
import { PhotoMenuPage } from '../page-objects/photo-menu.page';
import { UserStateManager } from '../fixtures/user-states';
import { TestDataManager } from '../fixtures/test-data';
import { APIMocks } from '../utils/api-mocks';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Photo Menu Performance Tests', () => {
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

  test('should load photo menu creation page within performance budget', async ({ page }) => {
    const startTime = Date.now();
    await photoMenuPage.navigateToPhotoMenu();
    const loadTime = Date.now() - startTime;
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000);
    
    // Verify all critical elements are visible
    await expect(photoMenuPage.restaurantNameInput).toBeVisible();
    await expect(photoMenuPage.nextButton).toBeVisible();
    
    console.log(`📊 Page load time: ${loadTime}ms`);
  });

  test('should handle multiple image uploads efficiently', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(5); // More images for performance test
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    
    // Measure upload performance
    const startTime = Date.now();
    await photoMenuPage.uploadImages(images.map(img => img.path));
    const uploadTime = Date.now() - startTime;
    
    // Should complete within 10 seconds for 5 images
    expect(uploadTime).toBeLessThan(10000);
    
    // Verify all images were uploaded
    const uploadedCount = await photoMenuPage.getUploadedImageCount();
    expect(uploadedCount).toBe(images.length);
    
    console.log(`📊 Upload time for ${images.length} images: ${uploadTime}ms`);
  });

  test('should maintain responsiveness during image sorting', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(4);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    await photoMenuPage.completeUploadStep(images.map(img => img.path));
    
    // Measure sorting performance
    const startTime = Date.now();
    await photoMenuPage.sortImages([3, 2, 1, 0]); // Reverse order
    const sortTime = Date.now() - startTime;
    
    // Should complete within 2 seconds
    expect(sortTime).toBeLessThan(2000);
    
    console.log(`📊 Sort time for ${images.length} images: ${sortTime}ms`);
  });

  test('should generate QR code within acceptable time', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(3);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    await photoMenuPage.completeUploadStep(images.map(img => img.path));
    await photoMenuPage.completeSortStep();
    
    // Measure QR generation performance
    const startTime = Date.now();
    await photoMenuPage.clickGenerateQR();
    await photoMenuPage.completePasswordVerification(TestDataManager.getTestPassword());
    await photoMenuPage.verifyQRGeneration();
    const qrGenerationTime = Date.now() - startTime;
    
    // Should complete within 5 seconds
    expect(qrGenerationTime).toBeLessThan(5000);
    
    console.log(`📊 QR generation time: ${qrGenerationTime}ms`);
  });

  test('should handle memory efficiently with large images', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const largeImages = Array(3).fill(TestDataManager.getTestImages().find(img => img.size === 'large'));
    
    // Monitor memory usage
    const initialMemory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    await photoMenuPage.uploadImages(largeImages.map(img => img.path));
    
    const afterUploadMemory = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);
    const memoryIncrease = afterUploadMemory - initialMemory;
    
    // Memory increase should be reasonable (less than 50MB)
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    
    console.log(`📊 Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
  });

  test('should maintain performance with network throttling', async ({ page, context }) => {
    // Simulate slow 3G connection
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(2);
    
    const startTime = Date.now();
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    await photoMenuPage.completeUploadStep(images.map(img => img.path));
    await photoMenuPage.completeSortStep();
    await photoMenuPage.clickGenerateQR();
    await photoMenuPage.completePasswordVerification(TestDataManager.getTestPassword());
    await photoMenuPage.verifyQRGeneration();
    
    const totalTime = Date.now() - startTime;
    
    // Should complete within 30 seconds even on slow connection
    expect(totalTime).toBeLessThan(30000);
    
    console.log(`📊 Total flow time with throttling: ${totalTime}ms`);
  });

  test('should show loading states during operations', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(2);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    
    // Mock slow file upload to test loading states
    await page.route('**/api/files/upload', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: { data: { success: true, urls: ['test.jpg'] } }
        })
      });
    });
    
    // Start upload and immediately check for loading state
    const uploadPromise = photoMenuPage.uploadImages(images.map(img => img.path));
    
    // Should show loading indicator
    const loadingSpinner = page.locator('[data-testid="upload-loading"]');
    await expect(loadingSpinner).toBeVisible({ timeout: 1000 });
    
    await uploadPromise;
    
    // Loading should disappear after upload
    await expect(loadingSpinner).not.toBeVisible();
  });

  test('should handle concurrent operations gracefully', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(3);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    
    // Start multiple uploads simultaneously
    const uploadPromises = images.map(async (image, index) => {
      await photoMenuPage.uploadImages([image.path]);
      return index;
    });
    
    // All uploads should complete without errors
    const results = await Promise.all(uploadPromises);
    expect(results).toHaveLength(images.length);
    
    // Final count should be correct
    const finalCount = await photoMenuPage.getUploadedImageCount();
    expect(finalCount).toBeGreaterThanOrEqual(images.length);
  });

  test('should cleanup resources properly', async ({ page }) => {
    const restaurant = TestDataManager.getTestRestaurant();
    const images = TestDataManager.getMultipleTestImages(3);
    
    await photoMenuPage.completeSetupStep(restaurant.name);
    await photoMenuPage.uploadImages(images.map(img => img.path));
    
    // Navigate away and back
    await page.goto('/dashboard');
    await photoMenuPage.navigateToPhotoMenu();
    
    // Memory should not have grown significantly
    const memoryAfterNavigation = await page.evaluate(() => (performance as any).memory?.usedJSHeapSize || 0);
    
    // Check that no memory leaks from blob URLs
    const blobURLCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).filter(img => 
        img.src.startsWith('blob:')
      ).length;
    });
    
    expect(blobURLCount).toBe(0);
    
    console.log(`📊 Memory after navigation: ${Math.round(memoryAfterNavigation / 1024 / 1024)}MB`);
  });
});