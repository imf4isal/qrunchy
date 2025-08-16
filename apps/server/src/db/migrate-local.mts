import dotenv from "dotenv";

// Load local environment variables first, then fallback to root
dotenv.config({ path: ".env" });
dotenv.config({ path: "../../.env" });

import { fileURLToPath } from "url";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "../types/database.mts";
import { getMigrator } from "./migrator.mts";

// Create database connection after environment variables are loaded
const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "qrunchy_db",
    user: process.env.DB_USER || "qrunchy",
    password: process.env.DB_PASSWORD || "qrunchy_password",
  }),
});

const db = new Kysely<Database>({
  dialect,
});

async function migrateToLatest() {
  console.log("🔗 Connecting to database:", {
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "qrunchy_db",
    user: process.env.DB_USER || "qrunchy"
  });

  const migrator = getMigrator(db);

  const { error, results } = await migrator.migrateToLatest();

  if (error) {
    console.log("Failed to migrate.");
    console.log(error);
    process.exit(1);
  }

  if (results?.length) {
    results.forEach((it) => {
      console.log(`Migration "${it.migrationName}" was executed successfully.`);
    });
  } else {
    console.log("No migrations were executed.");
  }

  await db.destroy();
}

async function migrateDown() {
  console.log("🔗 Connecting to database:", {
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "qrunchy_db",
    user: process.env.DB_USER || "qrunchy"
  });

  const migrator = getMigrator(db);

  const { error, results } = await migrator.migrateDown();

  if (error) {
    console.error("Failed to migrate down");
    console.error(error);
    process.exit(1);
  }

  if (results?.length) {
    results.forEach((it) => {
      console.log(`Migration "${it.migrationName}" was reverted successfully`);
    });
  } else {
    console.log("No migrations were executed");
  }

  await db.destroy();
}

//  if this file was executed directly from the cli
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];

  if (command === "down") {
    migrateDown().catch(console.error);
  } else {
    migrateToLatest().catch(console.error);
  }
}

export { migrateToLatest, migrateDown };