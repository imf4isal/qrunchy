import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("addon")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("item_id", "integer", (col) =>
      col.notNull().references("item.id")
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("price", sql`decimal(10,2)`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("addon").execute();
}
