import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "transactional_email_from_address" varchar;
   ALTER TABLE "site_settings" ADD COLUMN "transactional_email_from_name" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "transactional_email_from_address";
   ALTER TABLE "site_settings" DROP COLUMN "transactional_email_from_name";`)
}
