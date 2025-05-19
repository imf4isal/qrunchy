import { db } from "./index.mjs";
import { getMigrator } from "./migrator.mjs";

async function runLatestMigrations() {
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
