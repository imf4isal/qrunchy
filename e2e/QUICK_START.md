# Quick Start Guide - Photo Menu E2E Tests

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
pnpm run test:install
```

### 2. Start Development Server
```bash
# Terminal 1: Start the app
pnpm run dev

# Wait for server to start at http://localhost:5173
```

### 3. Run Your First Test
```bash
# Terminal 2: Run a quick smoke test
pnpm exec playwright test e2e/tests/photo-menu-flows.spec.ts --headed --grep "registered-logged-in"
```

## 📱 Test the Flows You Care About

### Test Registered User Flow (Most Common)
```bash
pnpm exec playwright test --grep "registered-logged-in"
```

### Test New User Registration Flow
```bash
pnpm exec playwright test --grep "unregistered"
```

### Test OTP Flow (Logged Out Users)
```bash
pnpm exec playwright test --grep "registered-logged-out"
```

## 🔧 Quick Commands

```bash
# Interactive test runner (best for development)
pnpm run test:e2e:ui

# Run all tests
pnpm run test:e2e

# Debug mode (pauses at each step)
pnpm run test:e2e:debug

# Test specific browser
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit

# Mobile testing
pnpm exec playwright test --project="Mobile Chrome"
```

## 🎯 What Gets Tested

Each test run validates:
- ✅ Restaurant name entry
- ✅ Image upload (multiple files)
- ✅ Image sorting/reordering
- ✅ Authentication (OTP/Password/Registration)
- ✅ QR code generation
- ✅ Dashboard redirect
- ✅ Restaurant appears in dashboard

## 🛠️ Customize for Your Needs

### Change Test Data
Edit `e2e/fixtures/test-data.ts`:
```typescript
static getTestRestaurant(suffix: string = ''): TestRestaurant {
  return {
    name: `Your Custom Restaurant Name ${suffix}`,
    address: 'Your Test Address',
  };
}
```

### Add Test Images
Place your menu images in `e2e/fixtures/images/` and update `test-data.ts`.

### Mock Different API Responses
Edit `e2e/utils/api-mocks.ts` to simulate different server responses.

## 📊 View Results

After running tests:
```bash
# Open detailed HTML report
npx playwright show-report

# View specific test trace
npx playwright show-trace test-results/trace.zip
```

## 🚨 Troubleshooting

### Server Not Running?
```bash
# Make sure dev server is running
curl http://localhost:5173
# Should return HTML, not connection refused
```

### Tests Failing?
```bash
# Run with more verbose output
DEBUG=pw:api pnpm exec playwright test

# Check what's happening visually
pnpm exec playwright test --headed --slowMo=1000
```

### Permission Issues?
```bash
# Make sure test images are readable
ls -la e2e/fixtures/images/
```

## 🎉 Success!

If tests are passing, you now have:
- Automated testing for all photo menu creation flows
- Cross-browser compatibility verification
- Performance monitoring
- Regression testing for future changes

**No more manual clicking through the entire flow every time!** 🎊