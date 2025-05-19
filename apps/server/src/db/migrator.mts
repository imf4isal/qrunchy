import path from "path";
import { promises as fs } from "fs";
import { Kysely, Migrator, FileMigrationProvider } from "kysely";
import { fileURLToPath } from "url";

// extract current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getMigrator(db: Kysely<any>) {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });
}
