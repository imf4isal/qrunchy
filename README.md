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
I want you to deep dive into whole codebase. it's a turbo monorepo architecture codebase. where there are two apps inside apps folder. one is server which is basically the backend and another is platform, which is basically the frontend. so, the brief of the project is , it's qrunchy. where restaurant owner can create their menu instead of paper menu. now, we are keeping two flow.

One is to build photomenu, where user just need to take photos of their menuq, upload, sort photo, generate qr, then boom. it will be
ready. that flow is in the platform –> src –> pages –> photoMenu. it's just frontend ui. We have not implemented the backend for this part yet. It's just dummy.

Then, thereare also digitalmenu inside pages folder, which is basically manual menu creation flow for better UI for custoemr. User will put their menu information – category, item, variants, addons, etc .
Then it will generate better ui than the photomenu.   –––– there are also other ui stuff in the platform.
Currently, at the first step, the user put the restaurant information, then continue - two options, user can bulk upload json menu data, it will automatically take all from formatted json. Or, user can put menu data manually. Categories, Items, variants, addons etc etc. The UI of this flow is kinda done. And most of the critical API has been implemented.. Right now, we are creating the user at the last step of the flow.

 To understand things better, i want you to start analyzing with server code. there are migrations file. go through each of the
  migrations file, so you understand the data model. the migrations file are inside server –> src –> db–> migrations. then we have implemented the backend part for the digitalMenu(manual menu information input) creation flow. In server's src –> trpc –> routers –> index has router of digitalMenu. inside
  digital menu router, there are routes for categories, items, menu and qr. go through in depth into each of them. You will get the detail implementation of the procedures inside procedures folder. The backend, which are implemented so far, are already tested. so you don't need to test any server code.

I just want you to understand the whole thing really very much in depth so that we can proceed
  further. Oh, here is the data model of the project's database(dbdiagram format).

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

Start with server code. we won't change anything in server right now. Then dive into the platform again. Deep dive into platform –>src–> pages –> digitalMenu –> all file.there are some api
implementations. i want you to understand all very deeply. From each angle. Then we will start coding further. First, ensure that, everything is making sense to you.
```
