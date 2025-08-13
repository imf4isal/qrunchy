# Qrunchy - Digital Menu Platform Documentation

## Project Overview

Qrunchy is a comprehensive digital menu platform designed for restaurants to replace traditional paper menus with QR code-based digital alternatives. The platform offers two primary flows: **Photo Menu** (simple photo uploads) and **Digital Menu** (structured menu creation with advanced features).

### Architecture

**Turbo Monorepo Structure:**
- `apps/server/` - Backend API server (Node.js + TypeScript + tRPC + Kysely ORM)
- `apps/platform/` - Frontend application (React + TypeScript + Vite + Tailwind CSS)

### Key Technologies

**Backend:**
- Node.js with TypeScript
- tRPC for type-safe API communication
- Kysely ORM for PostgreSQL database operations
- Express.js server with CORS support
- AWS S3/Cloudflare R2 for file storage
- Multer for file upload handling

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Wouter for routing
- TanStack Query for data fetching
- tRPC client for backend communication
- Radix UI for component primitives

---

## Database Schema

### Current Database Structure

The database has evolved through 12 migrations, resulting in the following schema:

#### Core Tables

**user**
```sql
- id (serial, primary key)
- mobile_number (varchar, unique, not null)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
```

**group_res** (Restaurant Chains/Groups)
```sql
- id (serial, primary key)
- name (varchar, not null)
- description (text, nullable)
- geolocation (point)
- user_id (integer, references user.id)
- type (enum: 'chain' | 'foodcourt', default 'chain') -- Added in migration 012
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
- is_active (boolean, default true)
```

**restaurant**
```sql
- id (serial, primary key)
- name (varchar, not null)
- mobile (varchar, not null)
- address (text, nullable)
- geolocation (point)
- group_res_id (integer, references group_res.id, nullable)
- user_id (integer, references user.id, not null)
- theme_id (varchar, default 'minimal') -- Added in migration 011
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
- is_active (boolean, default true)
```

**qr_code**
```sql
- id (serial, primary key)
- code (varchar, unique, not null)
- type (enum: 'photo' | 'digital')
- status (enum: 'available' | 'used' | 'expired')
- restaurant_id (integer, references restaurant.id, nullable)
- created_at (timestamp, default now())
- bound_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- self_serve (boolean, default false)
```

#### Menu Structure Tables

**photo_menu**
```sql
- id (serial, primary key)
- restaurant_id (integer, references restaurant.id, not null)
- image_url (varchar, not null)
- sort_order (integer, not null)
- created_at (timestamp, default now())
- updated_at (timestamp, default now())
```

**category**
```sql
- id (serial, primary key)
- restaurant_id (integer, references restaurant.id, not null)
- name (varchar, not null)
- sort_order (integer, not null)
```

**item**
```sql
- id (serial, primary key)
- name (varchar, not null)
- price (decimal(10,2), not null)
- description (text, nullable)
- category_id (integer, references category.id, not null)
- sort_order (integer, not null)
- image_url (varchar(500), nullable) -- Added in migration 013
```

**variant**
```sql
- id (serial, primary key)
- name (varchar, not null) -- e.g., "Size", "Spice Level"
- item_id (integer, references item.id, not null)
```

**variant_option**
```sql
- id (serial, primary key)
- item_variant_id (integer, references variant.id, not null)
- name (varchar, not null) -- e.g., "Large", "Medium", "Spicy"
- price (decimal(10,2), not null)
```

**addon**
```sql
- id (serial, primary key)
- item_id (integer, references item.id, not null)
- name (varchar, not null)
- price (decimal(10,2), not null)
```

### Database Relationships

```
user (1) → (many) restaurant
user (1) → (many) group_res
group_res (1) → (many) restaurant [optional chain grouping]
restaurant (1) → (many) qr_code
restaurant (1) → (many) photo_menu
restaurant (1) → (many) category
category (1) → (many) item
item (1) → (many) variant
item (1) → (many) addon
variant (1) → (many) variant_option
```

---

## Backend API Architecture

### tRPC Router Structure

The backend uses tRPC for type-safe API communication with the following router organization:

**Main Router** (`apps/server/src/trpc/index.mts`)
```typescript
export const appRouter = router({
  hello: helloRouter,
  auth: authRouter,
  user: userRouter,
  restaurant: restaurantRouter,
  digitalMenu: digitalMenuRouter,
  photoMenu: photoMenuRouter,
});
```

### API Procedures by Domain

#### Authentication (`auth.mts`)

**login**
- Input: `{ mobile_number: string }`
- Purpose: Authenticate existing users by mobile number
- Returns: User data + associated restaurants
- Error: Throws if user not registered

**logout**
- Purpose: Simple logout procedure
- Returns: Success message
- Note: Session clearing handled client-side

**me**
- Input: `{ user_id: number }`
- Purpose: Get current user session info
- Returns: User data + restaurants

#### User Management (`user.mts`)

**create**
- Input: `{ mobile_number: string }`
- Purpose: Create new user (with duplicate prevention)
- Returns: User data + `isExisting` flag

**getByMobile** / **getById**
- Purpose: Fetch user by mobile number or ID
- Returns: User data or null

#### Restaurant Management (`restaurant.mts`)

**create**
- Input: Restaurant data + user_id + optional group_res_id
- Purpose: Create new restaurant with theme support
- Validation: Verifies user exists, validates group ownership

**getByUser**
- Input: `{ user_id: number }`
- Purpose: Get all restaurants for a user (with chain info)
- Returns: Restaurant array with chain details

**update**
- Input: Restaurant ID + partial update data
- Purpose: Update restaurant information
- Support: Theme updates, chain assignments

**updateTheme**
- Input: `{ id: number, theme_id: "minimal" | "modern" }`
- Purpose: Dedicated theme update with extensive logging
- Validation: Checks restaurant exists and is active

#### QR Code Management (`qr.mts`)

**generate**
- Input: Restaurant ID + setup type + optional assisted data
- Purpose: Generate unique QR codes for digital menus
- Features: Self-serve vs assisted setup, expiration handling

**getByRestaurant**
- Purpose: Get all QR codes for a restaurant
- Returns: QR code array with menu URLs

**updateStatus** / **activate**
- Purpose: Manage QR code lifecycle (available → used → expired)

**getQrData**
- Input: `{ qr_code: string }`
- Purpose: Public endpoint for QR code validation
- Returns: QR status, restaurant info, activation requirements

**getMenuByQr**
- Input: `{ qr_code: string }`
- Purpose: Public endpoint for customer menu viewing
- Returns: Complete menu structure with categories, items, variants, addons

#### Chain Management (`chain.mts`)

**create**
- Input: `{ name: string, description?: string, user_id: number }`
- Purpose: Create restaurant chain (group_res with type='chain')

**getByUser** / **getById**
- Purpose: Fetch chains for user or by ID
- Filter: Only active chains with type='chain'

**update** / **delete**
- Purpose: Manage chain lifecycle
- Validation: Prevents deletion if chain has active restaurants

**getWithRestaurants**
- Purpose: Get chains with associated restaurants
- Returns: Hierarchical chain → restaurants structure

#### Menu Management (`menu.mts`, `menu-core.mts`, `menu-bulk-import.mts`)

**Digital Menu Operations:**
- Complete menu retrieval with categories/items/variants/addons
- Bulk JSON import functionality
- Menu export capabilities

**Categories (`categories.mts`)**
- CRUD operations for menu categories
- Sort order management

**Items (`items.mts`)**
- CRUD operations for menu items
- Variant and addon association

### File Storage System

**Storage Abstraction** (`apps/server/src/storage/`)
- `StorageFactory.mts` - Factory pattern for storage providers
- `LocalStorageProvider.mts` - Local filesystem storage
- `R2StorageProvider.mts` - Cloudflare R2 cloud storage
- Environment-based provider selection

**File Upload** (`apps/server/src/middleware/upload.mts`)
- Multer configuration for multipart uploads
- File type validation and size limits
- Integration with storage providers

---

## Frontend Architecture

### Application Structure

**Entry Point** (`apps/platform/src/main.tsx` → `App.tsx`)
```typescript
<trpc.Provider client={trpcClient} queryClient={queryClient}>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RestaurantProvider>
        <Router />
      </RestaurantProvider>
    </AuthProvider>
  </QueryClientProvider>
</trpc.Provider>
```

### Context Providers

#### AuthContext (`contexts/AuthContext.tsx`)

**State Management:**
- User authentication state
- Restaurant list for authenticated user
- Chain management
- LocalStorage persistence

**Key Functions:**
- `login(mobile_number)` - Authenticate user
- `logout()` - Clear session
- `refreshSession()` - Sync with server
- `updateRestaurant()` - Local state updates
- `addRestaurant()` / `addChain()` - Add new entities
- `updateChain()` / `deleteChain()` - Chain management

#### RestaurantContext (`contexts/RestaurantContext.tsx`)

**Purpose:** Legacy context for restaurant selection
**Note:** Partially replaced by AuthContext functionality

### Routing Structure

**Public Routes:**
- `/` - Home page
- `/photo-menu` - Photo menu creation flow
- `/digital-menu` - Digital menu creation flow
- `/login` - User authentication
- `/about`, `/how-it-works`, `/contact` - Static pages
- `/menu/:qrCode` - Customer menu viewing (public)

**Protected Routes** (require authentication):
- `/dashboard` - Main dashboard
- `/dashboard/restaurant/:id/menu` - Digital menu manager
- `/dashboard/restaurant/:id/photomenu` - Photo menu manager

### Page Components

#### Photo Menu Flow (`pages/photomenu/`)

**PhotoMenu.tsx** - Main orchestrator component
**Components:**
- `UploadStep` - Image upload interface
- `SortStep` - Drag-and-drop image sorting
- `GenerateStep` - QR code generation
- `PhotoMenuPreview` - Customer preview

**Hooks:**
- `usePhotoMenuSteps.ts` - Step navigation logic

**Storage:**
- `utils/photoMenuStorage.ts` - LocalStorage persistence

#### Digital Menu Flow (`pages/digitalmenu/`)

**DigitalMenu.tsx** - Main digital menu interface
**Components:**
- `MenuBuilder` - Category/item management
- `ItemEditor` - Item creation/editing with variants/addons
- `QRGenerator` - QR code generation for digital menus

#### Customer Menu Viewing (`pages/menu/`)

**MenuHandler.tsx** - Route handler for QR code resolution
- Determines menu type (photo vs digital)
- Routes to appropriate theme component
- Handles QR code validation and activation

**Theme Components:**
- `CustomerMenuViewer.tsx` - Minimal theme implementation
- `CustomerMenuViewerModern.tsx` - Modern theme with rich visuals
- `PhotoMenuViewer.tsx` - Photo menu display

**Utility Components:**
- `LoadingScreen`, `ErrorScreen`, `ExpiredScreen`, `ActivationScreen`

#### Dashboard (`pages/dashboard/`)

**Dashboard.tsx** - Main user dashboard
- Restaurant list with chain grouping
- Quick actions for menu management
- Chain management interface

**RestaurantMenuManager.tsx** - Digital menu management
**RestaurantPhotoMenuManager.tsx** - Photo menu management

### Theme System

#### Implementation

**Database Storage:**
- `restaurant.theme_id` column (default: "minimal")
- Supported themes: "minimal", "modern"

**Backend Integration:**
- Theme included in all restaurant API responses
- Dedicated `updateTheme` procedure with validation

**Frontend Routing:**
- `MenuHandler` determines theme from QR data
- Routes to appropriate theme component

#### Theme Designs

**Minimal Theme** (`CustomerMenuViewer.tsx`)
- Clean, elegant design with subtle colors
- Slate/gray color palette
- Simple typography and layout
- Minimal visual elements

**Modern Theme** (`CustomerMenuViewerModern.tsx`)
- Bold, vibrant design with dynamic gradients
- Blue/purple/indigo color palette
- Glassmorphism effects with backdrop blur
- Rich visual elements and animations

### Component Architecture

#### UI Components (`components/ui/`)
- Radix UI-based primitive components
- `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, etc.
- Consistent styling with Tailwind CSS

#### Feature Components (`components/`)
- `ThemeSelector.tsx` - Admin theme selection interface
- `ThemePreview.tsx` - Live theme preview
- `QRCodeDisplay.tsx` - QR code rendering
- `Hello.tsx` - tRPC connection testing

#### Authentication (`components/auth/`)
- `ProtectedRoute.tsx` - Route protection wrapper

---

## Data Flow Architecture

### Authentication Flow

1. **User Registration/Login:**
   ```
   Frontend (Login) → tRPC auth.login → Database lookup → 
   Response (User + Restaurants) → AuthContext → LocalStorage
   ```

2. **Session Management:**
   ```
   App Initialization → LocalStorage check → AuthContext hydration →
   Optional server verification (refreshSession)
   ```

### Menu Creation Flow

#### Photo Menu
1. **Upload:** Images → File storage (Local/R2)
2. **Sort:** Drag-and-drop reordering → LocalStorage
3. **Generate:** Restaurant creation → QR code generation → Database
4. **View:** QR scan → PhotoMenuViewer → Image display

#### Digital Menu
1. **Setup:** Restaurant creation → User association
2. **Build:** Categories → Items → Variants → Addons → Database
3. **Generate:** QR code creation → Database binding
4. **View:** QR scan → Theme routing → MenuViewer → Data fetching

### Customer Experience Flow

```
QR Code Scan → MenuHandler → QR validation → Theme determination →
Data fetching → Component rendering → Interactive menu
```

**QR Code Resolution:**
1. Extract QR code from URL parameter
2. Determine menu type (photo vs digital)
3. Validate QR code status and expiration
4. Handle activation if required
5. Route to appropriate theme component
6. Fetch and display menu data

### Theme Switching Flow

```
Admin Interface → ThemeSelector → tRPC updateTheme → Database update →
Cache invalidation → Customer experience updates
```

---

## Storage and File Management

### File Storage Strategy

**Development:** Local filesystem storage
**Production:** Cloudflare R2 (S3-compatible)

**Configuration:**
```typescript
// Environment-based storage provider selection
const storageProvider = process.env.NODE_ENV === 'production' 
  ? new R2StorageProvider() 
  : new LocalStorageProvider();
```

**File Organization:**
- Photo menus: `/photo-menus/{restaurantId}/`
- Other uploads: `/uploads/{category}/`

### Data Persistence

**Frontend State:**
- AuthContext → LocalStorage for session persistence
- PhotoMenu workflow → LocalStorage for draft persistence
- Theme selection → Optimistic updates with server sync

**Backend Database:**
- PostgreSQL with Kysely ORM
- Transaction support for complex operations
- Foreign key constraints for data integrity

---

## API Integration Patterns

### tRPC Implementation

**Type Safety:** Full TypeScript integration from database to frontend
**Error Handling:** Consistent error boundaries and user feedback
**Caching:** TanStack Query integration with smart invalidation
**Optimistic Updates:** Immediate UI feedback with rollback support

### Query Patterns

**Data Fetching:**
```typescript
const { data, isLoading, error } = trpc.restaurant.getByUser.useQuery({
  user_id: user.id
});
```

**Mutations:**
```typescript
const updateTheme = trpc.restaurant.updateTheme.useMutation({
  onSuccess: () => {
    queryClient.invalidateQueries(['restaurant']);
  }
});
```

**Conditional Queries:**
```typescript
const { data } = trpc.menu.getByQr.useQuery(
  { qr_code: qrCode },
  { enabled: !!qrCode }
);
```

---

## Security and Validation

### Input Validation

**Backend:** Zod schemas for all tRPC procedures
**Frontend:** Form validation with error messaging
**Database:** Foreign key constraints and data type enforcement

### Authentication Strategy

**Current:** Mobile number-based authentication
**Session:** Client-side token management via LocalStorage
**Future:** Consider JWT tokens for enhanced security

### Data Protection

**File Uploads:** Type and size validation
**SQL Injection:** Kysely ORM parameterized queries
**XSS Protection:** React's built-in escaping

---

## Deployment Architecture

### Backend Deployment

**Docker Support:** 
- `apps/server/Dockerfile`
- `docker-compose.yml` for local development
- Production deployment scripts

**Environment Configuration:**
- Database connection strings
- Storage provider credentials
- CORS origins configuration

### Frontend Deployment

**Build Process:** Vite production builds
**Environment Variables:** 
- `VITE_BACKEND_URL` for API endpoint configuration
- Build-time variable injection

---

## Menu Item Image System

### Overview

The menu item image system provides comprehensive support for uploading, storing, and displaying images for individual menu items across both dashboard management and customer-facing menus. The implementation follows the same reliable patterns as the photomenu system while handling the additional complexity of digital menu features.

### Architecture

#### Database Schema
- **Migration 013**: Added `image_url` column to `item` table
- **Field Type**: `varchar(500)` nullable
- **Storage Location**: Cloudflare R2 storage in `menuitem/` folder

#### Backend Implementation

**File Upload Endpoint** (`apps/server/src/restroutes/files.mts`)
- **Endpoint**: `/api/upload/menuitem/single`
- **Method**: POST with multipart form data
- **Validation**: File type (JPEG, PNG, WebP) and size (5MB max)
- **Storage**: Cloudflare R2 with unique filename generation
- **Response**: File URL and metadata

**tRPC Procedures** (`apps/server/src/trpc/procedures/items.mts`)
- `updateImage`: Dedicated procedure for immediate image persistence
- `update`: General item update including image_url field
- Integration with bulk import operations

**Bulk Import Support** (`apps/server/src/trpc/procedures/menu-bulk-import.mts`)
- Full support for `image_url` field in bulk operations
- Automatic image downloading and re-uploading when needed
- Preserves existing images during menu replacements

#### Frontend Implementation

**ItemEditor Component** (`apps/platform/src/pages/digitalmenu/ItemEditor.tsx`)
- **Upload Interface**: Drag-and-drop with file validation
- **Smart Persistence**: 
  - Existing items: Immediate database persistence via tRPC
  - New items: Local storage until item creation
- **State Synchronization**: Local state updated after successful persistence
- **Error Handling**: Clear feedback and retry mechanisms

**MenuBuilder Integration** (`apps/platform/src/pages/digitalmenu/MenuBuilder.tsx`)
- **Individual Save**: Preserves image URLs in item update operations
- **Batch Operations**: Simplified logic with separate image handling
- **UI Refresh**: Real-time updates when images are persisted

**Restaurant Menu Manager** (`apps/platform/src/pages/dashboard/RestaurantMenuManager.tsx`)
- **Top-level Save**: Includes image URLs in bulk save operations
- **Menu Persistence**: Preserves images across all save scenarios
- **Debug Logging**: Comprehensive logging for troubleshooting

#### Customer Display

**Theme Integration**
- **Minimal Theme** (`CustomerMenuViewer.tsx`): Clean layout with responsive image display
- **Modern Theme** (`CustomerMenuViewerModern.tsx`): Rich visual design with image support
- **Responsive Design**: Mobile-optimized layouts with proper image scaling
- **Error Handling**: Graceful fallback when images fail to load

### Data Flow

#### Upload and Persistence Flow
1. **File Upload**: User selects image → Validation → R2 storage
2. **Immediate Persistence**: For existing items, tRPC `updateImage` called immediately
3. **State Sync**: Local component state updated with persisted image URL
4. **Save Operations**: Both individual and bulk saves preserve image URLs
5. **Customer Display**: Images rendered in responsive layouts

#### Error Recovery
- **Upload Failures**: Clear error messages with retry options
- **Database Failures**: Automatic rollback of uploaded files
- **Display Failures**: Graceful image hiding with preserved layout

### Key Features

#### Upload Experience
- **Drag-and-Drop Interface**: Intuitive file selection
- **Real-time Validation**: Immediate feedback on file type and size
- **Progress Indicators**: Visual feedback during upload operations
- **Preview Support**: Immediate preview of uploaded images

#### Persistence Reliability
- **Atomic Operations**: Images are either fully saved or not saved at all
- **State Synchronization**: Local state always matches database state
- **Multiple Save Paths**: Support for both individual and bulk save operations
- **Rollback Mechanisms**: Automatic cleanup of failed operations

#### Display Optimization
- **Responsive Layouts**: Optimized for mobile and desktop viewing
- **Lazy Loading**: Performance optimization for large menus
- **Error Handling**: Graceful degradation when images are unavailable
- **SEO Support**: Proper alt text and image optimization

### Implementation Patterns

#### Atomic Upload Pattern
```typescript
// Step 1: Upload to storage
const response = await fetch('/api/upload/menuitem/single', {...});
const imageUrl = result.file.url;

// Step 2: Update local state
handleBasicInfoChange('image_url', imageUrl);

// Step 3: For existing items, persist immediately
if (isExistingItem) {
  await updateItemImageMutation.mutateAsync({
    id: parseInt(item.id, 10),
    image_url: imageUrl,
  });
}
```

#### State Synchronization Pattern
```typescript
const updateItemImageMutation = trpc.digitalMenu.items.updateImage.useMutation({
  onSuccess: (updatedItem) => {
    // Critical: Update local state to match database
    setFormData(prev => ({
      ...prev,
      image_url: updatedItem.image_url
    }));
  }
});
```

#### Bulk Save Integration
```typescript
const menuData = {
  items: menu.items.map(item => ({
    name: item.name,
    price: item.price,
    description: item.description,
    image_url: item.image_url, // Critical: Include in bulk operations
    // ... other fields
  }))
};
```

### Performance Considerations

- **Storage Optimization**: Efficient file naming and organization in R2
- **Upload Optimization**: Direct browser-to-R2 uploads (planned)
- **Display Optimization**: Lazy loading and responsive images
- **Cache Strategy**: Proper cache invalidation after updates

### Security Features

- **File Validation**: Strict file type and size restrictions
- **Upload Limits**: Configurable size limits (5MB default)
- **Access Control**: Authenticated uploads only
- **Malware Protection**: File type validation and content scanning

---

## Current Limitations and Technical Debt

1. **Authentication:** Simple mobile-based auth without proper session tokens
2. **File Storage:** Mixed localStorage/server storage for photo menus
3. **Error Handling:** Inconsistent error boundaries across components
4. **Testing:** Limited test coverage
5. **Performance:** No lazy loading for large menus
6. **Mobile Optimization:** Some components need mobile-first design
7. **Chain/Food Court:** Food court functionality partially implemented

---

## Future Enhancements

### Planned Features

1. **Food Court Support:**
   - Multi-restaurant QR codes
   - Shared customer interface
   - Restaurant approval workflows

2. **Enhanced Authentication:**
   - JWT token-based sessions
   - Multi-factor authentication
   - Role-based access control

3. **Advanced Menu Features:**
   - ✅ Image support for menu items (IMPLEMENTED)
   - Nutritional information
   - Dietary restriction filters
   - Multi-language support

4. **Analytics Dashboard:**
   - QR code scan tracking
   - Popular item analytics
   - Customer engagement metrics

### Technical Improvements

1. **Performance Optimization:**
   - Code splitting
   - Image optimization
   - Menu item virtualization

2. **Testing Strategy:**
   - Unit tests for utilities
   - Integration tests for API endpoints
   - E2E tests for critical user flows

3. **Developer Experience:**
   - API documentation generation
   - Development seed data
   - Improved debugging tools

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm package manager

### Local Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev  # Starts both frontend and backend

# Database setup
cd apps/server
pnpm migrate  # Run database migrations
```

### Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/qrunchy
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
R2_* variables for production storage
```

**Frontend (.env):**
```
VITE_BACKEND_URL=http://localhost:3000
```

### Project Scripts

**Root level:**
- `pnpm dev` - Start all applications
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting

**Backend specific:**
- `pnpm migrate` - Run database migrations
- `pnpm migrate:down` - Rollback migrations

This documentation provides a comprehensive overview of the Qrunchy digital menu platform. The system is well-architected with clear separation of concerns, type safety throughout the stack, and support for both simple photo menus and advanced digital menus with theming capabilities.