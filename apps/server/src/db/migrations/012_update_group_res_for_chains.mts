import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create enum type for group_res type
  await db.schema
    .createType("group_res_type")
    .asEnum(["chain", "foodcourt"])
    .execute();

  // Add type column with default value 'chain'
  await db.schema
    .alterTable("group_res")
    .addColumn("type", sql`group_res_type`, (col) => col.defaultTo("chain").notNull())
    .execute();

  // Remove redundant columns
  await db.schema
    .alterTable("group_res")
    .dropColumn("mobile")
    .execute();

  await db.schema
    .alterTable("group_res")
    .dropColumn("address")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Add back the removed columns
  await db.schema
    .alterTable("group_res")
    .addColumn("mobile", "varchar")
    .execute();

  await db.schema
    .alterTable("group_res")
    .addColumn("address", "text", (col) => col.notNull())
    .execute();

  // Remove type column
  await db.schema
    .alterTable("group_res")
    .dropColumn("type")
    .execute();

  // Drop the enum type
  await db.schema
    .dropType("group_res_type")
    .execute();
}