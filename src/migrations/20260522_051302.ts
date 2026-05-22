import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_backend_roles_permissions_target" AS ENUM('users', 'backend-roles', 'specialties', 'doctors', 'certificates', 'facilities', 'institutions', 'leads', 'lead-files', 'procedures', 'doctors-media', 'facilities-media', 'institutions-media', 'certificates-media', 'procedures-media', 'medical-assets', 'site-settings', 'patient-journey', 'why-queretaro');
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"backend_roles_id" integer
  );
  
  CREATE TABLE "backend_roles_permissions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"target" "enum_backend_roles_permissions_target" NOT NULL,
  	"read" boolean DEFAULT false,
  	"create" boolean DEFAULT false,
  	"update" boolean DEFAULT false,
  	"delete" boolean DEFAULT false
  );
  
  CREATE TABLE "backend_roles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "backend_roles_id" integer;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_backend_roles_fk" FOREIGN KEY ("backend_roles_id") REFERENCES "public"."backend_roles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "backend_roles_permissions" ADD CONSTRAINT "backend_roles_permissions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."backend_roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_backend_roles_id_idx" ON "users_rels" USING btree ("backend_roles_id");
  CREATE INDEX "backend_roles_permissions_order_idx" ON "backend_roles_permissions" USING btree ("_order");
  CREATE INDEX "backend_roles_permissions_parent_id_idx" ON "backend_roles_permissions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "backend_roles_slug_idx" ON "backend_roles" USING btree ("slug");
  CREATE INDEX "backend_roles_updated_at_idx" ON "backend_roles" USING btree ("updated_at");
  CREATE INDEX "backend_roles_created_at_idx" ON "backend_roles" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_backend_roles_fk" FOREIGN KEY ("backend_roles_id") REFERENCES "public"."backend_roles"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_backend_roles_id_idx" ON "payload_locked_documents_rels" USING btree ("backend_roles_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "backend_roles_permissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "backend_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "backend_roles_permissions" CASCADE;
  DROP TABLE "backend_roles" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_backend_roles_fk";
  
  DROP INDEX "payload_locked_documents_rels_backend_roles_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "backend_roles_id";
  DROP TYPE "public"."enum_backend_roles_permissions_target";`)
}
