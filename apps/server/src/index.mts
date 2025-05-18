import express from "express";
import routes from "./routes/index.mjs";

const app = express();

// Use routes
app.use(routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
