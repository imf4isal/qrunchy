import * as path from 'path';

export interface TestRestaurant {
  name: string;
  address?: string;
  chainId?: number;
}

export interface TestImage {
  name: string;
  path: string;
  size: 'small' | 'medium' | 'large';
}

export class TestDataManager {
  static getTestRestaurant(suffix: string = ''): TestRestaurant {
    const timestamp = Date.now();
    return {
      name: `Test Restaurant ${suffix || timestamp}`,
      address: '123 Test Street, Test City',
      chainId: null
    };
  }

  static getTestImages(): TestImage[] {
    const imagesDir = path.join(__dirname, 'images');
    
    return [
      {
        name: 'menu-page-1.jpg',
        path: path.join(imagesDir, 'menu-page-1.jpg'),
        size: 'medium'
      },
      {
        name: 'menu-page-2.jpg', 
        path: path.join(imagesDir, 'menu-page-2.jpg'),
        size: 'medium'
      },
      {
        name: 'large-menu-1.jpg',
        path: path.join(imagesDir, 'large-menu-1.jpg'),
        size: 'large'
      }
    ];
  }

  static getSingleTestImage(): TestImage {
    return this.getTestImages()[0];
  }

  static getMultipleTestImages(count: number = 2): TestImage[] {
    return this.getTestImages().slice(0, count);
  }

  /**
   * Generate test OTP for mock verification
   */
  static getTestOTP(): string {
    return '123456';
  }

  /**
   * Generate test password for mock verification
   */
  static getTestPassword(): string {
    return 'test123';
  }

  /**
   * Get test mobile numbers for different scenarios
   */
  static getTestMobileNumbers() {
    return {
      registered: '+1234567890',
      unregistered: '+1987654321',
      invalid: '123',
      international: '+91987654321'
    };
  }

  /**
   * Clean up test data after test completion
   */
  static async cleanupTestData() {
    // Clear localStorage in all contexts
    // This will be called from test teardown
    console.log('🧹 Cleaning up test data');
  }

  /**
   * Validate test prerequisites
   */
  static async validateTestEnvironment(): Promise<boolean> {
    try {
      // Check if test images exist
      const images = this.getTestImages();
      const fs = await import('fs');
      
      for (const image of images) {
        if (!fs.existsSync(image.path)) {
          console.warn(`⚠️ Test image missing: ${image.path}`);
          return false;
        }
      }
      
      console.log('✅ Test environment validation passed');
      return true;
    } catch (error) {
      console.error('❌ Test environment validation failed:', error);
      return false;
    }
  }
}