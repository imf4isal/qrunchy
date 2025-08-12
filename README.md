# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
  –––––––––

```
Our project is a turbo monorepo architecture codebase. where there are two apps inside apps folder. one is server which is basically the backend and another is platform, which is basically the frontend. so, the brief of the project is , it's qrunchy. where restaurant owner can create their menu instead of paper menu. now, we are keeping two flow.

One is to build photomenu, where user just need to take photos of their menu, upload, sort photo, generate qr, then boom. it will be
ready. that flow is in the platform –> src –> pages –> photoMenu.

Then, there are also digitalmenu inside pages folder, which is basically manual menu creation flow for better UI for custoemr. User will put their menu information – category, item, variants, addons, etc .
Then it will generate better ui than the photomenu.   –––– there are also other ui stuff in the platform.
Currently, at the first step, the user put the restaurant information, then continue - two options, user can bulk upload json menu data, it will automatically take all from formatted json. Or, user can put menu data manually. Categories, Items, variants, addons etc etc. The UI of this flow is kinda done. And most of the critical API has been implemented..

And in our project, inside apps/server, there are server side code. inside src/db, you will find migrations file for our database. and one queries for digitalmenu.
Inside src/trpc folder, there are procedures and router. we have implemented all necessary procedures and routes for the digital manual creation and viewing part.

There are theme functionality to viewing the menu. also, there are group functionality too. I mean, one user can create group with his multiple menus.



 Oh, here is the initial data model of the project's database(dbdiagram format). There are some additional changes in the DB model.

```

Table user {
id int [pk, increment]
mobile_number varchar [unique]
created_at timestamp
updated_at timestamp
}

Table group_res {
id int [pk, increment]
name varchar
mobile varchar [null]
address text
geolocation point
description text [null]
user_id int [ref: > user.id]
created_at timestamp
updated_at timestamp
is_active boolean [default: true]
}

Table restaurant {
id int [pk, increment]
name varchar
mobile varchar
address text [null]
geolocation point
group_res_id int [ref: > group_res.id, null]
user_id int [ref: > user.id]
created_at timestamp
updated_at timestamp
is_active boolean [default: true]
}

Table qr_code {
id int [pk, increment]
code varchar [unique]
type enum('photo', 'digital')
status enum('available', 'used', 'expired')
restaurant_id int [ref: > restaurant.id, null]
created_at timestamp
bound_at timestamp [null]
expires_at timestamp [null]
self_serve boolean [default: false]
}

Table photo_menu {
id int [pk, increment]
restaurant_id int [ref: > restaurant.id]
image_url varchar
sort_order int
created_at timestamp
updated_at timestamp
}

Table category {
id int [pk, increment]
restaurant_id int [ref: > restaurant.id]
name varchar
sort_order int
}

Table item {
id int [pk, increment]
name varchar
price decimal(10,2)
description text [null]
category_id int [ref: > category.id]
sort_order int
}

Table variant {
id int [pk, increment]
name varchar
item_id int [ref: > item.id]

note: "Contains all multi variant information. e.g. size, spice level"
}

Table variant_option {
id int [pk, increment]
item_variant_id int [ref: > variant.id]
name varchar // e.g. large
price decimal(10,2)
}

Table addon {
id int [pk, increment]
item_id int [ref: > item.id]
name varchar
price decimal(10,2)
}

```




-- Some Information about theme.

## Theme

Qrunchy Turbo Monorepo - Project Structure and Theme Implementation │ │
│ │ Overview │ │
│ │ │ │
│ │ Project Structure │ │
│ │ │ │
│ │ This is a Turbo monorepo with the following structure: │ │
│ │ │ │
│ │ Apps │ │
│ │ │ │
│ │ - apps/platform/ - Frontend React application (Vite + TypeScript) │ │
│ │ - apps/server/ - Backend Node.js API server (TypeScript + tRPC + │ │
│ │ Kysely) │ │
│ │ │ │
│ │ Key Technologies │ │
│ │ │ │
│ │ - Frontend: React, TypeScript, Vite, Tailwind CSS, tRPC client │ │
│ │ - Backend: Node.js, TypeScript, tRPC, Kysely ORM, PostgreSQL │ │
│ │ - Build: Turbo for monorepo management │ │
│ │ │ │
│ │ Theme Implementation Deep Dive │ │
│ │ │ │
│ │ 1. Database Schema (Backend) │ │
│ │ │ │
│ │ Theme Storage: │ │
│ │ - apps/server/src/db/migrations/011_add_theme_to_restaurants.mts │ │
│ │ - Adds theme_id column to restaurant table │ │
│ │ - Default value: "minimal" │ │
│ │ - Supports two themes: "minimal" and "modern" │ │
│ │ │ │
│ │ Restaurant Table Structure: │ │
│ │ restaurant ( │ │
│ │ id: serial, │ │
│ │ name: varchar, │ │
│ │ mobile: varchar, │ │
│ │ address: text, │ │
│ │ theme_id: varchar DEFAULT 'minimal', -- Added in migration 011 │ │
│ │ user_id: integer, │ │
│ │ created_at: timestamp, │ │
│ │ updated_at: timestamp, │ │
│ │ is_active: boolean │ │
│ │ ) │ │
│ │ │ │
│ │ 2. Backend API (tRPC Procedures) │ │
│ │ │ │
│ │ Theme Management: │ │
│ │ - apps/server/src/trpc/procedures/restaurant.mts │ │
│ │ - updateTheme procedure: Updates restaurant theme with validation │ │
│ │ - Supports "minimal" and "modern" themes │ │
│ │ - Includes extensive logging and error handling │ │
│ │ │ │
│ │ QR Code Integration: │ │
│ │ - apps/server/src/trpc/procedures/qr.mts │ │
│ │ - getMenuByQr procedure: Fetches menu data with restaurant theme │ │
│ │ - getQrData procedure: Returns QR code data including theme info │ │
│ │ - Theme is included in restaurant data returned to frontend │ │
│ │ │ │
│ │ 3. Frontend Components │ │
│ │ │ │
│ │ Theme Selection: │ │
│ │ - apps/platform/src/components/ThemeSelector.tsx │ │
│ │ - Admin component for selecting restaurant themes │ │
│ │ - Shows theme previews and handles theme switching │ │
│ │ - Integrates with tRPC updateTheme mutation │ │
│ │ - Optimistic UI updates with error handling │ │
│ │ │ │
│ │ Theme Preview: │ │
│ │ - apps/platform/src/components/ThemePreview.tsx │ │
│ │ - Shows real-time preview of how menu looks in selected theme │ │
│ │ - Supports both minimal and modern themes │ │
│ │ - Used in menu builder for live preview │ │
│ │ │ │
│ │ Customer-Facing Theme Components: │ │
│ │ - apps/platform/src/pages/menu/theme/CustomerMenuViewer.tsx - Minimal │ │
│ │ theme implementation │ │
│ │ - apps/platform/src/pages/menu/theme/CustomerMenuViewerModern.tsx - │ │
│ │ Modern theme implementation │ │
│ │ │ │
│ │ 4. Theme Designs │ │
│ │ │ │
│ │ Minimal Theme: │ │
│ │ - Clean, elegant design with subtle colors │ │
│ │ - Slate/gray color palette │ │
│ │ - Simple layout with clear typography │ │
│ │ - Minimal visual elements │ │
│ │ │ │
│ │ Modern Theme: │ │
│ │ - Bold, vibrant design with dynamic gradients │ │
│ │ - Blue/purple/indigo color palette │ │
│ │ - Glassmorphism effects with backdrop blur │ │
│ │ - Rich visual elements and animations │ │
│ │ - Enhanced customer experience with interactive elements │ │
│ │ │ │
│ │ 5. Data Flow │ │
│ │ │ │
│ │ Restaurant Admin -> ThemeSelector -> tRPC updateTheme -> Database │ │
│ │ ↓ │ │
│ │ Customer QR Scan -> MenuViewer -> tRPC getMenuByQr -> Theme-specific │ │
│ │ component │ │
│ │ │ │
│ │ 6. Key Features │ │
│ │ │ │
│ │ Theme Switching: │ │
│ │ - Real-time theme updates │ │
│ │ - Optimistic UI with rollback on error │ │
│ │ - Cache invalidation for immediate updates │ │
│ │ - Mobile-responsive design for both themes │ │
│ │ │ │
│ │ QR Code Integration: │ │
│ │ - Theme information included in QR data │ │
│ │ - Automatic theme application when customers scan QR codes │ │
│ │ - Support for both self-serve and assisted setup │ │
│ │ │ │
│ │ Data Management: │ │
│ │ - Theme stored at restaurant level │ │
│ │ - Default theme: "minimal" │ │
│ │ - Type-safe theme validation │ │
│ │ - Comprehensive error handling │ │
│ │ │ │
│ │ Implementation Quality │ │
│ │ │ │
│ │ The theme system is well-architected with: │ │
│ │ - Separation of concerns: Theme logic separated from business logic │ │
│ │ - Type safety: Full TypeScript implementation with proper schemas │ │
│ │ - Error handling: Comprehensive error states and user feedback │ │
│ │ - Performance: Optimistic updates and proper caching │ │
│ │ - Mobile responsiveness: Both themes work well on mobile devices │ │
│ │ - Extensibility: Easy to add new themes following the same pattern │ │
│ │

---

also, here are some Analysis of Current Architecture, which might help you.


Current Structure:

- group_res table: id, name, mobile, address, geolocation, description,
  user_id, created_at, updated_at, is_active
- restaurant table: includes group_res_id (nullable foreign key)
- qr_code table: linked to restaurant_id only

Feature Requirements Analysis

1. Restaurant Chains (Management Only)

- Purpose: Dashboard organization for restaurant owners with multiple
  outlets
- User Experience: No customer-facing changes, each restaurant keeps
  individual QR codes
- Current Support: ✅ Already supported with existing group_res table
  and group_res_id

2. Food Courts (Customer Experience) - not yet implemented(maybe)

- Purpose: Single QR code showing multiple restaurants to customers
- User Experience: Scan QR → See restaurant grid/list → Select
  restaurant → View menu
- Current Support: ❌ Needs architecture extension
  ⎿ User rejected Claude's plan:
  ╭──────────────────────────────────────────────────────────────────╮
  │ Implementation Plan for Restaurant Chains & Food Courts │
  │ │
  │ Phase 1: Database Schema Updates │
  │ │
  │ 1. Extend group_res table: │
  │ - Add type enum column: 'chain' | 'foodcourt' │
  │ - Remove redundant mobile and address columns (as you suggested) │
  │ - Add logo_url for food court branding │
  │ │
  │ 2. Extend qr_code table: │
  │ - Add group_res_id column (nullable) │
  │ - Modify to allow QR codes linked to either restaurant_id OR │
  │ group_res_id │
  │ - Add constraint ensuring only one is set │
  │ │
  │ 3. Create foodcourt_restaurants junction table: │
  │ - For food court managers to add restaurants to their food court │
  │ - Include approval status for restaurant owners │
  │ │
  │ Phase 2: Backend API Development │
  │ │
  │ 1. Extend tRPC routers: │
  │ - foodcourt router: create, manage, add/remove restaurants │
  │ - restaurant router: approve/reject food court invitations │
  │ - qr router: generate food court QR codes │
  │ - menu router: handle food court menu viewing │
  │ │
  │ 2. Update existing endpoints: │
  │ - Modify restaurant listing to support grouping │
  │ - Update QR code resolution logic │
  │ │
  │ Phase 3: Frontend Implementation │
  │ │
  │ 1. Dashboard enhancements: │
  │ - Restaurant chains: grouping UI in dashboard │
  │ - Food courts: creation and management interface │
  │ - Restaurant search and invitation system │
  │ │
  │ 2. Customer menu viewing: │
  │ - Food court grid/list view │
  │ - Individual restaurant menu navigation │
  │ - Breadcrumb navigation │
  │ │
  │ 3. QR code generation: │
  │ - Support both restaurant and food court QR codes │
  │ │
  │ Phase 4: Testing & Deployment │
  │ │
  │ 1. Database migrations │
  │ 2. API testing │
  │ 3. Frontend integration │
  │ 4. E2E testing │
  │ │
  │ Key Benefits: │
  │ - Reuses existing architecture │
  │ - Minimal breaking changes │
  │ - Supports both use cases elegantly │
  │ - Maintains type safety throughout


----



Analyze the whole project very briefly, so that you understand well what's going on, and we can proceed further. Understands everything very in depth. No rush. Run a thorough analysis. I want you to analyze every file, each line of code, every connection, how all the components and files have been connected together, how data is flowing, what actions are available right now, etc etc.

After run a thorough Analysis and investigation, I want you to write a proper documentation about the project, so that - from next time, after reading the documentation - anyone can understands what's going on, which file is doing what, updated whole data model, all the procedures brief, everything, whether it's human or llm. You can create Documentation.md file for that. Okay, start. Again, reminder, nothing should be missed.
```
