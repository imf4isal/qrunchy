import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("item")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("price", sql`decimal(10,2)`, (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("category_id", "integer", (col) =>
      col.notNull().references("category.id")
    )
    .addColumn("sort_order", "integer", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("item").execute();
}
