#!/bin/bash

echo "Setting up SSL certificates for api.qrunchy.menu..."

# Create webroot directory
mkdir -p webroot

# Start nginx and certbot temporarily to get certificates
docker-compose up -d nginx certbot

# Wait for nginx to be ready
sleep 10

# Get SSL certificate
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email your-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d api.qrunchy.menu

echo "SSL setup complete. Restarting services..."

# Restart nginx with SSL
docker-compose restart nginx

echo "Setup complete! Your API is now available at https://api.qrunchy.menu"