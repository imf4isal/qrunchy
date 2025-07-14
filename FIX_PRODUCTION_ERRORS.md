# Fix Production Errors Guide

## 🚨 Current Issues

### 1. API Connection Error (Error 525)
- **Problem**: `https://api.qrunchy.menu` returns error 525 (SSL Handshake Failed)
- **Root Cause**: Cloudflare tunnel not properly configured or not running

### 2. Old Cloudflare Tunnel URL in Browser
- **Problem**: Frontend trying to connect to `eur-laser-currencies-solomon.trycloudflare.com`
- **Root Cause**: Browser cache or old development session

### 3. PhotoURL Null Reference
- **Problem**: `Cannot read properties of null (reading 'photoURL')`
- **Root Cause**: Browser extensions or dev tools accessing non-existent properties

---

## 🔧 Solutions

### Step 1: Fix Cloudflare Tunnel

SSH to your Lightsail server and set up the tunnel properly:

```bash
# SSH to server
ssh -i ~/Downloads/lightsail-default.pem ubuntu@13.250.49.6

# Check if cloudflared is running
ps aux | grep cloudflared

# If not running, start the tunnel
cd ~/qrunchy-server

# Create tunnel config (if not exists)
mkdir -p ~/.cloudflared

# Login to Cloudflare (do this once)
cloudflared tunnel login

# Create tunnel (if not exists)
cloudflared tunnel create qrunchy-api

# Configure tunnel
cat > ~/.cloudflared/config.yml << 'EOF'
tunnel: qrunchy-api
credentials-file: ~/.cloudflared/qrunchy-api.json

ingress:
  - hostname: api.qrunchy.menu
    service: http://localhost:3000
  - service: http_status:404
EOF

# Set DNS record
cloudflared tunnel route dns qrunchy-api api.qrunchy.menu

# Run tunnel (test)
cloudflared tunnel run qrunchy-api
```

### Step 2: Create Tunnel Service (Auto-start)

```bash
# Create systemd service for auto-start
sudo tee /etc/systemd/system/cloudflared.service > /dev/null <<EOF
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/local/bin/cloudflared tunnel run qrunchy-api
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

### Step 3: Clear Browser Cache

**For users experiencing the old tunnel URL:**

1. **Clear browser cache completely**
2. **Open developer tools → Application → Clear Storage**
3. **Try incognito/private browsing mode**
4. **Hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Step 4: Test API Connection

```bash
# Test from server
curl http://localhost:3000

# Test from outside (should work after tunnel is fixed)
curl https://api.qrunchy.menu
```

---

## 🧪 Verification Steps

### 1. Check Server Status
```bash
# On server
docker compose ps
# Should show both containers running

curl http://localhost:3000
# Should return: {"message":"Hello from Qrunchy API - CI/CD Test Successful!"}
```

### 2. Check Tunnel Status
```bash
# On server
cloudflared tunnel list
# Should show qrunchy-api tunnel

sudo systemctl status cloudflared
# Should show active (running)
```

### 3. Test API Endpoints
```bash
# From your local machine
curl https://api.qrunchy.menu
# Should return API response, not error 525

curl https://api.qrunchy.menu/trpc
# Should return tRPC metadata
```

### 4. Test Frontend
1. **Clear browser cache completely**
2. **Go to**: https://qrunchy.menu
3. **Open dev tools console**
4. **Should see**: `🔗 tRPC connecting to: https://api.qrunchy.menu` (in development)
5. **Try creating photo menu** - should work without tunnel errors

---

## 🎯 Expected Results After Fix

- ✅ `https://api.qrunchy.menu` responds with valid JSON
- ✅ Photo menu creation works without API errors
- ✅ Digital menu flow works properly
- ✅ No more "trycloudflare.com" errors
- ✅ PhotoURL errors reduced (may still appear from extensions)

---

## 🆘 Troubleshooting

### If tunnel still doesn't work:
1. **Check DNS**: `nslookup api.qrunchy.menu`
2. **Check firewall**: Ensure port 3000 is accessible locally
3. **Check logs**: `journalctl -u cloudflared -f`

### If frontend still shows old URL:
1. **Clear all browser data**
2. **Check if dev server is running** on localhost:5173
3. **Try different browser/incognito**

### If photoURL errors persist:
1. **Disable browser extensions temporarily**
2. **Check if error only appears in development**
3. **Ignore if it doesn't affect functionality**