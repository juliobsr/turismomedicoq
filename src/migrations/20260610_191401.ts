import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "facilities_infrastructure_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"caption" varchar,
  	"thumbnail_id" integer
  );
  
  DO $$ BEGIN
    ALTER TABLE "facilities_infrastructure_video_links" ADD CONSTRAINT "facilities_infrastructure_video_links_thumbnail_id_facilities_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."facilities_media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "facilities_infrastructure_video_links" ADD CONSTRAINT "facilities_infrastructure_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "facilities_infrastructure_video_links_order_idx" ON "facilities_infrastructure_video_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "facilities_infrastructure_video_links_parent_id_idx" ON "facilities_infrastructure_video_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "facilities_infrastructure_video_links_thumbnail_idx" ON "facilities_infrastructure_video_links" USING btree ("thumbnail_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "facilities_infrastructure_video_links" CASCADE;`)
}
