import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("restaurant")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("mobile", "varchar", (col) => col.notNull())
    .addColumn("address", "text")
    .addColumn("geolocation", sql`point`, (col) => col)
    .addColumn("group_res_id", "integer", (col) =>
      col.references("group_res.id")
    )
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
  await db.schema.dropTable("restaurant").execute();
}
