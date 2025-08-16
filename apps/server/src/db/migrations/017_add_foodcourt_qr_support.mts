import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Check if foodcourt enum value exists
  const enumExists = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'qr_type' AND e.enumlabel = 'foodcourt'
    ) as exists
  `.execute(db);

  if (!enumExists.rows[0]?.exists) {
    await sql`ALTER TYPE qr_type ADD VALUE 'foodcourt'`.execute(db);
  }

  // Check if is_active column exists in group_res
  const isActiveExists = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'group_res' AND column_name = 'is_active'
    ) as exists
  `.execute(db);

  if (!isActiveExists.rows[0]?.exists) {
    await db.schema
      .alterTable("group_res")
      .addColumn("is_active", "boolean", (col) => col.defaultTo(false).notNull())
      .execute();
  }

  // Check if group_res_id column exists in qr_code
  const groupResIdExists = await sql<{ exists: boolean }>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'qr_code' AND column_name = 'group_res_id'
    ) as exists
  `.execute(db);

  if (!groupResIdExists.rows[0]?.exists) {
    await db.schema
      .alterTable("qr_code")
      .addColumn("group_res_id", "integer", (col) =>
        col.references("group_res.id")
      )
      .execute();
  }
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