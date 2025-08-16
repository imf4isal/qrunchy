import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("otp_verification")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("mobile_number", "varchar", (col) => col.notNull())
    .addColumn("otp_code", "varchar(6)", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("attempts", "integer", (col) => col.defaultTo(0).notNull())
    .addColumn("verified_at", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  // Add index for faster lookups
  await db.schema
    .createIndex("idx_otp_mobile_number")
    .on("otp_verification")
    .column("mobile_number")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("otp_verification").execute();
}