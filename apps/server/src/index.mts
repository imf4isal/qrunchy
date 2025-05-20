import express from "express";
import routes from "./routes/index.mjs";
import { setupTrpcServer } from "./trpc/trpc-server.mjs";

const app = express();

app.use(express.json());
setupTrpcServer(app);

app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `tRPC Playground available at http://localhost:${PORT}/api/trpc-playground`
  );
});
