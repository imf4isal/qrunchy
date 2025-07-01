FROM node:20-bookworm

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Expose ports
EXPOSE 3000 5173