# Server Automated Deployment Setup

## 🚀 What This Does
- **Auto-deploys** when you push to `production` branch (server changes only)
- **Simplified Docker setup** (no nginx/SSL complexity)
- **Uses Cloudflare Tunnel** for HTTPS (recommended)

## 📋 Setup Requirements

### 1. Lightsail Server Setup
```bash
# On your Lightsail instance - create deployment directory
mkdir -p /home/ubuntu/qrunchy-server
cd /home/ubuntu/qrunchy-server

# Create production environment file
nano .env
# Add your production environment variables
```

### 2. GitHub Secrets
Add these secrets in your GitHub repo: **Settings > Secrets and variables > Actions**

| Secret Name | Value | Example |
|-------------|-------|---------|
| `LIGHTSAIL_HOST` | Your server IP | `1.2.3.4` |
| `LIGHTSAIL_USER` | SSH username | `ubuntu` |
| `LIGHTSAIL_SSH_KEY` | Private SSH key | `-----BEGIN RSA PRIVATE KEY-----...` |

### 3. SSH Key Setup
```bash
# Generate SSH key pair (if you haven't already)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/lightsail_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/lightsail_deploy.pub ubuntu@YOUR_SERVER_IP

# Add private key content to GitHub secret LIGHTSAIL_SSH_KEY
cat ~/.ssh/lightsail_deploy
```

### 4. Cloudflare Tunnel (Recommended)
```bash
# On your server, install cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Login and create tunnel
cloudflared tunnel login
cloudflared tunnel create qrunchy-server
cloudflared tunnel route dns qrunchy-server api.qrunchy.menu

# Create config
mkdir -p ~/.cloudflared
echo "tunnel: YOUR_TUNNEL_ID
credentials-file: /home/ubuntu/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.qrunchy.menu
    service: http://localhost:3000
  - service: http_status:404" > ~/.cloudflared/config.yml

# Run tunnel
cloudflared tunnel run qrunchy-server
```

## 🔄 How It Works

1. **Push to production** → GitHub Action triggers
2. **Sparse checkout** → Only downloads `apps/server/` 
3. **SCP transfer** → Copies server files to Lightsail
4. **Run deploy.sh** → Rebuild containers
5. **Cloudflare Tunnel** → Serves HTTPS traffic

## 🌟 Deployment Workflow

```bash
# Development workflow
git checkout main
# ... make changes ...
git commit -m "Add new feature"
git push origin main

# When ready to deploy
git checkout production
git merge main
git push origin production  # 🚀 This triggers deployment!
```

## 🏃‍♂️ Manual Deployment
```bash
# SSH to your server
ssh ubuntu@YOUR_SERVER_IP

# Go to deployment directory
cd /home/ubuntu/qrunchy-server

# Run deployment script
./deploy.sh
```

## 🆘 Troubleshooting

### GitHub Action fails?
- Check SSH connection: `ssh ubuntu@YOUR_SERVER_IP`
- Verify secrets are set correctly
- Check server logs: `docker-compose logs`

### Container won't start?
- Check environment variables: `cat .env`
- View container logs: `docker-compose logs qrunchy-server`
- Restart: `docker-compose restart`

### Database issues?
- Reset database: `docker-compose down -v && docker-compose up -d`
- Check migrations: `docker-compose exec qrunchy-server npm run migrate`