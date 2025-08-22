import { Page } from '@playwright/test';

export class APIMocks {
  constructor(private page: Page) {}

  /**
   * Mock all photo menu related API endpoints
   */
  async mockPhotoMenuAPIs() {
    await this.mockFileUpload();
    await this.mockRestaurantCreation();
    await this.mockPhotoMenuCreation();
    await this.mockQRGeneration();
  }

  /**
   * Mock file upload endpoint
   */
  async mockFileUpload() {
    await this.page.route('**/api/files/upload', async route => {
      const request = route.request();
      console.log('🔄 Mocking file upload:', request.url());
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              urls: [
                'https://example.com/test-menu-1.jpg',
                'https://example.com/test-menu-2.jpg'
              ]
            }
          }
        })
      });
    });
  }

  /**
   * Mock restaurant creation
   */
  async mockRestaurantCreation() {
    await this.page.route('**/api/trpc/restaurant.create*', async route => {
      console.log('🔄 Mocking restaurant creation');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              id: 123,
              name: 'Test Restaurant',
              created_at: new Date().toISOString()
            }
          }
        })
      });
    });
  }

  /**
   * Mock photo menu creation
   */
  async mockPhotoMenuCreation() {
    await this.page.route('**/api/trpc/photoMenu.create*', async route => {
      console.log('🔄 Mocking photo menu creation');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              photoMenuId: 456,
              restaurantId: 123
            }
          }
        })
      });
    });
  }

  /**
   * Mock QR code generation
   */
  async mockQRGeneration() {
    await this.page.route('**/api/trpc/photoMenu.generateQr*', async route => {
      console.log('🔄 Mocking QR generation');
      
      // Generate a simple test QR code data URL
      const testQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              restaurantId: 123,
              qrCode: testQRCode,
              qrUrl: 'https://qrunchy.com/menu/123'
            }
          }
        })
      });
    });
  }

  /**
   * Mock authentication endpoints
   */
  async mockAuthAPIs(userExists: boolean = true) {
    // Mock user existence check
    await this.page.route('**/api/trpc/auth.login*', async route => {
      console.log('🔄 Mocking user login check');
      
      if (userExists) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                user: {
                  id: 1,
                  mobile_number: '+1234567890'
                }
              }
            }
          })
        });
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'User not found',
              code: 'NOT_FOUND'
            }
          })
        });
      }
    });

    // Mock OTP verification
    await this.page.route('**/api/trpc/auth.verifyOTP*', async route => {
      console.log('🔄 Mocking OTP verification');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 1,
                mobile_number: '+1234567890'
              }
            }
          }
        })
      });
    });

    // Mock password verification
    await this.page.route('**/api/trpc/auth.verifyPassword*', async route => {
      console.log('🔄 Mocking password verification');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              token: 'mock-jwt-token-' + Date.now()
            }
          }
        })
      });
    });

    // Mock user registration
    await this.page.route('**/api/trpc/auth.register*', async route => {
      console.log('🔄 Mocking user registration');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              user: {
                id: Date.now(),
                mobile_number: '+1234567890'
              }
            }
          }
        })
      });
    });
  }

  /**
   * Mock SMS/OTP sending
   */
  async mockSMSAPIs() {
    await this.page.route('**/api/trpc/auth.sendOTP*', async route => {
      console.log('🔄 Mocking SMS/OTP sending');
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              message: 'OTP sent successfully'
            }
          }
        })
      });
    });
  }

  /**
   * Mock error scenarios for testing
   */
  async mockErrorScenarios() {
    // Mock file upload failure
    await this.page.route('**/api/files/upload-error-test*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Upload failed',
            code: 'UPLOAD_ERROR'
          }
        })
      });
    });

    // Mock network timeout
    await this.page.route('**/api/trpc/timeout-test*', async route => {
      // Simulate network timeout by not responding
      await new Promise(resolve => setTimeout(resolve, 10000));
      await route.abort();
    });
  }

  /**
   * Clear all route mocks
   */
  async clearMocks() {
    await this.page.unrouteAll();
    console.log('🧹 Cleared all API mocks');
  }

  /**
   * Enable request logging for debugging
   */
  enableRequestLogging() {
    this.page.on('request', request => {
      console.log(`📤 ${request.method()} ${request.url()}`);
    });

    this.page.on('response', response => {
      console.log(`📥 ${response.status()} ${response.url()}`);
    });
  }
}