import { Page, expect } from '@playwright/test';

export class TestHelpers {
  /**
   * Wait for image upload to complete
   */
  static async waitForImageUpload(page: Page, expectedCount: number, timeout: number = 30000) {
    await page.waitForFunction(
      (count) => {
        const uploadedImages = document.querySelectorAll('[data-testid^="uploaded-image-"]');
        return uploadedImages.length === count;
      },
      expectedCount,
      { timeout }
    );
  }

  /**
   * Wait for network requests to complete
   */
  static async waitForNetworkIdle(page: Page, timeout: number = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Verify step progress indicator
   */
  static async verifyStepProgress(page: Page, expectedStep: string) {
    const stepIndicator = page.locator(`[data-testid="step-${expectedStep}"]`);
    await expect(stepIndicator).toHaveClass(/active|current/);
  }

  /**
   * Take screenshot on failure with descriptive name
   */
  static async takeScreenshotOnFailure(page: Page, testName: string, stepName?: string) {
    const timestamp = Date.now();
    const fileName = `failed-${testName}${stepName ? `-${stepName}` : ''}-${timestamp}.png`;
    
    await page.screenshot({ 
      path: `test-results/screenshots/${fileName}`,
      fullPage: true 
    });
    
    console.log(`📸 Screenshot saved: ${fileName}`);
  }

  /**
   * Wait for element to be visible and interactable
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 10000) {
    const element = page.locator(selector);
    await expect(element).toBeVisible({ timeout });
    await expect(element).toBeEnabled({ timeout });
    return element;
  }

  /**
   * Fill form field with validation
   */
  static async fillFormField(page: Page, selector: string, value: string) {
    const field = await this.waitForElement(page, selector);
    await field.clear();
    await field.fill(value);
    
    // Verify the value was set correctly
    await expect(field).toHaveValue(value);
  }

  /**
   * Click button and wait for navigation/response
   */
  static async clickAndWait(page: Page, selector: string, waitFor?: 'navigation' | 'response' | 'networkidle') {
    const button = await this.waitForElement(page, selector);
    
    if (waitFor === 'navigation') {
      await Promise.all([
        page.waitForNavigation(),
        button.click()
      ]);
    } else if (waitFor === 'response') {
      await Promise.all([
        page.waitForResponse(response => response.status() === 200),
        button.click()
      ]);
    } else if (waitFor === 'networkidle') {
      await Promise.all([
        page.waitForLoadState('networkidle'),
        button.click()
      ]);
    } else {
      await button.click();
    }
  }

  /**
   * Upload files with drag and drop simulation
   */
  static async uploadFiles(page: Page, fileSelector: string, filePaths: string[]) {
    const fileInput = page.locator(fileSelector);
    await fileInput.setInputFiles(filePaths);
    
    // Wait for files to be processed
    for (let i = 0; i < filePaths.length; i++) {
      await this.waitForElement(page, `[data-testid="uploaded-image-${i}"]`);
    }
  }

  /**
   * Simulate drag and drop for image sorting
   */
  static async dragAndDrop(page: Page, sourceSelector: string, targetSelector: string) {
    const source = await this.waitForElement(page, sourceSelector);
    const target = await this.waitForElement(page, targetSelector);
    
    await source.dragTo(target);
    
    // Wait for drag operation to complete
    await page.waitForTimeout(500);
  }

  /**
   * Verify QR code generation
   */
  static async verifyQRCodeGeneration(page: Page) {
    // Wait for QR code to be visible
    const qrCode = await this.waitForElement(page, '[data-testid="qr-code"]');
    
    // Verify QR code has content
    const qrCodeSrc = await qrCode.getAttribute('src');
    expect(qrCodeSrc).toBeTruthy();
    expect(qrCodeSrc).toContain('data:image');
    
    return qrCode;
  }

  /**
   * Wait for toast notification and verify message
   */
  static async verifyToastMessage(page: Page, expectedMessage: string, type: 'success' | 'error' = 'success') {
    const toast = page.locator(`[data-testid="toast-${type}"]`);
    await expect(toast).toBeVisible();
    await expect(toast).toContainText(expectedMessage);
    
    // Wait for toast to disappear
    await expect(toast).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * Monitor network requests for debugging
   */
  static async monitorNetworkRequests(page: Page, patterns: string[] = []) {
    const requests: any[] = [];
    
    page.on('request', request => {
      const url = request.url();
      const shouldLog = patterns.length === 0 || patterns.some(pattern => url.includes(pattern));
      
      if (shouldLog) {
        requests.push({
          method: request.method(),
          url: url,
          timestamp: Date.now()
        });
      }
    });

    page.on('response', response => {
      const url = response.url();
      const shouldLog = patterns.length === 0 || patterns.some(pattern => url.includes(pattern));
      
      if (shouldLog) {
        console.log(`📡 ${response.status()} ${response.request().method()} ${url}`);
      }
    });

    return requests;
  }

  /**
   * Clear all browser storage
   */
  static async clearBrowserStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      // Clear IndexedDB if used
      if (window.indexedDB) {
        indexedDB.databases?.().then(databases => {
          databases.forEach(({ name }) => {
            if (name) indexedDB.deleteDatabase(name);
          });
        });
      }
    });
  }

  /**
   * Generate performance metrics
   */
  static async getPerformanceMetrics(page: Page) {
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: perfData.loadEventEnd - perfData.loadEventStart,
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        networkRequests: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('📊 Performance Metrics:', metrics);
    return metrics;
  }
}