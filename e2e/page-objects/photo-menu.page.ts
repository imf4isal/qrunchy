import { Page, expect, Locator } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class PhotoMenuPage {
  readonly page: Page;
  
  // Navigation elements
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly progressIndicator: Locator;
  
  // Setup step elements
  readonly restaurantNameInput: Locator;
  readonly chainSelect: Locator;
  
  // Upload step elements
  readonly fileInput: Locator;
  readonly uploadArea: Locator;
  readonly uploadedImagesList: Locator;
  
  // Sort step elements
  readonly sortableImagesList: Locator;
  readonly sortInstructions: Locator;
  
  // Generate step elements
  readonly generateQRButton: Locator;
  readonly qrCodeDisplay: Locator;
  readonly downloadQRButton: Locator;
  readonly copyQRButton: Locator;
  
  // Authentication elements
  readonly mobileNumberInput: Locator;
  readonly passwordInput: Locator;
  readonly otpInputs: Locator;
  readonly verifyOTPButton: Locator;
  readonly verifyPasswordButton: Locator;
  readonly registerButton: Locator;
  
  // Modal and dialog elements
  readonly authModal: Locator;
  readonly otpVerificationModal: Locator;
  readonly passwordVerificationModal: Locator;
  readonly registrationModal: Locator;
  
  // Draft management elements
  readonly draftNotification: Locator;
  readonly restoreDraftButton: Locator;
  readonly startFreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.nextButton = page.locator('button:has-text("Continue")');
    this.backButton = page.locator('[data-testid="back-button"]');
    this.progressIndicator = page.locator('[data-testid="progress-indicator"]');
    
    // Setup step (using actual selectors from your app)
    this.restaurantNameInput = page.locator('input#restaurantName');
    this.chainSelect = page.locator('[data-testid="chain-select"]');
    
    // Upload step
    this.fileInput = page.locator('input[type="file"]');
    this.uploadArea = page.locator('[data-testid="upload-area"]');
    this.uploadedImagesList = page.locator('[data-testid="uploaded-images-list"]');
    
    // Sort step
    this.sortableImagesList = page.locator('[data-testid="sortable-images-list"]');
    this.sortInstructions = page.locator('[data-testid="sort-instructions"]');
    
    // Generate step
    this.generateQRButton = page.locator('[data-testid="generate-qr-button"]');
    this.qrCodeDisplay = page.locator('[data-testid="qr-code"]');
    this.downloadQRButton = page.locator('[data-testid="download-qr-button"]');
    this.copyQRButton = page.locator('[data-testid="copy-qr-button"]');
    
    // Authentication
    this.mobileNumberInput = page.locator('[data-testid="mobile-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.otpInputs = page.locator('[data-testid="otp-input"]');
    this.verifyOTPButton = page.locator('[data-testid="verify-otp-button"]');
    this.verifyPasswordButton = page.locator('[data-testid="verify-password-button"]');
    this.registerButton = page.locator('[data-testid="register-button"]');
    
    // Modals
    this.authModal = page.locator('[data-testid="auth-modal"]');
    this.otpVerificationModal = page.locator('[data-testid="otp-verification"]');
    this.passwordVerificationModal = page.locator('[data-testid="password-verification"]');
    this.registrationModal = page.locator('[data-testid="registration-form"]');
    
    // Draft management
    this.draftNotification = page.locator('[data-testid="draft-notification"]');
    this.restoreDraftButton = page.locator('[data-testid="restore-draft-button"]');
    this.startFreshButton = page.locator('[data-testid="start-fresh-button"]');
  }

  // Navigation methods
  async navigateToPhotoMenu() {
    await this.page.goto('/photo-menu');
    await this.page.waitForLoadState('networkidle');
  }

  async clickNext() {
    await TestHelpers.clickAndWait(this.page, 'button:has-text("Continue")', 'networkidle');
  }

  async clickBack() {
    await TestHelpers.clickAndWait(this.page, '[data-testid="back-button"]');
  }

  // Setup step methods
  async enterRestaurantName(name: string) {
    await TestHelpers.fillFormField(this.page, 'input#restaurantName', name);
  }

  async selectChain(chainId: number) {
    await this.chainSelect.click();
    await this.page.locator(`[data-value="${chainId}"]`).click();
  }

  async completeSetupStep(restaurantName: string, chainId?: number) {
    await this.enterRestaurantName(restaurantName);
    if (chainId) {
      await this.selectChain(chainId);
    }
    await this.clickNext();
  }

  // Upload step methods
  async uploadImages(imagePaths: string[]) {
    await TestHelpers.uploadFiles(this.page, 'input[type="file"]', imagePaths);
    
    // Wait for all images to be processed
    for (let i = 0; i < imagePaths.length; i++) {
      await TestHelpers.waitForElement(this.page, `[data-testid="uploaded-image-${i}"]`);
    }
  }

  async removeImage(imageIndex: number) {
    const removeButton = this.page.locator(`[data-testid="remove-image-${imageIndex}"]`);
    await removeButton.click();
  }

  async getUploadedImageCount(): Promise<number> {
    return await this.uploadedImagesList.locator('[data-testid^="uploaded-image-"]').count();
  }

  async completeUploadStep(imagePaths: string[]) {
    await this.uploadImages(imagePaths);
    await this.clickNext();
  }

  // Sort step methods
  async sortImages(newOrder: number[]) {
    // Implement drag and drop sorting based on the new order
    for (let i = 0; i < newOrder.length; i++) {
      const sourceIndex = newOrder.indexOf(i);
      if (sourceIndex !== i) {
        await TestHelpers.dragAndDrop(
          this.page,
          `[data-testid="sortable-image-${sourceIndex}"]`,
          `[data-testid="drop-zone-${i}"]`
        );
      }
    }
    
    // Wait for sorting animation to complete
    await this.page.waitForTimeout(500);
  }

  async completeSortStep(newOrder?: number[]) {
    if (newOrder) {
      await this.sortImages(newOrder);
    }
    await this.clickNext();
  }

  // Generate step methods
  async clickGenerateQR() {
    await TestHelpers.clickAndWait(
      this.page, 
      '[data-testid="generate-qr-button"]', 
      'networkidle'
    );
  }

  async verifyQRGeneration() {
    return await TestHelpers.verifyQRCodeGeneration(this.page);
  }

  async downloadQRCode() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.downloadQRButton.click();
    const download = await downloadPromise;
    return download;
  }

  async copyQRCode() {
    await this.copyQRButton.click();
    
    // Verify copy was successful
    await TestHelpers.verifyToastMessage(this.page, 'QR code copied to clipboard');
  }

  // Authentication methods
  async enterMobileNumber(mobileNumber: string) {
    await TestHelpers.fillFormField(this.page, '[data-testid="mobile-input"]', mobileNumber);
  }

  async enterPassword(password: string) {
    await TestHelpers.fillFormField(this.page, '[data-testid="password-input"]', password);
  }

  async enterOTP(otp: string) {
    // Handle both single input and multiple digit inputs
    const otpInput = this.page.locator('[data-testid="otp-input"]');
    const count = await otpInput.count();
    
    if (count === 1) {
      // Single input field
      await TestHelpers.fillFormField(this.page, '[data-testid="otp-input"]', otp);
    } else {
      // Multiple digit inputs
      for (let i = 0; i < Math.min(otp.length, count); i++) {
        await TestHelpers.fillFormField(
          this.page, 
          `[data-testid="otp-input-${i}"]`, 
          otp.charAt(i)
        );
      }
    }
  }

  async submitOTPVerification() {
    await TestHelpers.clickAndWait(
      this.page, 
      '[data-testid="verify-otp-button"]', 
      'networkidle'
    );
  }

  async submitPasswordVerification() {
    await TestHelpers.clickAndWait(
      this.page, 
      '[data-testid="verify-password-button"]', 
      'networkidle'
    );
  }

  async submitRegistration() {
    await TestHelpers.clickAndWait(
      this.page, 
      '[data-testid="register-button"]', 
      'networkidle'
    );
  }

  // Complete authentication flows
  async completeOTPVerification(mobileNumber: string, otp: string) {
    await this.enterMobileNumber(mobileNumber);
    await this.submitRegistration();
    
    await expect(this.otpVerificationModal).toBeVisible();
    await this.enterOTP(otp);
    await this.submitOTPVerification();
  }

  async completePasswordVerification(password: string) {
    await expect(this.passwordVerificationModal).toBeVisible();
    await this.enterPassword(password);
    await this.submitPasswordVerification();
  }

  async completeRegistrationFlow(mobileNumber: string, otp: string) {
    await this.enterMobileNumber(mobileNumber);
    await this.submitRegistration();
    
    await expect(this.otpVerificationModal).toBeVisible();
    await this.enterOTP(otp);
    await this.submitOTPVerification();
  }

  // Draft management methods
  async restoreDraft() {
    await expect(this.draftNotification).toBeVisible();
    await this.restoreDraftButton.click();
  }

  async startFresh() {
    await expect(this.draftNotification).toBeVisible();
    await this.startFreshButton.click();
  }

  // Verification methods
  async verifyCurrentStep(expectedStep: string) {
    await TestHelpers.verifyStepProgress(this.page, expectedStep);
  }

  async verifyRedirectToDashboard() {
    await expect(this.page).toHaveURL(/\/dashboard/);
    
    // Verify dashboard elements are visible
    await TestHelpers.waitForElement(this.page, '[data-testid="dashboard-content"]');
  }

  async verifyRestaurantInDashboard(restaurantName: string) {
    await expect(this.page.locator(`text=${restaurantName}`)).toBeVisible();
  }

  // Complete flow methods
  async completeFullFlow(
    restaurantName: string,
    imagePaths: string[],
    userFlow: 'registered-logged-out' | 'registered-logged-in' | 'unregistered',
    options: {
      mobileNumber?: string;
      password?: string;
      otp?: string;
      sortOrder?: number[];
      chainId?: number;
    } = {}
  ) {
    const {
      mobileNumber = '+1234567890',
      password = 'test123',
      otp = '123456',
      sortOrder,
      chainId
    } = options;

    // Step 1: Setup
    await this.completeSetupStep(restaurantName, chainId);
    await this.verifyCurrentStep('upload');

    // Step 2: Upload
    await this.completeUploadStep(imagePaths);
    await this.verifyCurrentStep('sort');

    // Step 3: Sort
    await this.completeSortStep(sortOrder);
    await this.verifyCurrentStep('generate');

    // Step 4: Generate QR with authentication
    await this.clickGenerateQR();

    // Handle authentication based on user flow
    switch (userFlow) {
      case 'registered-logged-out':
        await this.completeOTPVerification(mobileNumber, otp);
        break;
      case 'registered-logged-in':
        await this.completePasswordVerification(password);
        break;
      case 'unregistered':
        await this.completeRegistrationFlow(mobileNumber, otp);
        break;
    }

    // Verify QR generation and redirect
    await this.verifyQRGeneration();
    await this.verifyRedirectToDashboard();
    await this.verifyRestaurantInDashboard(restaurantName);
  }
}