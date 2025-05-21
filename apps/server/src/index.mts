import express from "express";
import routes from "./restroutes/index.mjs";
import { trpcRouter } from "./trpc/trpc-server.mjs";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

app.use(routes);

app.use(trpcRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`tRPC API available at http://localhost:${PORT}/trpc`);
});
