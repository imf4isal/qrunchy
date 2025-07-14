import dotenv from "dotenv";

// Load environment variables from .env file (for local dev) or use Docker env vars
dotenv.config({ path: "../../.env" });

import express from "express";
import routes from "./restroutes/index.mts";
import { trpcRouter } from "./trpc/trpc-server.mts";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://qrunchy.menu",
      "https://www.qrunchy.menu",
      process.env.FRONTEND_URL,
    ].filter((url): url is string => Boolean(url)),
    credentials: true,
  })
);

app.use(express.json());

app.use(routes);

app.use(trpcRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} - CI/CD Test`);
  console.log(`tRPC API available at http://localhost:${PORT}/trpc`);
});
