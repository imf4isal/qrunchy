import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for photo menu e2e tests...');

  // Create test image fixtures if they don't exist
  await createTestImages();
  
  // Pre-warm the application if needed
  if (process.env.CI) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      // Navigate to the app to ensure it's running
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
      console.log('✅ Application pre-warmed successfully');
    } catch (error) {
      console.error('❌ Failed to pre-warm application:', error);
    } finally {
      await browser.close();
    }
  }

  console.log('✅ Global setup completed');
}

async function createTestImages() {
  const fs = await import('fs');
  const path = await import('path');
  
  const testImagesDir = path.join(__dirname, '../fixtures/images');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(testImagesDir)) {
    fs.mkdirSync(testImagesDir, { recursive: true });
  }

  // Create simple test images (we'll use existing images or create placeholders)
  const testImages = [
    'menu-page-1.jpg',
    'menu-page-2.jpg',
    'large-menu-1.jpg'
  ];

  for (const imageName of testImages) {
    const imagePath = path.join(testImagesDir, imageName);
    if (!fs.existsSync(imagePath)) {
      // Create a minimal JPEG placeholder for testing
      // In a real scenario, you'd copy actual test menu images here
      const placeholderImage = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0xFF, 0xD9
      ]);
      fs.writeFileSync(imagePath, placeholderImage);
      console.log(`📸 Created test image: ${imageName}`);
    }
  }
}

export default globalSetup;