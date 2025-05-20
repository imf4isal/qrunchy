import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("category")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("restaurant_id", "integer", (col) =>
      col.notNull().references("restaurant.id")
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("sort_order", "integer", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("category").execute();
}
