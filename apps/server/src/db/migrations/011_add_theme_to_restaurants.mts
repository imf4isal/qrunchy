import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("restaurant")
    .addColumn("theme_id", "varchar", (col) => 
      col.defaultTo("minimal").notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("restaurant")
    .dropColumn("theme_id")
    .execute();
}