import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .addColumn("is_verified", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("password", "varchar")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("user")
    .dropColumn("is_verified")
    .dropColumn("password")
    .execute();
}