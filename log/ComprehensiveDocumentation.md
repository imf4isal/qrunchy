# Qrunchy Platform - Complete Developer Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Frontend Development](#frontend-development)
5. [Backend Development](#backend-development)
6. [Database Management](#database-management)
7. [API Reference](#api-reference)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)

---

## Project Overview

**Qrunchy** is a comprehensive digital menu platform that enables restaurants to replace traditional paper menus with QR code-based digital alternatives. The platform supports two primary workflows:

### Core Features

- **Photo Menu**: Simple image-based menus with drag-and-drop upload
- **Digital Menu**: Structured menus with categories, items, variants, and add-ons
- **Multi-theme Support**: Customizable customer viewing experiences
- **Chain Management**: Support for restaurant chains and food courts
- **QR Code Generation**: Automatic QR code creation for menu access
- **Image Management**: Full image upload and storage for menu items
- **OTP Authentication**: SMS-based user verification system

### Technology Stack

**Frontend (Platform)**

- React 19.1.0 with TypeScript
- Vite for development and building
- Wouter for lightweight routing
- tRPC for type-safe API communication
- Tailwind CSS 4.x for styling
- Radix UI for accessible components
- TanStack Query for server state management

**Backend (Server)**

- Node.js with TypeScript (ESM modules)
- Express.js with tRPC integration
- Kysely ORM with PostgreSQL
- Cloudflare R2 for file storage
- SMS Orbis for OTP delivery
- Zod for input validation

**Infrastructure**

- Docker with Turbo monorepo
- PostgreSQL 15 database
- Cloudflare R2 object storage
- SMS API integration

---

## Architecture

### Monorepo Structure

```
qrunchy/
├── apps/
│   ├── platform/          # React frontend application
│   │   ├── src/
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── pages/      # Page-level components
│   │   │   ├── contexts/   # React context providers
│   │   │   ├── types/      # TypeScript definitions
│   │   │   └── utils/      # Utility functions
│   │   └── package.json
│   └── server/             # Node.js backend API
│       ├── src/
│       │   ├── trpc/       # tRPC routers and procedures
│       │   ├── db/         # Database migrations and queries
│       │   ├── storage/    # File storage abstraction
│       │   ├── services/   # Business logic services
│       │   └── restroutes/ # Express REST endpoints
│       └── package.json
├── log/                    # Documentation and change logs
├── docker-compose.yaml     # Development environment
├── Dockerfile             # Production container
└── package.json           # Root workspace configuration
```

### Data Flow Architecture

```mermaid
graph TD
    A[User] --> B[Frontend React App]
    B --> C[tRPC Client]
    C --> D[Backend tRPC API]
    D --> E[Database Queries]
    D --> F[File Storage]
    E --> G[PostgreSQL]
    F --> H[Cloudflare R2]
    I[SMS Service] --> D
```

### Key Design Patterns

**Frontend Patterns:**

- Context API for global state management
- Custom hooks for reusable logic
- Compound components for UI flexibility
- Optimistic updates with error rollback

**Backend Patterns:**

- Layered architecture with clear separation
- Factory pattern for storage providers
- Repository pattern for database access
- Middleware-based request processing

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (for local development)
- pnpm package manager

### Environment Setup

1. **Clone and Install Dependencies**

```bash
git clone <repository-url>
cd qrunchy
pnpm install
```

2. **Environment Configuration**
   Create `.env` file in the project root:

```bash
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=qrunchy_db
DB_USER=qrunchy
DB_PASSWORD=qrunchy_password
DATABASE_URL=postgresql://qrunchy:qrunchy_password@postgres:5432/qrunchy_db

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# SMS Configuration (for OTP)
SMS_ORBIS_API_KEY=your_api_key
SMS_ORBIS_SENDER_ID=your_sender_id

# Cloudflare R2 Configuration
R2_BUCKET_NAME=your_bucket
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-public-url.r2.dev
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
```

3. **Development with Docker**

```bash
# Start all services
docker-compose up

# Access the application
Frontend: http://localhost:5173
Backend: http://localhost:3000
Database: localhost:5432
```

4. **Local Development**

```bash
# Start development servers
pnpm dev

# Run database migrations
cd apps/server
pnpm migrate
```

### Quick Start Guide

1. **Access the Application**: Navigate to `http://localhost:5173`
2. **Create a Photo Menu**: Click "Photo Menu" → Upload images → Sort → Generate QR
3. **Create a Digital Menu**: Click "Digital Menu" → Build categories and items → Generate QR
4. **View Customer Experience**: Scan QR code or access the generated URL

---

## Frontend Development

### Component Architecture

**UI Components** (`/components/ui/`)

- Built on Radix UI primitives
- Styled with Tailwind CSS and Class Variance Authority
- Fully accessible and keyboard navigable
- Examples: Button, Card, Dialog, Input, Tabs

**Feature Components**

- `AuthContext`: User authentication and session management
- `RestaurantContext`: Restaurant selection and management
- `ThemeSelector`: Theme switching interface
- `QRCodeDisplay`: QR code generation and display

**Page Components**

- Organized by feature area (`/pages/auth/`, `/pages/dashboard/`, etc.)
- Route-based code splitting
- Consistent layout and error handling

### State Management

**Global State (Context API)**

```typescript
// Authentication state
const { user, login, logout, restaurants } = useAuth();

// Restaurant selection
const { currentRestaurant, setRestaurant } = useRestaurant();
```

**Server State (TanStack Query + tRPC)**

```typescript
// Data fetching
const { data, isLoading, error } = trpc.restaurant.getByUser.useQuery({
  user_id: user.id,
});

// Mutations with optimistic updates
const updateMutation = trpc.restaurant.update.useMutation({
  onSuccess: () => queryClient.invalidateQueries(),
});
```

**Local State**

- Component-specific state with `useState`
- Form handling with controlled components
- Draft persistence in localStorage for multi-step flows

### Routing Setup

**Route Configuration** (`/router/index.tsx`)

```typescript
// Public routes
<Route path="/" component={Home} />
<Route path="/photo-menu" component={PhotoMenu} />
<Route path="/digital-menu" component={DigitalMenu} />
<Route path="/menu/:qrCode" component={MenuHandler} />

// Protected routes
<ProtectedRoute path="/dashboard" component={Dashboard} />
<ProtectedRoute path="/dashboard/restaurant/:id/menu" component={RestaurantMenuManager} />
```

### Key Development Patterns

**tRPC Integration**

```typescript
// Query with error handling
const { data: menu, error } = trpc.digitalMenu.get.useQuery(
  { restaurant_id: restaurantId },
  {
    enabled: !!restaurantId,
    onError: (error) => console.error("Failed to load menu:", error),
  }
);

// Mutation with optimistic updates
const saveMutation = trpc.digitalMenu.save.useMutation({
  onMutate: async (variables) => {
    // Optimistic update
    await queryClient.cancelQueries(["digitalMenu", "get"]);
    const previousData = queryClient.getQueryData(["digitalMenu", "get"]);
    queryClient.setQueryData(["digitalMenu", "get"], variables);
    return { previousData };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(["digitalMenu", "get"], context?.previousData);
  },
  onSettled: () => {
    queryClient.invalidateQueries(["digitalMenu", "get"]);
  },
});
```

**Error Handling**

```typescript
// Component-level error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <MenuBuilder />
</ErrorBoundary>

// Query error handling
if (error) {
  return <ErrorScreen message={error.message} />;
}
```

---

## Backend Development

### Server Architecture

**Express Server Setup** (`/src/index.mts`)

- CORS configuration for frontend communication
- tRPC middleware integration
- File upload endpoints
- Health check endpoints

**tRPC Router Organization**

```typescript
export const appRouter = router({
  hello: helloRouter, // Health checks
  auth: authRouter, // Authentication
  user: userRouter, // User management
  restaurant: restaurantRouter, // Restaurant CRUD
  digitalMenu: digitalMenuRouter, // Digital menu operations
  photoMenu: photoMenuRouter, // Photo menu operations
});
```

### Database Integration

**Kysely ORM Setup**

```typescript
// Database connection
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

// Type-safe queries
const restaurants = await db
  .selectFrom("restaurant")
  .selectAll()
  .where("user_id", "=", userId)
  .where("is_active", "=", true)
  .execute();
```

**Migration System**

- Sequential numbered migrations
- Automatic migration execution
- Rollback capabilities
- Type generation from schema

### API Development Patterns

**Input Validation with Zod**

```typescript
const createRestaurantSchema = z.object({
  name: z.string().min(1).max(100),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  address: z.string().optional(),
  user_id: z.number().int().positive(),
});

// tRPC procedure
export const createRestaurant = procedure
  .input(createRestaurantSchema)
  .mutation(async ({ input }) => {
    // Implementation
  });
```

**Error Handling**

```typescript
// Custom error types
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Restaurant not found',
});

// Error middleware
.use(async (opts) => {
  try {
    return await opts.next();
  } catch (error) {
    logger.error('API Error:', error);
    throw error;
  }
})
```

### File Storage System

**Storage Abstraction**

```typescript
interface IStorageProvider {
  uploadFile(file: Buffer, key: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
  getFileUrl(key: string): string;
}

// Environment-based provider selection
const storageProvider =
  process.env.NODE_ENV === "production"
    ? new R2StorageProvider()
    : new LocalStorageProvider();
```

**File Upload Implementation**

```typescript
// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

// Upload endpoint
app.post(
  "/api/upload/menuitem/single",
  upload.single("file"),
  async (req, res) => {
    const file = req.file;
    const key = `menuitem/${uuidv4()}-${file.originalname}`;
    const url = await storageProvider.uploadFile(file.buffer, key);
    res.json({ url, key });
  }
);
```

---

## Database Management

### Schema Overview

**Core Tables**

- `user`: User accounts with mobile authentication
- `restaurant`: Restaurant information and settings
- `group_res`: Restaurant chains and food courts
- `qr_code`: QR code generation and management
- `otp_verification`: OTP authentication system

**Menu Structure**

- `photo_menu`: Image-based menu items
- `category`: Digital menu categories
- `item`: Menu items with pricing and descriptions
- `variant`: Item variants (size, spice level, etc.)
- `variant_option`: Variant choices with pricing
- `addon`: Additional item options

### Database Relationships

```sql
-- User owns multiple restaurants
user (1) → (many) restaurant

-- Restaurant can belong to a chain
group_res (1) → (many) restaurant

-- Restaurant has QR codes and menus
restaurant (1) → (many) qr_code
restaurant (1) → (many) photo_menu
restaurant (1) → (many) category

-- Menu structure hierarchy
category (1) → (many) item
item (1) → (many) variant
item (1) → (many) addon
variant (1) → (many) variant_option
```

### Migration Management

**Running Migrations**

```bash
# Development
cd apps/server
pnpm migrate

# Production (Docker)
docker exec qrunchy sh -c "cd apps/server && npm run migrate:prod"

# Rollback
pnpm migrate:down
```

**Creating New Migrations**

```typescript
// Example migration file: 016_add_new_feature.mts
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("new_table")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo("now()"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("new_table").execute();
}
```

### Database Queries

**Complex Query Examples**

```typescript
// Get complete menu with all relationships
const menu = await db
  .selectFrom("restaurant")
  .leftJoin("category", "category.restaurant_id", "restaurant.id")
  .leftJoin("item", "item.category_id", "category.id")
  .leftJoin("variant", "variant.item_id", "item.id")
  .leftJoin("variant_option", "variant_option.item_variant_id", "variant.id")
  .leftJoin("addon", "addon.item_id", "item.id")
  .selectAll()
  .where("restaurant.id", "=", restaurantId)
  .execute();

// Restaurant statistics
const stats = await db
  .selectFrom("restaurant")
  .leftJoin("qr_code", "qr_code.restaurant_id", "restaurant.id")
  .select([
    "restaurant.id",
    "restaurant.name",
    (eb) => eb.fn.count("qr_code.id").as("qr_count"),
  ])
  .where("restaurant.user_id", "=", userId)
  .groupBy("restaurant.id")
  .execute();
```

---

## API Reference

### Authentication Endpoints

**Send OTP**

```typescript
// POST /trpc/auth.sendOTP
{
  "mobile_number": "+1234567890"
}
// Response: { "success": true, "message": "OTP sent" }
```

**Verify OTP**

```typescript
// POST /trpc/auth.verifyOTP
{
  "mobile_number": "+1234567890",
  "otp_code": "123456"
}
// Response: { "user": {...}, "verified": true }
```

**Login with Password**

```typescript
// POST /trpc/auth.loginWithPassword
{
  "mobile_number": "+1234567890",
  "password": "secure_password"
}
// Response: { "user": {...}, "restaurants": [...] }
```

### Restaurant Management

**Create Restaurant**

```typescript
// POST /trpc/restaurant.create
{
  "name": "My Restaurant",
  "mobile": "+1234567890",
  "address": "123 Main St",
  "user_id": 1,
  "group_res_id": null // Optional chain ID
}
```

**Update Restaurant Theme**

```typescript
// POST /trpc/restaurant.updateTheme
{
  "id": 1,
  "theme_id": "modern" // "minimal" | "modern"
}
```

### Digital Menu Operations

**Save Complete Menu**

```typescript
// POST /trpc/digitalMenu.save
{
  "restaurant_id": 1,
  "categories": [
    {
      "name": "Appetizers",
      "sort_order": 1,
      "items": [
        {
          "name": "Caesar Salad",
          "price": 12.99,
          "description": "Fresh romaine lettuce...",
          "image_url": "https://...",
          "variants": [
            {
              "name": "Size",
              "options": [
                { "name": "Small", "price": 0 },
                { "name": "Large", "price": 3.00 }
              ]
            }
          ],
          "addons": [
            { "name": "Extra Chicken", "price": 4.00 }
          ]
        }
      ]
    }
  ]
}
```

### QR Code Management

**Generate QR Code**

```typescript
// POST /trpc/qr.generate
{
  "restaurant_id": 1,
  "type": "digital", // "digital" | "photo"
  "self_serve": true
}
// Response: { "qr_code": "ABC123", "url": "https://app.com/menu/ABC123" }
```

**Get Menu by QR Code**

```typescript
// GET /trpc/qr.getMenuByQr?input={"qr_code":"ABC123"}
// Response: Complete menu structure with all items, variants, and addons
```

### File Upload Endpoints

**Menu Item Image Upload**

```bash
POST /api/upload/menuitem/single
Content-Type: multipart/form-data

file: [image file] (JPEG, PNG, WebP, max 5MB)
```

**Photo Menu Upload**

```bash
POST /api/upload/photomenu/multiple
Content-Type: multipart/form-data

files: [multiple image files] (max 10MB total)
```

---

## Deployment

### Docker Production Deployment

**Build Production Image**

```bash
# Build the application
docker build -t qrunchy-app .

# Run with production environment
docker run -d \
  --name qrunchy-production \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e R2_BUCKET_NAME=production-bucket \
  qrunchy-app
```

**Docker Compose Production**

```yaml
# docker-compose.prod.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      R2_BUCKET_NAME: ${R2_BUCKET_NAME}
      # ... other env vars
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
```

### Environment Configuration

**Required Environment Variables**

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com

# Storage
R2_BUCKET_NAME=production-bucket
R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://your-public-url.r2.dev
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret

# SMS (Optional)
SMS_ORBIS_API_KEY=your-api-key
SMS_ORBIS_SENDER_ID=your-sender-id
```

### Deployment Scripts

**Database Migration in Production**

```bash
# Run migrations before starting the app
docker exec production-container sh -c "cd apps/server && npm run migrate:prod"
```

**Health Checks**

```bash
# Application health
curl http://localhost:3000/

# Database connectivity
curl http://localhost:3000/trpc/hello.hello?input={"name":"health"}

# Storage connectivity
curl -X POST http://localhost:3000/api/upload/test \
  -F "file=@test.jpg"
```

---

## Testing

### Current Test Status

⚠️ **Note**: The project currently lacks comprehensive test coverage. Below is the recommended testing strategy:

### Unit Testing Setup

**Jest Configuration** (Recommended)

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
```

**Example Unit Tests**

```typescript
// __tests__/utils/validation.test.ts
import { validateMobileNumber } from "../src/utils/validation";

describe("validateMobileNumber", () => {
  it("should accept valid mobile numbers", () => {
    expect(validateMobileNumber("+1234567890")).toBe(true);
    expect(validateMobileNumber("1234567890")).toBe(true);
  });

  it("should reject invalid mobile numbers", () => {
    expect(validateMobileNumber("abc")).toBe(false);
    expect(validateMobileNumber("123")).toBe(false);
  });
});
```

### Integration Testing

**tRPC Procedure Testing**

```typescript
// __tests__/trpc/restaurant.test.ts
import { createTRPCMsw } from "msw-trpc";
import { appRouter } from "../src/trpc";

describe("Restaurant procedures", () => {
  it("should create restaurant successfully", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, mobile_number: "+1234567890" },
    });

    const restaurant = await caller.restaurant.create({
      name: "Test Restaurant",
      mobile: "+1234567890",
      user_id: 1,
    });

    expect(restaurant).toMatchObject({
      name: "Test Restaurant",
      mobile: "+1234567890",
    });
  });
});
```

### End-to-End Testing

**Playwright Setup** (Recommended)

```typescript
// e2e/restaurant-creation.spec.ts
import { test, expect } from "@playwright/test";

test("Complete restaurant creation flow", async ({ page }) => {
  await page.goto("http://localhost:5173/digital-menu");

  // Fill restaurant details
  await page.fill('[data-testid="restaurant-name"]', "Test Restaurant");
  await page.fill('[data-testid="restaurant-mobile"]', "+1234567890");

  // Create menu structure
  await page.click('[data-testid="add-category"]');
  await page.fill('[data-testid="category-name"]', "Appetizers");

  // Verify QR generation
  await page.click('[data-testid="generate-qr"]');
  await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
});
```

### Manual Testing Checklist

**Authentication Flow**

- [ ] Send OTP to valid mobile number
- [ ] Verify OTP with correct code
- [ ] Login with password
- [ ] Session persistence after refresh

**Photo Menu Creation**

- [ ] Upload multiple images
- [ ] Drag and drop reordering
- [ ] QR code generation
- [ ] Customer view rendering

**Digital Menu Creation**

- [ ] Create categories and items
- [ ] Add variants and addons
- [ ] Image upload for items
- [ ] Theme switching
- [ ] Bulk import/export

**Customer Experience**

- [ ] QR code scanning
- [ ] Menu loading and display
- [ ] Search functionality
- [ ] Mobile responsiveness

---

## Troubleshooting

### Common Issues

**1. Docker Containers Not Starting**

```bash
# Check container logs
docker logs qrunchy
docker logs qrunchy-postgres

# Restart containers
docker-compose down
docker-compose up --build

# Clear Docker cache
docker system prune -a
```

**2. Database Connection Issues**

```bash
# Verify PostgreSQL is running
docker exec qrunchy-postgres psql -U qrunchy -d qrunchy_db -c "SELECT 1;"

# Check environment variables
docker exec qrunchy printenv | grep DB_

# Run migrations manually
docker exec qrunchy sh -c "cd apps/server && npm run migrate"
```

**3. File Upload Failures**

```bash
# Check R2 configuration
docker exec qrunchy node -e "console.log(process.env.R2_BUCKET_NAME)"

# Test storage connectivity
curl -X POST http://localhost:3000/api/upload/test \
  -F "file=@test.jpg"

# Check file permissions (local storage)
ls -la apps/server/uploads/
```

**4. Frontend Not Loading**

```bash
# Check Vite dev server
docker logs qrunchy | grep platform

# Verify frontend environment
docker exec qrunchy sh -c "cd apps/platform && npm run build"

# Check network connectivity
curl http://localhost:5173
```

**5. tRPC API Errors**

```bash
# Test tRPC endpoint
curl "http://localhost:3000/trpc/hello.hello?input={\"name\":\"test\"}"

# Check server logs
docker logs qrunchy | grep server

# Verify CORS configuration
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS http://localhost:3000/trpc
```

### Performance Issues

**Database Query Optimization**

```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC LIMIT 10;

-- Add missing indexes
CREATE INDEX idx_restaurant_user_id ON restaurant(user_id);
CREATE INDEX idx_item_category_id ON item(category_id);
```

**Memory Issues**

```bash
# Monitor container memory usage
docker stats qrunchy

# Check Node.js memory usage
docker exec qrunchy node -e "console.log(process.memoryUsage())"

# Increase container memory limit
docker run --memory=1g qrunchy-app
```

### Development Issues

**TypeScript Compilation Errors**

```bash
# Check TypeScript configuration
cd apps/platform && npx tsc --noEmit
cd apps/server && npx tsc --noEmit

# Fix import path issues
# Change from: import './file.mts'
# To: import './file.js'
```

**Linting Issues**

```bash
# Fix automatic issues
cd apps/platform && npm run lint -- --fix

# Check specific files
npx eslint src/components/SomeComponent.tsx
```

**Hot Reload Not Working**

```bash
# Restart Vite dev server
docker exec qrunchy sh -c "cd apps/platform && pkill -f vite"
docker-compose restart

# Check file watching
docker exec qrunchy sh -c "ls -la /app/apps/platform/src"
```

---

## Contributing

### Development Workflow

1. **Setup Development Environment**

```bash
git clone <repository>
cd qrunchy
pnpm install
docker-compose up
```

2. **Create Feature Branch**

```bash
git checkout -b feature/new-feature
```

3. **Make Changes**

- Follow existing code patterns
- Add tests for new functionality
- Update documentation as needed

4. **Commit Changes**

```bash
git add .
git commit -m "feat: add new feature description"
```

5. **Submit Pull Request**

- Ensure all tests pass
- Include description of changes
- Reference any related issues

### Code Standards

**TypeScript Guidelines**

- Use strict type checking
- Avoid `any` types when possible
- Define interfaces for data structures
- Use Zod for runtime validation

**React Guidelines**

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance
- Use TypeScript for component props

**Database Guidelines**

- Create migrations for schema changes
- Use Kysely for type-safe queries
- Include proper foreign key constraints
- Add appropriate indexes

### Project Structure Guidelines

**File Naming**

- Use kebab-case for file names
- Use PascalCase for React components
- Use camelCase for utility functions
- Include `.test.ts` suffix for tests

**Import Organization**

```typescript
// External libraries
import React from "react";
import { z } from "zod";

// Internal modules
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";

// Types
import type { Restaurant } from "../../types/restaurant";
```

**Component Structure**

```typescript
// Component props interface
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// Main component
export function Component({ title, onSubmit }: ComponentProps) {
  // Hooks
  const [state, setState] = useState();

  // Event handlers
  const handleSubmit = () => {
    // Implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---
