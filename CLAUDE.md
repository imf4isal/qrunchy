# Qrunchy Platform 
## Project Overview & End Goal

**Qrunchy** is a comprehensive QR code-based digital menu platform that revolutionizes how restaurants serve customers. The platform eliminates traditional paper menus by enabling restaurants to create QR code menus that customers scan to view digital menus on their phones.

### Core Features of the Platform
- Individual restaurants with photo and digital menus - two type of menus.
- Restaurant chains with centralized management.
- Food courts with global search across all vendors(restaurants inside food courts).
- Restaurant owner can see various analytics about their customer.
- Customer can get super user friendly view of the restaurant menu.

The first goal is solidify these features.

### End Vision & Ecosystem Orchestration
- **Core Mission**: Replace all paper menus with QR code digital alternatives with super smooth user experience.
- **Ecosystem Goal**: Though it's a single platform, where right now we are having this feature - scan QR code to view digital menu. But, down the line, we wanna broad our echosystem. Things like:
- People can search for food item, and can see, where they can get that food item, which restaurant is serving that food item, where it's better.
- Right now, it is using too see the menu of the restaurant, but it's possible to integrate the same system with other areas like - shops, super shops/market etc. It can be connected with inventory.
- People will be able to order food from the table of the restaurant without calling waiter or from home. The experience will be similar, consistent and smooth. May be we can come up with kiosk solution as well.
- As well as other echosystems product - like food order, erp, inventory management, etc.


### Business Model Evolution
1. **Phase 1**: Individual restaurant QR menus (✅ Complete)
2. **Phase 2**: Restaurant chain management (✅ Complete) 
3. **Phase 3**: Food court ecosystems with global search (✅ Complete)
4. **Phase 4**: Platform-wide restaurant discovery (Future)

---

## Quick Start Commands

### Development
```bash
# Start development environment
pnpm dev

# Start with Docker (recommended)
docker-compose up

# Database operations
cd apps/server && pnpm migrate
cd apps/server && pnpm migrate:down

# Build for production
pnpm build

# Linting and type checking
pnpm lint
pnpm check-types
```

### Testing
```bash
# E2E tests with Playwright
pnpm test:e2e
pnpm test:e2e:ui          # With UI
pnpm test:e2e:debug       # Debug mode
pnpm test:e2e:headed      # Headed browser
```

### Critical URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432
- **tRPC Playground**: http://localhost:3000/trpc-playground

---

## Tech Stack & Architecture

### Frontend Stack
- **React 19.1.0** with TypeScript for UI components
- **Vite** for blazing fast development and building
- **Wouter** for lightweight client-side routing
- **tRPC 11.1.2** for end-to-end type-safe API communication
- **TanStack Query** for server state management with optimistic updates
- **Tailwind CSS 4.x** with **Radix UI** for accessible component primitives
- **Framer Motion** for animations and interactions

### Backend Stack  
- **Node.js** with TypeScript (ESM modules)
- **Express.js** server with **tRPC** integration
- **Kysely ORM** with **PostgreSQL 15** for type-safe database queries
- **Cloudflare R2** for scalable file storage
- **SMS Orbis** for OTP delivery system
- **Zod** for runtime input validation

### Infrastructure
- **Turbo monorepo** for efficient multi-package development
- **Docker** with PostgreSQL for local development
- **pnpm** for fast package management
- **Playwright** for comprehensive E2E testing

### Monorepo Structure
```
qrunchy/
├── apps/
│   ├── platform/          # React frontend (Vite + TypeScript)
│   └── server/             # Node.js backend (Express + tRPC)
├── shared/                 # Shared TypeScript types
├── log/                    # Comprehensive project documentation
├── e2e/                    # Playwright end-to-end tests
└── docker-compose.yaml     # Development environment setup
```

---

## Key Architectural Patterns

### Frontend Patterns
- **tRPC Integration**: End-to-end type safety between frontend and backend
- **Context API + Hooks**: Global state for authentication and restaurant selection
- **Optimistic Updates**: Immediate UI updates with error rollback
- **Multi-step Flows**: Photo menu and digital menu creation workflows
- **Theme System**: Customer-facing menu themes (minimal/modern/+other future theme options.)

### Backend Patterns  
- **Factory Pattern**: Storage provider abstraction (R2StorageProvider/LocalStorageProvider)
- **Repository Pattern**: Database access through Kysely queries
- **Middleware Pipeline**: Express middleware with tRPC integration
- **Input Validation**: Zod schemas for all API endpoints
- **File Upload Strategy**: Separate REST endpoints for file operations

### Key Design Decisions
- **Type Safety First**: Full TypeScript coverage with strict configuration
- **Database Migration System**: Sequential numbered migrations with rollback support
- **Storage Abstraction**: Environment-based provider switching (local dev, R2 production)
- **Authentication**: Mobile-based OTP system with optional password login
- **QR Code Strategy**: Different QR types for photo/digital/food court menus

---

## Visual Development & UI Guide

### Design Principles
- Comprehensive design checklist in /context/design-principles.md
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance


### Quick Visual Check

* IMMEDIATELY after implementing any front-end change:
- Identify what changed - Review the modified components/pages
- Navigate to affected pages - Use mcp__playwright__browser_navigate to visit each changed view
- Verify design compliance - Compare against /context/design-principles.md and /context/style-guide.md 
- Validate feature implementation - Ensure the change fulfills the user's specific request 
- Check acceptance criteria - Review any provided context files or requirements 
- Capture evidence - Take full page screenshot at desktop viewport (1440px) of each changed view 
- Check for errors - Run mcp__playwright__browser_console_messages
This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the @agent-design-review subagent for thorough design validation when:

### Design System
- **Component Library**: Custom components built on Radix UI/ShadCN primitives
- **Styling**: Tailwind CSS with consistent design tokens
- **Typography**: System fonts with clear hierarchy
- **Color Palette**: Neutral grays with accent colors
- **Spacing**: Consistent 4px grid system

### UI Component Standards
```typescript
// Component file structure example
interface ComponentProps {
  title: string;
  onAction: (data: FormData) => void;
}

export function Component({ title, onAction }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState();
  const mutation = trpc.endpoint.useMutation();
  
  // Event handlers
  const handleAction = () => {
    // Implementation
  };
  
  // Render with accessibility
  return (
    <div className="space-y-4">
      {/* JSX with semantic HTML */}
    </div>
  );
}
```

### Theme Implementation
- **Customer Themes**: `minimal` and `modern` for menu viewing
- **Admin Interface**: Consistent dashboard design across all management screens
- **Mobile-First**: Responsive design for all customer-facing interfaces
- **Accessibility**: WCAG compliance with proper ARIA labels

---

## Git Commit Guidelines
- Please Follow/use conventional commit formatting for git commits.
- Please use conventional branch naming (prefix based branch naming convention).
- Please do not mention yourself (Claude) as a co-author when committing, or include any links to Claude Code.

### Commit Format
```
<type>: <description>

<optional body>
```

### Types
- `feat:` - New feature (e.g., "feat: add food court global search")
- `fix:` - Bug fix (e.g., "fix: photo menu upload validation")
- `refactor:` - Code refactoring (e.g., "refactor: extract menu builder components")
- `docs:` - Documentation (e.g., "docs: update API documentation")
- `test:` - Testing (e.g., "test: add E2E tests for digital menu flow")
- `chore:` - Maintenance (e.g., "chore: update dependencies")

### Examples from Project History
```bash
git commit -m "feat: add food court management with global search"
git commit -m "fix: user not authenticated(even though authenticated) issue"
git commit -m "refactor: update digital minimal theme ui"
```

### Branch Naming
- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes  
- `refactor/component-name` - Code improvements

---

## Guidance Memories
- Please ask for clarification upfront, upon the initial prompts, when you need more direction. 

## Claude Code Workflow Best Practices

### Essential Workflow: Explore → Plan → Execute

**NEVER jump straight to execution.** Always follow this pattern:

#### 1. Explore Phase
```
Prepare to work on [feature]. Read relevant files and understand how our [frontend/backend/database] works. Don't write any code yet.
```

#### 2. Plan Phase  
```
Think hard about implementing [feature]. Write function names and 1-3 sentences about what they do. Write test names in 5-10 words about behavior they cover. Focus on architecture, not implementation details.
```

#### 3. Execute Phase
```
Work on [specific part]. Think hard, write elegant code that completes this task. Run linting and type checking. Write corresponding tests. No backwards compatibility - delete old code instead of fallbacks.
```

### Advanced Techniques

#### Double Escape Method
- Use `Escape + Escape` to fork conversations and reuse good context
- Build context once, then branch to multiple execution paths
- Saves tokens and maintains quality context

#### Resume Method  
- Open new terminal tabs with `resume` to get same context
- Parallel work on different features with shared understanding
- Don't work on more than 2 tasks simultaneously

#### Context Window Management
- **Never use compact** - it creates degraded Claude performance, unless I'm explicitly telling.

#### Developer/Reviewer Pattern
```
# Build context with one Claude instance
Prepare to discuss how our authentication system works...

# Fork to execution Claude  
[Double escape] → Work on implementing OAuth integration...

# Fork to reviewer Claude
[Double escape] → My developer just implemented OAuth. Give low-level and high-level feedback.
```

---

## Code Style Guidelines

### TypeScript Standards
- **Strict mode enabled** - no `any` types
- **Interface over type** for object definitions
- **Zod schemas** for runtime validation
- **ESM imports** throughout codebase

### React Best Practices
- **Functional components** with hooks only
- **Props interfaces** for all components
- **Error boundaries** for robust UX
- **Optimistic updates** with TanStack Query

### Import Organization
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

### File Naming Conventions
- **kebab-case** for file names
- **PascalCase** for React components
- **camelCase** for utility functions
- **.test.ts** suffix for tests

---

## Database & API Patterns

### Database Operations
```typescript
// Type-safe Kysely queries
const restaurants = await db
  .selectFrom("restaurant")
  .selectAll()
  .where("user_id", "=", userId)
  .where("is_active", "=", true)
  .execute();
```

### tRPC Procedures
```typescript
// Input validation with Zod
const createRestaurantSchema = z.object({
  name: z.string().min(1).max(100),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  user_id: z.number().int().positive(),
});

export const createRestaurant = procedure
  .input(createRestaurantSchema)
  .mutation(async ({ input }) => {
    // Implementation with proper error handling
  });
```

### File Upload Strategy
- **REST endpoints** for file uploads (not tRPC)
- **Multer** for multipart handling
- **Storage abstraction** with environment-based providers
- **Image optimization** and validation

---

## Testing Strategy

### Current Testing Setup
- **E2E Testing**: Playwright for complete user workflows
- **Unit Testing**: Jest (recommended setup in documentation)
- **Integration Testing**: tRPC procedure testing

### Testing Commands
```bash
# E2E tests
pnpm test:e2e                    # Run all E2E tests
pnpm test:e2e:ui                 # Interactive UI mode
pnpm test:e2e:debug              # Debug failed tests

# Future unit testing
cd apps/platform && npm test     # Frontend tests
cd apps/server && npm test       # Backend tests
```

### Testing Patterns
```typescript
// E2E test example
test("Complete photo menu creation flow", async ({ page }) => {
  await page.goto("http://localhost:5173/photo-menu");
  
  // Upload images
  await page.setInputFiles('[data-testid="image-upload"]', [
    'e2e/fixtures/images/menu-page-1.jpg'
  ]);
  
  // Verify QR generation
  await page.click('[data-testid="generate-qr"]');
  await expect(page.locator('[data-testid="qr-code"]')).toBeVisible();
});
```

---

## Performance & Security

### Performance Considerations
- **Database indexing** on foreign keys and query columns
- **Image optimization** with Cloudflare R2
- **Code splitting** with Vite dynamic imports
- **Optimistic updates** for responsive UX

### Security Best Practices
- **Input validation** with Zod schemas
- **Rate limiting** on API endpoints
- **Password hashing** with bcrypt
- **JWT token** management
- **CORS configuration** for frontend communication
- **File upload validation** with type and size limits

### Environment Variables
```bash
# Required for development
DATABASE_URL=postgresql://user:pass@localhost:5432/qrunchy_db
JWT_SECRET=your-secret-key
R2_BUCKET_NAME=your-bucket
SMS_ORBIS_API_KEY=your-api-key
```

---

## Critical File References

### Core Components (Large files - refactoring candidates)
- **MenuBuilder**: `/apps/platform/src/pages/digitalmenu/MenuBuilder.tsx:1467` - Core menu editing (CRITICAL)
- **FoodCourtManager**: `/apps/platform/src/pages/dashboard/FoodCourtManager.tsx:750` - Food court admin interface
- **ItemEditor**: `/apps/platform/src/pages/digitalmenu/ItemEditor.tsx:617` - Menu item editing interface

### Authentication & Security
- **AuthContext**: `/apps/platform/src/contexts/AuthContext.tsx:350` - Frontend authentication state
- **Auth Procedures**: `/apps/server/src/trpc/procedures/auth.mts:535` - Backend authentication logic
- **Password Utils**: `/apps/server/src/utils/password.mts:93` - Secure password hashing

### Database & Backend
- **tRPC Router**: `/apps/server/src/trpc/index.mts:122` - Main tRPC setup
- **Digital Menu Queries**: `/apps/server/src/db/queries/digitalMenu.mts:350` - Menu database operations
- **Food Court Queries**: `/apps/server/src/db/queries/foodCourt.mts:316` - Food court database operations

### File Storage
- **Storage Factory**: `/apps/server/src/storage/StorageFactory.mts` - Storage abstraction
- **R2 Provider**: `/apps/server/src/storage/providers/R2StorageProvider.mts` - Cloudflare R2 integration

---

## Project Status & Next Steps

### Feature Completeness
- ✅ **Core Features**: Photo Menu, Digital Menu, QR Codes (100%)
- ✅ **Food Court System**: Global search, restaurant management (100%) 
- ✅ **Authentication**: OTP system, password login (95%)
- ✅ **File Management**: R2 + local storage abstraction (100%)

### Known Issues & Technical Debt
- **Large components** need refactoring (MenuBuilder: 1,467 lines)
- **Test coverage** needs improvement (unit tests missing)
- **TypeScript strict mode** compliance improvements needed
- **Performance optimization** for large food courts


### Immediate Priorities
1. **Refactor MenuBuilder** into smaller, focused components
2. **Add comprehensive unit tests** for critical business logic
3. **Implement performance monitoring** for customer-facing menus
4. **Enhance error handling** and user feedback systems

---

## Important Development Notes

### When Working on This Project

**ALWAYS run these commands after making changes:**
```bash
# Type checking
cd apps/platform && npx tsc --noEmit
cd apps/server && npx tsc --noEmit

# Linting  
cd apps/platform && npm run lint
```

**NEVER**:
- Skip database migrations when changing schema
- Commit without running type checks
- Use `any` types - always define proper interfaces
- Write backwards compatibility code - delete old code instead
- Work directly in production database

**ALWAYS**:
- Test QR code generation after menu changes
- Verify mobile responsiveness for customer-facing features
- Update documentation when changing APIs
- Use Claude Code workflow: Explore → Plan → Execute

### Claude Code Specific Tips
- Start with "Prepare to work on [feature]" to build context
- Use "Think hard" for complex architectural decisions
- Double escape to fork conversations and reuse context
- Use resume method for parallel development streams
- Never jump straight to code execution without planning