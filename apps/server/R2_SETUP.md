# Cloudflare R2 Setup Guide (Updated 2025)

## ✅ Your Bucket Details
- **Bucket Name**: `qrunchy`
- **Account ID**: `ae689246e3715da2454b458efa2fc0f2`
- **R2 Endpoint**: `https://ae689246e3715da2454b458efa2fc0f2.r2.cloudflarestorage.com`
- **Public URL**: `https://pub-7bbb8f8509494271964ed1ac3af6ef64.r2.dev` ✅

## 🔑 Create R2 API Token (REQUIRED)

### ⚠️ **IMPORTANT: R2 Uses Its Own Token System**
**DO NOT** use the general API tokens at `https://dash.cloudflare.com/profile/api-tokens/`
**R2 has its own dedicated token creation system!**

### ✅ **Correct Method: R2 Dashboard Only**
1. **Cloudflare Dashboard** → **Account Home**
2. Select **"R2"** (this opens R2 dashboard)
3. In R2 dashboard, look for **"API"** dropdown 
4. Click **"Manage API tokens"**
5. Choose **"Create Account API token"** (recommended)
   - OR **"Create User API token"** (if you don't have Super Admin)

### 🎯 **What You Should See:**
- You'll be in the **R2-specific token creation page**
- Options: **Admin Read & Write**, **Admin Read only**, **Object Read & Write**, **Object Read only**
- Choose: **"Admin Read & Write"**
- Click **"Create Account API token"**

### 📝 **Step-by-Step R2 Dashboard Navigation:**

#### **Step 1: Get to R2 Dashboard**
- Login to Cloudflare dashboard
- Click **"Account Home"** (top left or main menu)
- Find and click **"R2"** (should be in main navigation or sidebar)

#### **Step 2: Find API Token Section**
- You're now in **R2 dashboard** (NOT general Cloudflare dashboard)
- Look for one of these options:
  - **"API"** dropdown menu
  - **"Manage API tokens"** button 
  - **"API Tokens"** link or tab

#### **Step 3: Create R2 Token**
- Click **"Manage API tokens"** 
- You'll see **R2-specific token options**:
  - **"Create Account API token"** (choose this if available)
  - **"Create User API token"** (backup option)

#### **Step 4: Configure Token**
- **Token Name**: `qrunchy-server`
- **Permission**: Select **"Admin Read & Write"**
- Optional: Scope to `menu` bucket only (or leave as "All buckets")
- Click **"Create Account API token"**

#### **Step 5: Copy Credentials**
- **IMMEDIATELY copy**:
  - **Access Key ID**: `R2_xxxxx...`
  - **Secret Access Key**: `yyyyyyy...` (shown only once!)
- These are your **S3-compatible credentials** for R2

## 📝 Update Your Environment Variables

Your `.env` file is located at: `/Users/faisal/Documents/projects/qrunchy/.env`

**Replace these lines in your root .env file:**
```bash
R2_ACCESS_KEY_ID=YOUR_R2_API_TOKEN_HERE
R2_SECRET_ACCESS_KEY=YOUR_R2_API_TOKEN_HERE
```

**With your actual token values:**
```bash
R2_ACCESS_KEY_ID=your_actual_access_key_id_from_cloudflare
R2_SECRET_ACCESS_KEY=your_actual_secret_access_key_from_cloudflare
```

## 🔍 Troubleshooting Token Creation

### Can't Find "Manage API tokens"?
- **Try**: Look for "API" dropdown in R2 dashboard
- **Try**: Search for "tokens" in dashboard search bar
- **Try**: Go to Account Settings → API Tokens
- **Try**: Use direct link: `https://dash.cloudflare.com/profile/api-tokens/`

### Permission Issues?
- **Super Administrator required** for Account API tokens
- If you're not Super Admin, ask your account admin to create the token
- Alternatively, try creating a **User API token** instead

### Don't See R2 Option?
- Ensure R2 is enabled for your account
- You might need to purchase R2 plan first
- Some accounts need to verify payment method

### Token Creation Fails?
- Check account has R2 subscription active
- Verify you have sufficient permissions
- Try refreshing the page and creating again

## 🧪 Test Your Setup

### Method 1: Using Wrangler CLI
```bash
# From your server directory
cd apps/server

# Login to Cloudflare (will open browser)
pnpm wrangler login

# Test: List your buckets
pnpm wrangler r2 bucket list
# Should show: qrunchy

# Test: Upload a file
pnpm wrangler r2 object put qrunchy/test.jpg --file test.png

# Test: List files in bucket  
pnpm wrangler r2 object list qrunchy
```

### Method 2: Test Your Server
```bash
# Start your server
cd apps/server
pnpm run dev

# Test upload endpoint (in another terminal)
curl -X POST http://localhost:3000/api/upload/photomenu \
  -F "files=@test.png" \
  -H "Content-Type: multipart/form-data"

# Should return R2 URLs like:
# {"success":true,"files":[{"url":"https://pub-7bbb8f8509494271964ed1ac3af6ef64.r2.dev/photomenu/..."}]}
```

### Method 3: Check Environment Variables
```bash
# From root directory
node -e "
require('dotenv').config();
console.log('R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);
console.log('R2_ENDPOINT:', process.env.R2_ENDPOINT);
console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);
console.log('R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? 'SET' : 'MISSING');
console.log('R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY ? 'SET' : 'MISSING');
"
```

## ✅ Final Status Check

| Variable | Your Value | Status |
|----------|------------|--------|
| `R2_BUCKET_NAME` | `qrunchy` | ✅ Set |
| `R2_ENDPOINT` | `https://ae689246e3715da2454b458efa2fc0f2.r2.cloudflarestorage.com` | ✅ Set |
| `R2_PUBLIC_URL` | `https://pub-7bbb8f8509494271964ed1ac3af6ef64.r2.dev` | ✅ Set |
| `R2_ACCESS_KEY_ID` | Your R2 API Token | ❌ **ADD THIS** |
| `R2_SECRET_ACCESS_KEY` | Same as above | ❌ **ADD THIS** |

## 🚀 Once Everything is Set Up

### Upload Flow (Photo Menu Creation)
1. User uploads photos via photo menu interface in platform
2. Server receives files and uploads to R2 `qrunchy/photomenu/` folder  
3. Returns public R2 URLs like: `https://pub-7bbb8f8509494271964ed1ac3af6ef64.r2.dev/photomenu/image-uuid.jpg`
4. Frontend stores these URLs for QR code generation

### Viewing Flow (Customer Experience)  
1. Customer scans QR code → opens photo menu viewer
2. Viewer loads images directly from R2 public URLs
3. Images served globally via Cloudflare CDN (fast worldwide)
4. No server load for image serving

### End-to-End Test
1. Create photo menu in your platform app
2. Upload some photos → should get R2 URLs back
3. Generate QR code → should create viewable photo menu
4. Scan QR → should show photos loading from R2

## 🆘 Quick Support

### ❌ Still Can't Find API Tokens?
**Try these exact paths in order:**

1. `Dashboard` → `R2` → Look for `API` or `Manage tokens` button
2. `Dashboard` → `Manage Account` → `API Tokens` → `Create Token`  
3. Direct: `https://dash.cloudflare.com/profile/api-tokens/`
4. Search dashboard for "tokens" or "API"

### ❌ Token Creation Blocked?
- **Need Super Administrator permissions** for Account tokens
- Ask your Cloudflare account owner to create the token
- Or use **User API token** instead (less permissions but might work)

### ❌ R2 Not Available?
- Purchase R2 plan first (pay-as-you-go available)
- Verify billing information is set up
- Some regions may have restrictions

**Need help?** Send screenshot of your Cloudflare dashboard and we can pinpoint the exact location!