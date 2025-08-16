import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Add foodcourt to qr_type enum
  await db.schema
    .alterType("qr_type")
    .addValue("foodcourt")
    .execute();

  // Add activation status to group_res table
  await db.schema
    .alterTable("group_res")
    .addColumn("is_active", "boolean", (col) => col.defaultTo(false).notNull())
    .execute();

  // Add group_res_id to qr_code table for food court QR codes
  await db.schema
    .alterTable("qr_code")
    .addColumn("group_res_id", "integer", (col) =>
      col.references("group_res.id")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove group_res_id from qr_code table
  await db.schema
    .alterTable("qr_code")
    .dropColumn("group_res_id")
    .execute();

  // Remove activation status from group_res table
  await db.schema
    .alterTable("group_res")
    .dropColumn("is_active")
    .execute();

  // Note: Cannot remove enum values in PostgreSQL easily
  // This would require recreating the type, which could break existing data
}