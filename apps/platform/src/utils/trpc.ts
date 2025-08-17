import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { devtoolsLink } from "trpc-client-devtools-link";
import type { AppRouter } from "../../../server/src/trpc/routers/index.mjs";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientConfig = {
  links: [
    // Disable devtools in production to avoid conflicts
    ...(import.meta.env.DEV ? [devtoolsLink({
      enabled: true,
    })] : []),
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_URL || "https://api.qrunchy.menu"}/trpc`,
      headers: () => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('qrunchy_token');
        
        const headers: Record<string, string> = {};
        
        // Add JWT token to Authorization header if available
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        // Add debug logging in development
        if (import.meta.env.DEV) {
          console.log('🔗 tRPC connecting to:', import.meta.env.VITE_BACKEND_URL || "https://api.qrunchy.menu");
          console.log('🔐 JWT token included:', !!token);
        }
        
        return headers;
      },
    }),
  ],
};

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
