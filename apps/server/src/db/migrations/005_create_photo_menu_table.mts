import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("photo_menu")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("restaurant_id", "integer", (col) =>
      col.notNull().references("restaurant.id")
    )
    .addColumn("image_url", "varchar", (col) => col.notNull())
    .addColumn("sort_order", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("photo_menu").execute();
}
