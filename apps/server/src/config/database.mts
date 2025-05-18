import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "qrunchy_db",
  user: process.env.DB_USER || "qrunchy",
  password: process.env.DB_PASSWORD || "qrunchy_password",
});

export default pool;
