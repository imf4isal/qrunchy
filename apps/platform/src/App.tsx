import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { Suspense, useState } from "react";
import Router from "./router";

import { trpc } from "./utils/trpc";
// import { devtoolsLink } from "trpc-client-devtools-link";

const App = () => {
  const localURL = `${window.location.protocol}//${window.location.hostname}:3000/trpc`;

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
        <Suspense>
          <Router />
        </Suspense>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default App;
