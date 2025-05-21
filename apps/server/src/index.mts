import express from "express";
import routes from "./restroutes/index.mjs";
import { trpcRouter } from "./trpc/trpc-server.mjs";

const app = express();

app.use(express.json());

app.use(routes);

app.use(trpcRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`tRPC API available at http://localhost:${PORT}/trpc`);
});
