import { test, expect } from '@playwright/test';
import { PhotoMenuPage } from '../page-objects/photo-menu.page';
import { DashboardPage } from '../page-objects/dashboard.page';
import { UserStateManager } from '../fixtures/user-states';
import { TestDataManager } from '../fixtures/test-data';
import { APIMocks } from '../utils/api-mocks';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Photo Menu Creation Flows', () => {
  let photoMenuPage: PhotoMenuPage;
  let dashboardPage: DashboardPage;
  let userStateManager: UserStateManager;
  let apiMocks: APIMocks;
  let testRestaurant: any;
  let testImages: any[];

  test.beforeEach(async ({ page }) => {
    // Initialize page objects and utilities
    photoMenuPage = new PhotoMenuPage(page);
    dashboardPage = new DashboardPage(page);
    userStateManager = new UserStateManager(page);
    apiMocks = new APIMocks(page);
    
    // Prepare test data
    testRestaurant = TestDataManager.getTestRestaurant();
    testImages = TestDataManager.getMultipleTestImages(2);
    
    // Set up API mocks
    await apiMocks.mockPhotoMenuAPIs();
    await apiMocks.mockSMSAPIs();
    
    // Enable request logging for debugging
    if (process.env.DEBUG) {
      apiMocks.enableRequestLogging();
    }
    
    // Navigate to photo menu creation page
    await photoMenuPage.navigateToPhotoMenu();
  });

  test.afterEach(async ({ page }) => {
    // Clean up test data
    await TestDataManager.cleanupTestData();
    await TestHelpers.clearBrowserStorage(page);
  });

  test.describe('Registered but Logged Out User Flow', () => {
    test.beforeEach(async ({ page }) => {
      await userStateManager.setupRegisteredLoggedOutUser();
      await apiMocks.mockAuthAPIs(true); // User exists
    });

    test('should complete full photo menu creation with OTP verification', async ({ page }) => {
      // Step 1: Setup - Enter restaurant name
      await test.step('Setup restaurant details', async () => {
        await photoMenuPage.enterRestaurantName(testRestaurant.name);
        await photoMenuPage.clickNext();
        await photoMenuPage.verifyCurrentStep('upload');
      });

      // Step 2: Upload images
      await test.step('Upload menu images', async () => {
        const imagePaths = testImages.map(img => img.path);
        await photoMenuPage.uploadImages(imagePaths);
        
        // Verify correct number of images uploaded
        const uploadedCount = await photoMenuPage.getUploadedImageCount();
        expect(uploadedCount).toBe(testImages.length);
        
        await photoMenuPage.clickNext();
        await photoMenuPage.verifyCurrentStep('sort');
      });

      // Step 3: Sort images (optional)
      await test.step('Sort menu images', async () => {
        // Test image reordering - reverse the order
        const newOrder = [1, 0];
        await photoMenuPage.sortImages(newOrder);
        await photoMenuPage.clickNext();
        await photoMenuPage.verifyCurrentStep('generate');
      });

      // Step 4: Generate QR with OTP verification
      await test.step('Generate QR code with OTP verification', async () => {
        await photoMenuPage.clickGenerateQR();
        
        // Should see OTP verification for logged out user
        await expect(photoMenuPage.otpVerificationModal).toBeVisible();
        
        // Complete OTP verification
        const testMobile = TestDataManager.getTestMobileNumbers().registered;
        const testOTP = TestDataManager.getTestOTP();
        
        await photoMenuPage.completeOTPVerification(testMobile, testOTP);
        
        // Verify QR generation completes
        await photoMenuPage.verifyQRGeneration();
      });

      // Step 5: Verify redirect to dashboard
      await test.step('Verify completion and dashboard redirect', async () => {
        await photoMenuPage.verifyRedirectToDashboard();
        await photoMenuPage.verifyRestaurantInDashboard(testRestaurant.name);
        
        // Verify restaurant card has photo menu badge
        await dashboardPage.verifyRestaurantCardDetails(testRestaurant.name, {
          hasQRCode: true,
          hasPhotoMenu: true
        });
      });
    });

    test('should handle OTP verification failure gracefully', async ({ page }) => {
      // Complete setup and upload steps
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      await photoMenuPage.completeUploadStep(testImages.map(img => img.path));
      await photoMenuPage.completeSortStep();
      
      // Mock OTP verification failure
      await page.route('**/api/trpc/auth.verifyOTP*', async route => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { message: 'Invalid OTP' }
          })
        });
      });
      
      await photoMenuPage.clickGenerateQR();
      await photoMenuPage.enterOTP('000000'); // Invalid OTP
      await photoMenuPage.submitOTPVerification();
      
      // Should show error message
      await TestHelpers.verifyToastMessage(page, 'Invalid OTP', 'error');
    });
  });

  test.describe('Registered and Logged In User Flow', () => {
    test.beforeEach(async ({ page }) => {
      await userStateManager.setupRegisteredLoggedInUser();
      await apiMocks.mockAuthAPIs(true); // User exists
    });

    test('should complete full photo menu creation with password verification', async ({ page }) => {
      // Use the complete flow helper for efficiency
      await photoMenuPage.completeFullFlow(
        testRestaurant.name,
        testImages.map(img => img.path),
        'registered-logged-in',
        {
          password: TestDataManager.getTestPassword()
        }
      );
      
      // Additional verification for logged-in user flow
      await test.step('Verify logged-in user specific behavior', async () => {
        // Should not see mobile number input since user is already known
        await expect(photoMenuPage.mobileNumberInput).not.toBeVisible();
        
        // Should see password verification instead of OTP
        await expect(photoMenuPage.passwordVerificationModal).toHaveBeenVisible();
      });
    });

    test('should allow skipping sort step', async ({ page }) => {
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      await photoMenuPage.completeUploadStep(testImages.map(img => img.path));
      
      // Skip sorting by directly proceeding to next step
      await photoMenuPage.clickNext();
      await photoMenuPage.verifyCurrentStep('generate');
      
      await photoMenuPage.clickGenerateQR();
      await photoMenuPage.completePasswordVerification(TestDataManager.getTestPassword());
      
      await photoMenuPage.verifyQRGeneration();
      await photoMenuPage.verifyRedirectToDashboard();
    });

    test('should handle password verification failure', async ({ page }) => {
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      await photoMenuPage.completeUploadStep(testImages.map(img => img.path));
      await photoMenuPage.completeSortStep();
      
      // Mock password verification failure
      await page.route('**/api/trpc/auth.verifyPassword*', async route => {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { message: 'Invalid password' }
          })
        });
      });
      
      await photoMenuPage.clickGenerateQR();
      await photoMenuPage.enterPassword('wrongpassword');
      await photoMenuPage.submitPasswordVerification();
      
      await TestHelpers.verifyToastMessage(page, 'Invalid password', 'error');
    });
  });

  test.describe('Unregistered User Flow', () => {
    test.beforeEach(async ({ page }) => {
      await userStateManager.setupUnregisteredUser();
      await apiMocks.mockAuthAPIs(false); // User doesn't exist
    });

    test('should complete full photo menu creation with registration', async ({ page }) => {
      await test.step('Complete registration flow', async () => {
        await photoMenuPage.completeFullFlow(
          testRestaurant.name,
          testImages.map(img => img.path),
          'unregistered',
          {
            mobileNumber: TestDataManager.getTestMobileNumbers().unregistered,
            otp: TestDataManager.getTestOTP()
          }
        );
      });

      await test.step('Verify new user registration', async () => {
        // Should see registration form first
        await expect(photoMenuPage.registrationModal).toHaveBeenVisible();
        
        // Then OTP verification
        await expect(photoMenuPage.otpVerificationModal).toHaveBeenVisible();
      });
    });

    test('should handle invalid mobile number gracefully', async ({ page }) => {
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      await photoMenuPage.completeUploadStep(testImages.map(img => img.path));
      await photoMenuPage.completeSortStep();
      
      await photoMenuPage.clickGenerateQR();
      
      // Enter invalid mobile number
      await photoMenuPage.enterMobileNumber('123');
      await photoMenuPage.submitRegistration();
      
      // Should show validation error
      await TestHelpers.verifyToastMessage(page, 'Invalid mobile number', 'error');
    });
  });

  test.describe('Edge Cases and Error Scenarios', () => {
    test('should handle network failures gracefully', async ({ page }) => {
      await userStateManager.setupRegisteredLoggedInUser();
      
      // Mock network failure during image upload
      await page.route('**/api/files/upload', async route => {
        await route.abort('failed');
      });
      
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      
      // Try to upload images - should fail gracefully
      await photoMenuPage.uploadImages(testImages.map(img => img.path));
      
      // Should show error message
      await TestHelpers.verifyToastMessage(page, 'Upload failed', 'error');
    });

    test('should validate required fields', async ({ page }) => {
      await userStateManager.setupRegisteredLoggedInUser();
      
      // Try to proceed without restaurant name
      await photoMenuPage.clickNext();
      
      // Should show validation error
      await TestHelpers.verifyToastMessage(page, 'Restaurant name is required', 'error');
      
      // Enter name and proceed to upload
      await photoMenuPage.enterRestaurantName(testRestaurant.name);
      await photoMenuPage.clickNext();
      
      // Try to proceed without images
      await photoMenuPage.clickNext();
      
      // Should show validation error
      await TestHelpers.verifyToastMessage(page, 'At least one image is required', 'error');
    });

    test('should handle large file uploads', async ({ page }) => {
      await userStateManager.setupRegisteredLoggedInUser();
      await apiMocks.mockPhotoMenuAPIs();
      
      await photoMenuPage.completeSetupStep(testRestaurant.name);
      
      // Test large file upload
      const largeImages = [TestDataManager.getTestImages().find(img => img.size === 'large')!];
      await photoMenuPage.uploadImages(largeImages.map(img => img.path));
      
      // Should handle large files appropriately
      const uploadedCount = await photoMenuPage.getUploadedImageCount();
      expect(uploadedCount).toBe(1);
    });
  });

  test.describe('Draft Management', () => {
    test('should save and restore draft data', async ({ page }) => {
      await userStateManager.setupUnregisteredUser();
      
      // Start creating a menu but don't complete
      await photoMenuPage.enterRestaurantName(testRestaurant.name);
      await photoMenuPage.clickNext();
      await photoMenuPage.uploadImages([testImages[0].path]);
      
      // Refresh page to simulate user returning
      await page.reload();
      await photoMenuPage.navigateToPhotoMenu();
      
      // Should see draft notification
      await expect(photoMenuPage.draftNotification).toBeVisible();
      
      // Restore draft
      await photoMenuPage.restoreDraft();
      
      // Should restore restaurant name
      await expect(photoMenuPage.restaurantNameInput).toHaveValue(testRestaurant.name);
    });

    test('should allow starting fresh instead of restoring draft', async ({ page }) => {
      await userStateManager.setupUnregisteredUser();
      
      // Create some data
      await photoMenuPage.enterRestaurantName('Old Restaurant');
      await photoMenuPage.clickNext();
      
      // Refresh and return
      await page.reload();
      await photoMenuPage.navigateToPhotoMenu();
      
      await expect(photoMenuPage.draftNotification).toBeVisible();
      await photoMenuPage.startFresh();
      
      // Should start with clean state
      await expect(photoMenuPage.restaurantNameInput).toHaveValue('');
    });
  });
});