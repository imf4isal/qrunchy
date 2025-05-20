import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("variant_option")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("item_variant_id", "integer", (col) =>
      col.notNull().references("variant.id")
    )
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("price", sql`decimal(10,2)`, (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("variant_option").execute();
}
