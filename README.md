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
I want you to deep dive into whole codebase. it's a turbo monorepo architecture codebase. where there

    are two apps inside apps folder. one is server which is basically the backend and another is
  platform,
    which is basically the frontend. so, the brief of the project is , it's qrunchy. where restaurant
  owner can create their menu instead of paper menu. now, we are keeping two flow. one is to build
  photomenu, where they just need to take photo, upload, sort photo, generate qr, then boom. it will be
   ready. that flow is in the platform –> src –> pages –> photoMenu. it's just frontend ui. then, there
   are also digitalmenu inside pages folder, which is basically manual menu creation flow for better
  UI. user will put their menu information – category, item, variants, addons, etc . then it will
  generate better ui than the photomenu.   –––– there are also other ui stuff in the platform. the ui
  is almost done. there are some integration with backend server. ––– to understand things better, i
  want you to start analyzing with server code. there are migrations file. go through each of the
  migrations file, so you understand the data model. the migrations file are inside server –> src –> db
   –> migrations. then we have implemented the backend part for the digitalMenu(manual menu information
   input) creation flow. In server's src –> trpc –> routers –> index has router of digitalMenu. inside
  digital menu router, there are routes for categories, items, menu and qr. go through in depth into
  each of them. You will get the detail implementation of the procedures inside procedures folder. the
  backend, which are implemented so far, are already tested. so you don't need to test any server code.
   i just want you to understand the whole thing really very much in depth so that we can proceed
  further. start with server code. we won't change anything in server right now. then dive into the
  platform again. Deep dive into platform –>src–> pages –> digitalMenu –> all file.there are some api
  implementations. i want you to understand all very deeply. From each angle. Then we will start coding
   further.
```
