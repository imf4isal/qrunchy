import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import type { AppRouterStructure } from "../../../shared/types/api";

// Create tRPC client with proper types from shared interface
export const trpc = createTRPCReact<AppRouterStructure>();

export const trpcClientConfig = {
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/trpc`,
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
          console.log('🔗 tRPC connecting to:', import.meta.env.VITE_BACKEND_URL || "http://localhost:3000");
          console.log('🔐 JWT token included:', !!token);
        }
        
        return headers;
      },
    }),
  ],
};

// Router input/output types will be inferred at runtime
// No need for compile-time type imports
