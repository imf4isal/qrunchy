import express from "express";
import routes from "./routes/index.mjs";
import { setupTrpcServer } from "./trpc/trpc-server.mjs";

const start = async () => {
  const app = express();
  app.use(express.json());
  await setupTrpcServer(app); // IMPORTANT: await this
  app.use(routes);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(
      `tRPC Playground available at http://localhost:${PORT}/api/trpc-playground`
    );
  });
};

start();
