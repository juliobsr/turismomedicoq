import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "doctors_procedure_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"caption" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "procedures_procedure_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"caption" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "procedures_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"procedures_media_id" integer
  );
  
  DO $$ BEGIN
    ALTER TABLE "doctors_procedure_video_links" ADD CONSTRAINT "doctors_procedure_video_links_thumbnail_id_doctors_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."doctors_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "doctors_procedure_video_links" ADD CONSTRAINT "doctors_procedure_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "procedures_procedure_video_links" ADD CONSTRAINT "procedures_procedure_video_links_thumbnail_id_procedures_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."procedures_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "procedures_procedure_video_links" ADD CONSTRAINT "procedures_procedure_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."procedures"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "procedures_rels" ADD CONSTRAINT "procedures_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."procedures"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "procedures_rels" ADD CONSTRAINT "procedures_rels_procedures_media_fk" FOREIGN KEY ("procedures_media_id") REFERENCES "public"."procedures_media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "doctors_procedure_video_links_order_idx" ON "doctors_procedure_video_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "doctors_procedure_video_links_parent_id_idx" ON "doctors_procedure_video_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "doctors_procedure_video_links_thumbnail_idx" ON "doctors_procedure_video_links" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "procedures_procedure_video_links_order_idx" ON "procedures_procedure_video_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "procedures_procedure_video_links_parent_id_idx" ON "procedures_procedure_video_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "procedures_procedure_video_links_thumbnail_idx" ON "procedures_procedure_video_links" USING btree ("thumbnail_id");
  CREATE INDEX IF NOT EXISTS "procedures_rels_order_idx" ON "procedures_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "procedures_rels_parent_idx" ON "procedures_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "procedures_rels_path_idx" ON "procedures_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "procedures_rels_procedures_media_id_idx" ON "procedures_rels" USING btree ("procedures_media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "doctors_procedure_video_links" CASCADE;
  DROP TABLE "procedures_procedure_video_links" CASCADE;
  DROP TABLE "procedures_rels" CASCADE;`)
}
