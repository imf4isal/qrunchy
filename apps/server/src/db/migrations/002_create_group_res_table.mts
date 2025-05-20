import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("group_res")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("mobile", "varchar")
    .addColumn("address", "text", (col) => col.notNull())
    .addColumn("geolocation", sql`point`, (col) => col)
    .addColumn("description", "text")
    .addColumn("user_id", "integer", (col) =>
      col.notNull().references("user.id")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("is_active", "boolean", (col) => col.defaultTo(true).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("group_res").execute();
}
