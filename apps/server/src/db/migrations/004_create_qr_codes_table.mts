import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType("qr_type").asEnum(["photo", "digital"]).execute();

  await db.schema
    .createType("qr_status")
    .asEnum(["available", "used", "expired"])
    .execute();

  await db.schema
    .createTable("qr_code")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("code", "varchar", (col) => col.unique().notNull())
    .addColumn("type", sql`qr_type`, (col) => col.notNull())
    .addColumn("status", sql`qr_status`, (col) => col.notNull())
    .addColumn("restaurant_id", "integer", (col) =>
      col.references("restaurant.id")
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("bound_at", "timestamp")
    .addColumn("expires_at", "timestamp")
    .addColumn("self_serve", "boolean", (col) => col.defaultTo(false).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("qr_code").execute();
  await db.schema.dropType("qr_status").execute();
  await db.schema.dropType("qr_type").execute();
}
