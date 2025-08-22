import { Page } from '@playwright/test';

export interface TestUser {
  id: number;
  mobile_number: string;
  password?: string;
  isRegistered: boolean;
  isLoggedIn: boolean;
}

export class UserStateManager {
  constructor(private page: Page) {}

  /**
   * Set up a registered but logged out user state
   * User exists in the system but no active session
   */
  async setupRegisteredLoggedOutUser(user: TestUser = this.getDefaultUser()) {
    await this.clearAllLocalStorage();
    
    // Set user data but no authentication token
    await this.page.evaluate((userData) => {
      localStorage.setItem('qrunchy_user_exists', 'true');
      localStorage.setItem('qrunchy_user_mobile', userData.mobile_number);
    }, user);

    console.log('👤 Set up registered but logged out user:', user.mobile_number);
  }

  /**
   * Set up a registered and logged in user state
   * User has active session with valid token
   */
  async setupRegisteredLoggedInUser(user: TestUser = this.getDefaultUser()) {
    await this.clearAllLocalStorage();
    
    // Set user data with authentication token
    await this.page.evaluate((userData) => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.test_token';
      
      localStorage.setItem('qrunchy_token', mockToken);
      localStorage.setItem('qrunchy_user', JSON.stringify({
        id: userData.id,
        mobile_number: userData.mobile_number,
      }));
    }, user);

    console.log('🔐 Set up registered and logged in user:', user.mobile_number);
  }

  /**
   * Set up an unregistered user state
   * Completely clean state, no user data
   */
  async setupUnregisteredUser() {
    await this.clearAllLocalStorage();
    console.log('🆕 Set up unregistered user state');
  }

  /**
   * Clear all localStorage to ensure clean state
   */
  async clearAllLocalStorage() {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Get the current authentication state from localStorage
   */
  async getCurrentAuthState() {
    return await this.page.evaluate(() => {
      const token = localStorage.getItem('qrunchy_token');
      const user = localStorage.getItem('qrunchy_user');
      const userExists = localStorage.getItem('qrunchy_user_exists');
      
      return {
        hasToken: !!token,
        hasUser: !!user,
        userExists: userExists === 'true',
        token,
        user: user ? JSON.parse(user) : null
      };
    });
  }

  /**
   * Mock API responses for different user states
   */
  async mockUserStateAPIs(userState: 'registered-logged-out' | 'registered-logged-in' | 'unregistered') {
    const user = this.getDefaultUser();

    // Mock user existence check
    if (userState === 'unregistered') {
      await this.page.route('**/api/trpc/auth.login*', async route => {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({
            error: { message: 'User not found' }
          })
        });
      });
    } else {
      await this.page.route('**/api/trpc/auth.login*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: {
                user: {
                  id: user.id,
                  mobile_number: user.mobile_number
                }
              }
            }
          })
        });
      });
    }

    // Mock OTP verification
    await this.page.route('**/api/trpc/auth.verifyOTP*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              token: 'mock-jwt-token',
              user: {
                id: user.id,
                mobile_number: user.mobile_number
              }
            }
          }
        })
      });
    });

    // Mock password verification
    await this.page.route('**/api/trpc/auth.verifyPassword*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
              token: 'mock-jwt-token'
            }
          }
        })
      });
    });
  }

  /**
   * Get default test user data
   */
  private getDefaultUser(): TestUser {
    return {
      id: 1,
      mobile_number: '+1234567890',
      password: 'test123',
      isRegistered: true,
      isLoggedIn: false
    };
  }

  /**
   * Generate a unique test user for parallel test execution
   */
  static generateTestUser(index: number = Math.floor(Math.random() * 1000)): TestUser {
    return {
      id: 1000 + index,
      mobile_number: `+1555000${index.toString().padStart(4, '0')}`,
      password: 'test123',
      isRegistered: true,
      isLoggedIn: false
    };
  }
}