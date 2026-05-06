import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'doctor', 'patient');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'scheduled', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_procedures_anesthesia_type" AS ENUM('general', 'local_sedation', 'local');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" uuid NOT NULL,
  	"value" "enum_users_roles",
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "specialties" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "doctors" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"full_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"medical_license" varchar,
  	"profile_picture_id" uuid NOT NULL,
  	"biography" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "doctors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"doctors_media_id" uuid,
  	"specialties_id" uuid,
  	"procedures_id" uuid,
  	"facilities_id" uuid
  );
  
  CREATE TABLE "certificates" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"issuer" varchar NOT NULL,
  	"verification_url" varchar,
  	"logo_id" uuid NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"city" varchar NOT NULL,
  	"hero_image_id" uuid NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"specialties_id" uuid,
  	"doctors_id" uuid,
  	"certificates_id" uuid,
  	"facilities_media_id" uuid
  );
  
  CREATE TABLE "institutions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"logo_id" uuid NOT NULL,
  	"website" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"folio" varchar,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"contact_notes" jsonb,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"doctor_id" uuid NOT NULL,
  	"procedure_id" uuid,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "procedures_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "procedures" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"specialty_id" uuid NOT NULL,
  	"cover_image_id" uuid,
  	"short_summary" varchar NOT NULL,
  	"full_description" jsonb NOT NULL,
  	"pricing_starting_price_u_s_d" numeric NOT NULL,
  	"pricing_financing_available" boolean DEFAULT true,
  	"recovery_time" varchar NOT NULL,
  	"surgery_duration" varchar NOT NULL,
  	"anesthesia_type" "enum_procedures_anesthesia_type",
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "doctors_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "facilities_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "institutions_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "certificates_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "procedures_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "globals_media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
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
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"specialties_id" uuid,
  	"doctors_id" uuid,
  	"certificates_id" uuid,
  	"facilities_id" uuid,
  	"institutions_id" uuid,
  	"leads_id" uuid,
  	"procedures_id" uuid,
  	"doctors_media_id" uuid,
  	"facilities_media_id" uuid,
  	"institutions_media_id" uuid,
  	"certificates_media_id" uuid,
  	"procedures_media_id" uuid,
  	"globals_media_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"company_name" varchar NOT NULL,
  	"contact_email" varchar NOT NULL,
  	"contact_phone" varchar NOT NULL,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip_code" varchar,
  	"address_country" varchar DEFAULT 'USA' NOT NULL,
  	"primary_color" varchar DEFAULT '#2563EB' NOT NULL,
  	"secondary_color" varchar DEFAULT '#1E3A8A' NOT NULL,
  	"accent_color" varchar DEFAULT '#F59E0B' NOT NULL,
  	"background_color" varchar DEFAULT '#F8FAFC' NOT NULL,
  	"text_color" varchar DEFAULT '#0F172A' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "patient_journey_steps_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"image_id" uuid NOT NULL
  );
  
  CREATE TABLE "patient_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"duration" varchar,
  	"image_id" uuid
  );
  
  CREATE TABLE "patient_journey" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"hero_title" varchar DEFAULT 'Your Medical Journey to Queretaro' NOT NULL,
  	"hero_description" varchar DEFAULT 'Experience world-class healthcare combined with the luxury of recovering in Mexico''s most beautiful colonial cities.' NOT NULL,
  	"hero_cover_id" uuid NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_profile_picture_id_doctors_media_id_fk" FOREIGN KEY ("profile_picture_id") REFERENCES "public"."doctors_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_doctors_media_fk" FOREIGN KEY ("doctors_media_id") REFERENCES "public"."doctors_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_procedures_fk" FOREIGN KEY ("procedures_id") REFERENCES "public"."procedures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "certificates" ADD CONSTRAINT "certificates_logo_id_certificates_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."certificates_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_hero_image_id_facilities_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."facilities_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_facilities_media_fk" FOREIGN KEY ("facilities_media_id") REFERENCES "public"."facilities_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "institutions" ADD CONSTRAINT "institutions_logo_id_institutions_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."institutions_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_procedure_id_procedures_id_fk" FOREIGN KEY ("procedure_id") REFERENCES "public"."procedures"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procedures_faqs" ADD CONSTRAINT "procedures_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."procedures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "procedures" ADD CONSTRAINT "procedures_specialty_id_specialties_id_fk" FOREIGN KEY ("specialty_id") REFERENCES "public"."specialties"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "procedures" ADD CONSTRAINT "procedures_cover_image_id_procedures_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."procedures_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_specialties_fk" FOREIGN KEY ("specialties_id") REFERENCES "public"."specialties"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_fk" FOREIGN KEY ("certificates_id") REFERENCES "public"."certificates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutions_fk" FOREIGN KEY ("institutions_id") REFERENCES "public"."institutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_procedures_fk" FOREIGN KEY ("procedures_id") REFERENCES "public"."procedures"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_media_fk" FOREIGN KEY ("doctors_media_id") REFERENCES "public"."doctors_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_media_fk" FOREIGN KEY ("facilities_media_id") REFERENCES "public"."facilities_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_institutions_media_fk" FOREIGN KEY ("institutions_media_id") REFERENCES "public"."institutions_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_certificates_media_fk" FOREIGN KEY ("certificates_media_id") REFERENCES "public"."certificates_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_procedures_media_fk" FOREIGN KEY ("procedures_media_id") REFERENCES "public"."procedures_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_globals_media_fk" FOREIGN KEY ("globals_media_id") REFERENCES "public"."globals_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patient_journey_steps_options" ADD CONSTRAINT "patient_journey_steps_options_image_id_globals_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."globals_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_journey_steps_options" ADD CONSTRAINT "patient_journey_steps_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patient_journey_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patient_journey_steps" ADD CONSTRAINT "patient_journey_steps_image_id_globals_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."globals_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "patient_journey_steps" ADD CONSTRAINT "patient_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."patient_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "patient_journey" ADD CONSTRAINT "patient_journey_hero_cover_id_globals_media_id_fk" FOREIGN KEY ("hero_cover_id") REFERENCES "public"."globals_media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "specialties_slug_idx" ON "specialties" USING btree ("slug");
  CREATE INDEX "specialties_updated_at_idx" ON "specialties" USING btree ("updated_at");
  CREATE INDEX "specialties_created_at_idx" ON "specialties" USING btree ("created_at");
  CREATE UNIQUE INDEX "doctors_slug_idx" ON "doctors" USING btree ("slug");
  CREATE INDEX "doctors_profile_picture_idx" ON "doctors" USING btree ("profile_picture_id");
  CREATE INDEX "doctors_updated_at_idx" ON "doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "doctors" USING btree ("created_at");
  CREATE INDEX "doctors_rels_order_idx" ON "doctors_rels" USING btree ("order");
  CREATE INDEX "doctors_rels_parent_idx" ON "doctors_rels" USING btree ("parent_id");
  CREATE INDEX "doctors_rels_path_idx" ON "doctors_rels" USING btree ("path");
  CREATE INDEX "doctors_rels_doctors_media_id_idx" ON "doctors_rels" USING btree ("doctors_media_id");
  CREATE INDEX "doctors_rels_specialties_id_idx" ON "doctors_rels" USING btree ("specialties_id");
  CREATE INDEX "doctors_rels_procedures_id_idx" ON "doctors_rels" USING btree ("procedures_id");
  CREATE INDEX "doctors_rels_facilities_id_idx" ON "doctors_rels" USING btree ("facilities_id");
  CREATE INDEX "certificates_logo_idx" ON "certificates" USING btree ("logo_id");
  CREATE INDEX "certificates_updated_at_idx" ON "certificates" USING btree ("updated_at");
  CREATE INDEX "certificates_created_at_idx" ON "certificates" USING btree ("created_at");
  CREATE UNIQUE INDEX "facilities_slug_idx" ON "facilities" USING btree ("slug");
  CREATE INDEX "facilities_city_idx" ON "facilities" USING btree ("city");
  CREATE INDEX "facilities_hero_image_idx" ON "facilities" USING btree ("hero_image_id");
  CREATE INDEX "facilities_updated_at_idx" ON "facilities" USING btree ("updated_at");
  CREATE INDEX "facilities_created_at_idx" ON "facilities" USING btree ("created_at");
  CREATE INDEX "facilities_rels_order_idx" ON "facilities_rels" USING btree ("order");
  CREATE INDEX "facilities_rels_parent_idx" ON "facilities_rels" USING btree ("parent_id");
  CREATE INDEX "facilities_rels_path_idx" ON "facilities_rels" USING btree ("path");
  CREATE INDEX "facilities_rels_specialties_id_idx" ON "facilities_rels" USING btree ("specialties_id");
  CREATE INDEX "facilities_rels_doctors_id_idx" ON "facilities_rels" USING btree ("doctors_id");
  CREATE INDEX "facilities_rels_certificates_id_idx" ON "facilities_rels" USING btree ("certificates_id");
  CREATE INDEX "facilities_rels_facilities_media_id_idx" ON "facilities_rels" USING btree ("facilities_media_id");
  CREATE UNIQUE INDEX "institutions_slug_idx" ON "institutions" USING btree ("slug");
  CREATE INDEX "institutions_logo_idx" ON "institutions" USING btree ("logo_id");
  CREATE INDEX "institutions_updated_at_idx" ON "institutions" USING btree ("updated_at");
  CREATE INDEX "institutions_created_at_idx" ON "institutions" USING btree ("created_at");
  CREATE INDEX "leads_doctor_idx" ON "leads" USING btree ("doctor_id");
  CREATE INDEX "leads_procedure_idx" ON "leads" USING btree ("procedure_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "procedures_faqs_order_idx" ON "procedures_faqs" USING btree ("_order");
  CREATE INDEX "procedures_faqs_parent_id_idx" ON "procedures_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "procedures_slug_idx" ON "procedures" USING btree ("slug");
  CREATE INDEX "procedures_specialty_idx" ON "procedures" USING btree ("specialty_id");
  CREATE INDEX "procedures_cover_image_idx" ON "procedures" USING btree ("cover_image_id");
  CREATE INDEX "procedures_updated_at_idx" ON "procedures" USING btree ("updated_at");
  CREATE INDEX "procedures_created_at_idx" ON "procedures" USING btree ("created_at");
  CREATE INDEX "doctors_media_updated_at_idx" ON "doctors_media" USING btree ("updated_at");
  CREATE INDEX "doctors_media_created_at_idx" ON "doctors_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "doctors_media_filename_idx" ON "doctors_media" USING btree ("filename");
  CREATE INDEX "doctors_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "doctors_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "doctors_media_sizes_card_sizes_card_filename_idx" ON "doctors_media" USING btree ("sizes_card_filename");
  CREATE INDEX "doctors_media_sizes_hero_sizes_hero_filename_idx" ON "doctors_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "facilities_media_updated_at_idx" ON "facilities_media" USING btree ("updated_at");
  CREATE INDEX "facilities_media_created_at_idx" ON "facilities_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "facilities_media_filename_idx" ON "facilities_media" USING btree ("filename");
  CREATE INDEX "facilities_media_sizes_thumbnail_sizes_thumbnail_filenam_idx" ON "facilities_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "facilities_media_sizes_card_sizes_card_filename_idx" ON "facilities_media" USING btree ("sizes_card_filename");
  CREATE INDEX "facilities_media_sizes_hero_sizes_hero_filename_idx" ON "facilities_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "institutions_media_updated_at_idx" ON "institutions_media" USING btree ("updated_at");
  CREATE INDEX "institutions_media_created_at_idx" ON "institutions_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "institutions_media_filename_idx" ON "institutions_media" USING btree ("filename");
  CREATE INDEX "institutions_media_sizes_thumbnail_sizes_thumbnail_filen_idx" ON "institutions_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "institutions_media_sizes_card_sizes_card_filename_idx" ON "institutions_media" USING btree ("sizes_card_filename");
  CREATE INDEX "institutions_media_sizes_hero_sizes_hero_filename_idx" ON "institutions_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "certificates_media_updated_at_idx" ON "certificates_media" USING btree ("updated_at");
  CREATE INDEX "certificates_media_created_at_idx" ON "certificates_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "certificates_media_filename_idx" ON "certificates_media" USING btree ("filename");
  CREATE INDEX "certificates_media_sizes_thumbnail_sizes_thumbnail_filen_idx" ON "certificates_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "certificates_media_sizes_card_sizes_card_filename_idx" ON "certificates_media" USING btree ("sizes_card_filename");
  CREATE INDEX "certificates_media_sizes_hero_sizes_hero_filename_idx" ON "certificates_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "procedures_media_updated_at_idx" ON "procedures_media" USING btree ("updated_at");
  CREATE INDEX "procedures_media_created_at_idx" ON "procedures_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "procedures_media_filename_idx" ON "procedures_media" USING btree ("filename");
  CREATE INDEX "procedures_media_sizes_thumbnail_sizes_thumbnail_filenam_idx" ON "procedures_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "procedures_media_sizes_card_sizes_card_filename_idx" ON "procedures_media" USING btree ("sizes_card_filename");
  CREATE INDEX "procedures_media_sizes_hero_sizes_hero_filename_idx" ON "procedures_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "globals_media_updated_at_idx" ON "globals_media" USING btree ("updated_at");
  CREATE INDEX "globals_media_created_at_idx" ON "globals_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "globals_media_filename_idx" ON "globals_media" USING btree ("filename");
  CREATE INDEX "globals_media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "globals_media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "globals_media_sizes_hero_sizes_hero_filename_idx" ON "globals_media" USING btree ("sizes_hero_filename");
  CREATE INDEX "globals_media_sizes_card_sizes_card_filename_idx" ON "globals_media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_specialties_id_idx" ON "payload_locked_documents_rels" USING btree ("specialties_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_id");
  CREATE INDEX "payload_locked_documents_rels_institutions_id_idx" ON "payload_locked_documents_rels" USING btree ("institutions_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_procedures_id_idx" ON "payload_locked_documents_rels" USING btree ("procedures_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_media_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_media_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_media_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_media_id");
  CREATE INDEX "payload_locked_documents_rels_institutions_media_id_idx" ON "payload_locked_documents_rels" USING btree ("institutions_media_id");
  CREATE INDEX "payload_locked_documents_rels_certificates_media_id_idx" ON "payload_locked_documents_rels" USING btree ("certificates_media_id");
  CREATE INDEX "payload_locked_documents_rels_procedures_media_id_idx" ON "payload_locked_documents_rels" USING btree ("procedures_media_id");
  CREATE INDEX "payload_locked_documents_rels_globals_media_id_idx" ON "payload_locked_documents_rels" USING btree ("globals_media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "patient_journey_steps_options_order_idx" ON "patient_journey_steps_options" USING btree ("_order");
  CREATE INDEX "patient_journey_steps_options_parent_id_idx" ON "patient_journey_steps_options" USING btree ("_parent_id");
  CREATE INDEX "patient_journey_steps_options_image_idx" ON "patient_journey_steps_options" USING btree ("image_id");
  CREATE INDEX "patient_journey_steps_order_idx" ON "patient_journey_steps" USING btree ("_order");
  CREATE INDEX "patient_journey_steps_parent_id_idx" ON "patient_journey_steps" USING btree ("_parent_id");
  CREATE INDEX "patient_journey_steps_image_idx" ON "patient_journey_steps" USING btree ("image_id");
  CREATE INDEX "patient_journey_hero_cover_idx" ON "patient_journey" USING btree ("hero_cover_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "specialties" CASCADE;
  DROP TABLE "doctors" CASCADE;
  DROP TABLE "doctors_rels" CASCADE;
  DROP TABLE "certificates" CASCADE;
  DROP TABLE "facilities" CASCADE;
  DROP TABLE "facilities_rels" CASCADE;
  DROP TABLE "institutions" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "procedures_faqs" CASCADE;
  DROP TABLE "procedures" CASCADE;
  DROP TABLE "doctors_media" CASCADE;
  DROP TABLE "facilities_media" CASCADE;
  DROP TABLE "institutions_media" CASCADE;
  DROP TABLE "certificates_media" CASCADE;
  DROP TABLE "procedures_media" CASCADE;
  DROP TABLE "globals_media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "patient_journey_steps_options" CASCADE;
  DROP TABLE "patient_journey_steps" CASCADE;
  DROP TABLE "patient_journey" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_procedures_anesthesia_type";`)
}
