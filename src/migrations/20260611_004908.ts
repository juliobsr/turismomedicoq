import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "procedures" ADD COLUMN "hero_background_id" integer;
  ALTER TABLE "procedures" ADD COLUMN "hero_video_url" varchar;
  ALTER TABLE "procedures" ADD CONSTRAINT "procedures_hero_background_id_procedures_media_id_fk" FOREIGN KEY ("hero_background_id") REFERENCES "public"."procedures_media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "procedures_hero_background_idx" ON "procedures" USING btree ("hero_background_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "procedures" DROP CONSTRAINT "procedures_hero_background_id_procedures_media_id_fk";
  
  DROP INDEX "procedures_hero_background_idx";
  ALTER TABLE "procedures" DROP COLUMN "hero_background_id";
  ALTER TABLE "procedures" DROP COLUMN "hero_video_url";`)
}
