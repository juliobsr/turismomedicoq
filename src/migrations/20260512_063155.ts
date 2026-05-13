import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "doctors_patient_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"video_url" varchar NOT NULL,
  	"patient_location" varchar,
  	"quote" varchar
  );
  
  ALTER TABLE "doctors" ADD COLUMN "hero_background_id" integer;
  ALTER TABLE "doctors" ADD COLUMN "hero_video_url" varchar;
  ALTER TABLE "doctors_patient_testimonials" ADD CONSTRAINT "doctors_patient_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "doctors_patient_testimonials_order_idx" ON "doctors_patient_testimonials" USING btree ("_order");
  CREATE INDEX "doctors_patient_testimonials_parent_id_idx" ON "doctors_patient_testimonials" USING btree ("_parent_id");
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_hero_background_id_doctors_media_id_fk" FOREIGN KEY ("hero_background_id") REFERENCES "public"."doctors_media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "doctors_hero_background_idx" ON "doctors" USING btree ("hero_background_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors_patient_testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "doctors_patient_testimonials" CASCADE;
  ALTER TABLE "doctors" DROP CONSTRAINT "doctors_hero_background_id_doctors_media_id_fk";
  
  DROP INDEX "doctors_hero_background_idx";
  ALTER TABLE "doctors" DROP COLUMN "hero_background_id";
  ALTER TABLE "doctors" DROP COLUMN "hero_video_url";`)
}
