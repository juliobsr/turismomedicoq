import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_communication_history_direction" AS ENUM('inbound', 'outbound', 'internal');
  CREATE TYPE "public"."enum_leads_communication_history_event_type" AS ENUM('lead_created', 'email_sent', 'email_failed', 'file_uploaded', 'internal_note');
  CREATE TYPE "public"."enum_leads_response_template" AS ENUM('request_medical_records', 'consultation_next_steps', 'general_follow_up');
  CREATE TABLE "leads_communication_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"direction" "enum_leads_communication_history_direction" NOT NULL,
  	"event_type" "enum_leads_communication_history_event_type" NOT NULL,
  	"template" varchar,
  	"subject" varchar,
  	"message" varchar,
  	"file_id" integer,
  	"occurred_at" timestamp(3) with time zone NOT NULL,
  	"created_by" varchar
  );
  
  CREATE TABLE "leads_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"lead_files_id" integer
  );
  
  CREATE TABLE "lead_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead_id" integer NOT NULL,
  	"original_name" varchar NOT NULL,
  	"patient_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "leads" ADD COLUMN "last_response_sent_at" timestamp(3) with time zone;
  ALTER TABLE "leads" ADD COLUMN "response_template" "enum_leads_response_template" DEFAULT 'request_medical_records';
  ALTER TABLE "leads" ADD COLUMN "response_subject" varchar;
  ALTER TABLE "leads" ADD COLUMN "response_message" varchar;
  ALTER TABLE "leads" ADD COLUMN "send_response_now" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_files_id" integer;
  ALTER TABLE "leads_communication_history" ADD CONSTRAINT "leads_communication_history_file_id_lead_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."lead_files"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads_communication_history" ADD CONSTRAINT "leads_communication_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_rels" ADD CONSTRAINT "leads_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "leads_communication_history_order_idx" ON "leads_communication_history" USING btree ("_order");
  CREATE INDEX "leads_communication_history_parent_id_idx" ON "leads_communication_history" USING btree ("_parent_id");
  CREATE INDEX "leads_communication_history_file_idx" ON "leads_communication_history" USING btree ("file_id");
  CREATE INDEX "leads_rels_order_idx" ON "leads_rels" USING btree ("order");
  CREATE INDEX "leads_rels_parent_idx" ON "leads_rels" USING btree ("parent_id");
  CREATE INDEX "leads_rels_path_idx" ON "leads_rels" USING btree ("path");
  CREATE INDEX "leads_rels_lead_files_id_idx" ON "leads_rels" USING btree ("lead_files_id");
  CREATE INDEX "lead_files_lead_idx" ON "lead_files" USING btree ("lead_id");
  CREATE INDEX "lead_files_updated_at_idx" ON "lead_files" USING btree ("updated_at");
  CREATE INDEX "lead_files_created_at_idx" ON "lead_files" USING btree ("created_at");
  CREATE UNIQUE INDEX "lead_files_filename_idx" ON "lead_files" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_files_fk" FOREIGN KEY ("lead_files_id") REFERENCES "public"."lead_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_lead_files_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_files_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads_communication_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_files" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leads_communication_history" CASCADE;
  DROP TABLE "leads_rels" CASCADE;
  DROP TABLE "lead_files" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_files_fk";
  
  DROP INDEX "payload_locked_documents_rels_lead_files_id_idx";
  ALTER TABLE "leads" DROP COLUMN "last_response_sent_at";
  ALTER TABLE "leads" DROP COLUMN "response_template";
  ALTER TABLE "leads" DROP COLUMN "response_subject";
  ALTER TABLE "leads" DROP COLUMN "response_message";
  ALTER TABLE "leads" DROP COLUMN "send_response_now";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_files_id";
  DROP TYPE "public"."enum_leads_communication_history_direction";
  DROP TYPE "public"."enum_leads_communication_history_event_type";
  DROP TYPE "public"."enum_leads_response_template";`)
}
