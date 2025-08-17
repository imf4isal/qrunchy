import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import Router from "./router";
import { RestaurantProvider } from "./contexts/RestaurantContext";
import { AuthProvider } from "./contexts/AuthContext";

import { trpc, trpcClientConfig } from "./utils/trpc";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient(trpcClientConfig)
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
