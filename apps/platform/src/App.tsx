import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Suspense, useState } from "react";
import Router from "./router";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { AuthProvider } from "./contexts/AuthContext";

import { trpc } from "./utils/trpc";

const App = () => {
  const localURL = `${import.meta.env.VITE_BACKEND_URL || "https://api.qrunchy.menu"}/trpc`;

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // devtoolsLink(),
        httpBatchLink({
          url: localURL,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RestaurantProvider>
            <Suspense>
              <Router />
            </Suspense>
          </RestaurantProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
