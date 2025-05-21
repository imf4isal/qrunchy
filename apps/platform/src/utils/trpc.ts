import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { devtoolsLink } from "trpc-client-devtools-link";
import type { AppRouter } from "../../../server/src/trpc/routers/index.mjs";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientConfig = {
  links: [
    devtoolsLink({
      enabled: import.meta.env.DEV,
    }),
    httpBatchLink({
      url: "http://localhost:3000/trpc",
    }),
  ],
};

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
