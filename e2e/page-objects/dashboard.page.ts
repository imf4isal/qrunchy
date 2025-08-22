import { Page, expect, Locator } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

export class DashboardPage {
  readonly page: Page;
  
  // Main dashboard elements
  readonly dashboardContent: Locator;
  readonly restaurantsList: Locator;
  readonly createNewRestaurantButton: Locator;
  readonly photoMenuSection: Locator;
  readonly digitalMenuSection: Locator;
  
  // Restaurant card elements
  readonly restaurantCards: Locator;
  readonly restaurantName: (name: string) => Locator;
  readonly qrCodePreview: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly viewMenuButton: Locator;
  
  // Navigation elements
  readonly navbar: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;
  readonly settingsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main dashboard
    this.dashboardContent = page.locator('[data-testid="dashboard-content"]');
    this.restaurantsList = page.locator('[data-testid="restaurants-list"]');
    this.createNewRestaurantButton = page.locator('[data-testid="create-restaurant-button"]');
    this.photoMenuSection = page.locator('[data-testid="photo-menu-section"]');
    this.digitalMenuSection = page.locator('[data-testid="digital-menu-section"]');
    
    // Restaurant cards
    this.restaurantCards = page.locator('[data-testid^="restaurant-card-"]');
    this.qrCodePreview = page.locator('[data-testid="qr-code-preview"]');
    this.editButton = page.locator('[data-testid="edit-restaurant-button"]');
    this.deleteButton = page.locator('[data-testid="delete-restaurant-button"]');
    this.viewMenuButton = page.locator('[data-testid="view-menu-button"]');
    
    // Navigation
    this.navbar = page.locator('[data-testid="navbar"]');
    this.userProfile = page.locator('[data-testid="user-profile"]');
    this.logoutButton = page.locator('[data-testid="logout-button"]');
    this.settingsButton = page.locator('[data-testid="settings-button"]');
  }

  // Helper to get restaurant by name
  restaurantName(name: string): Locator {
    return this.page.locator(`[data-testid="restaurant-name"]:has-text("${name}")`);
  }

  // Navigation methods
  async navigateToDashboard() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    await TestHelpers.waitForElement(this.page, '[data-testid="dashboard-content"]');
  }

  async navigateToPhotoMenuCreation() {
    await TestHelpers.clickAndWait(
      this.page,
      '[data-testid="create-photo-menu-button"]',
      'navigation'
    );
  }

  async navigateToDigitalMenuCreation() {
    await TestHelpers.clickAndWait(
      this.page,
      '[data-testid="create-digital-menu-button"]',
      'navigation'
    );
  }

  // Restaurant management methods
  async getRestaurantCount(): Promise<number> {
    await TestHelpers.waitForElement(this.page, '[data-testid="restaurants-list"]');
    return await this.restaurantCards.count();
  }

  async verifyRestaurantExists(restaurantName: string) {
    await expect(this.restaurantName(restaurantName)).toBeVisible();
  }

  async getRestaurantCard(restaurantName: string): Promise<Locator> {
    const restaurantCard = this.page.locator(`[data-testid^="restaurant-card-"]:has([data-testid="restaurant-name"]:has-text("${restaurantName}"))`);
    await expect(restaurantCard).toBeVisible();
    return restaurantCard;
  }

  async editRestaurant(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const editButton = restaurantCard.locator('[data-testid="edit-restaurant-button"]');
    await editButton.click();
  }

  async deleteRestaurant(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const deleteButton = restaurantCard.locator('[data-testid="delete-restaurant-button"]');
    await deleteButton.click();
    
    // Confirm deletion in modal
    const confirmButton = this.page.locator('[data-testid="confirm-delete-button"]');
    await confirmButton.click();
    
    // Verify restaurant is removed
    await expect(this.restaurantName(restaurantName)).not.toBeVisible();
  }

  async viewRestaurantMenu(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const viewMenuButton = restaurantCard.locator('[data-testid="view-menu-button"]');
    
    const newPagePromise = this.page.context().waitForEvent('page');
    await viewMenuButton.click();
    const newPage = await newPagePromise;
    
    await newPage.waitForLoadState('networkidle');
    return newPage;
  }

  async downloadRestaurantQR(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const downloadButton = restaurantCard.locator('[data-testid="download-qr-button"]');
    
    const downloadPromise = this.page.waitForEvent('download');
    await downloadButton.click();
    const download = await downloadPromise;
    
    return download;
  }

  async copyRestaurantQRLink(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const copyButton = restaurantCard.locator('[data-testid="copy-qr-link-button"]');
    
    await copyButton.click();
    await TestHelpers.verifyToastMessage(this.page, 'QR link copied to clipboard');
  }

  // User account methods
  async logout() {
    await this.userProfile.click();
    await TestHelpers.clickAndWait(
      this.page,
      '[data-testid="logout-button"]',
      'navigation'
    );
    
    // Verify redirect to login or home page
    await expect(this.page).toHaveURL(/\/(login|home|$)/);
  }

  async openSettings() {
    await this.userProfile.click();
    await TestHelpers.clickAndWait(
      this.page,
      '[data-testid="settings-button"]',
      'navigation'
    );
  }

  // Verification methods
  async verifyEmptyDashboard() {
    await expect(this.restaurantCards).toHaveCount(0);
    
    const emptyState = this.page.locator('[data-testid="empty-dashboard-message"]');
    await expect(emptyState).toBeVisible();
  }

  async verifyDashboardLoaded() {
    await TestHelpers.waitForElement(this.page, '[data-testid="dashboard-content"]');
    await expect(this.navbar).toBeVisible();
  }

  async verifyRestaurantCardDetails(restaurantName: string, expectedDetails: {
    hasQRCode?: boolean;
    hasPhotoMenu?: boolean;
    hasDigitalMenu?: boolean;
    createdDate?: string;
  } = {}) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    
    if (expectedDetails.hasQRCode) {
      const qrCode = restaurantCard.locator('[data-testid="qr-code-preview"]');
      await expect(qrCode).toBeVisible();
    }
    
    if (expectedDetails.hasPhotoMenu) {
      const photoMenuBadge = restaurantCard.locator('[data-testid="photo-menu-badge"]');
      await expect(photoMenuBadge).toBeVisible();
    }
    
    if (expectedDetails.hasDigitalMenu) {
      const digitalMenuBadge = restaurantCard.locator('[data-testid="digital-menu-badge"]');
      await expect(digitalMenuBadge).toBeVisible();
    }
    
    if (expectedDetails.createdDate) {
      const createdDate = restaurantCard.locator('[data-testid="created-date"]');
      await expect(createdDate).toContainText(expectedDetails.createdDate);
    }
  }

  // Filter and search methods
  async searchRestaurants(searchTerm: string) {
    const searchInput = this.page.locator('[data-testid="restaurant-search-input"]');
    await TestHelpers.fillFormField(this.page, '[data-testid="restaurant-search-input"]', searchTerm);
    
    // Wait for search results to update
    await this.page.waitForTimeout(500);
  }

  async filterByMenuType(menuType: 'photo' | 'digital' | 'all') {
    const filterSelect = this.page.locator('[data-testid="menu-type-filter"]');
    await filterSelect.click();
    await this.page.locator(`[data-value="${menuType}"]`).click();
    
    // Wait for filter to apply
    await this.page.waitForTimeout(500);
  }

  async sortRestaurants(sortBy: 'name' | 'created' | 'updated') {
    const sortSelect = this.page.locator('[data-testid="restaurant-sort"]');
    await sortSelect.click();
    await this.page.locator(`[data-value="${sortBy}"]`).click();
    
    // Wait for sort to apply
    await this.page.waitForTimeout(500);
  }

  // Bulk operations
  async selectRestaurant(restaurantName: string) {
    const restaurantCard = await this.getRestaurantCard(restaurantName);
    const checkbox = restaurantCard.locator('[data-testid="restaurant-checkbox"]');
    await checkbox.check();
  }

  async selectAllRestaurants() {
    const selectAllCheckbox = this.page.locator('[data-testid="select-all-restaurants"]');
    await selectAllCheckbox.check();
  }

  async bulkDeleteSelected() {
    const bulkDeleteButton = this.page.locator('[data-testid="bulk-delete-button"]');
    await bulkDeleteButton.click();
    
    // Confirm bulk deletion
    const confirmButton = this.page.locator('[data-testid="confirm-bulk-delete-button"]');
    await confirmButton.click();
    
    // Wait for deletion to complete
    await TestHelpers.waitForNetworkIdle(this.page);
  }

  // Performance and analytics
  async getPerformanceMetrics() {
    return await TestHelpers.getPerformanceMetrics(this.page);
  }

  async verifyPageLoadPerformance(maxLoadTime: number = 3000) {
    const metrics = await this.getPerformanceMetrics();
    expect(metrics.loadTime).toBeLessThan(maxLoadTime);
  }
}