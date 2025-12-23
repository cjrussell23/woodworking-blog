import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_layout_columns_content_type" AS ENUM('richText', 'youtubeVideo', 'media');
  CREATE TYPE "public"."enum_pages_blocks_layout_direction" AS ENUM('row', 'column');
  CREATE TYPE "public"."enum_pages_blocks_layout_justify_content" AS ENUM('start', 'center', 'end', 'between', 'around', 'evenly');
  CREATE TYPE "public"."enum_pages_blocks_layout_align_items" AS ENUM('start', 'center', 'end', 'stretch');
  CREATE TYPE "public"."enum_pages_blocks_layout_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_columns_content_type" AS ENUM('richText', 'youtubeVideo', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_direction" AS ENUM('row', 'column');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_justify_content" AS ENUM('start', 'center', 'end', 'between', 'around', 'evenly');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_align_items" AS ENUM('start', 'center', 'end', 'stretch');
  CREATE TYPE "public"."enum__pages_v_blocks_layout_gap" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TABLE "pages_blocks_layout_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content_type" "enum_pages_blocks_layout_columns_content_type" DEFAULT 'richText',
  	"media_id" integer,
  	"width" numeric,
  	"height" numeric,
  	"video_id" varchar,
  	"rich_text" jsonb
  );
  
  CREATE TABLE "pages_blocks_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"full_width" boolean DEFAULT false,
  	"direction" "enum_pages_blocks_layout_direction" DEFAULT 'row',
  	"justify_content" "enum_pages_blocks_layout_justify_content" DEFAULT 'start',
  	"align_items" "enum_pages_blocks_layout_align_items" DEFAULT 'stretch',
  	"wrap" boolean DEFAULT false,
  	"gap" "enum_pages_blocks_layout_gap" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_layout_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content_type" "enum__pages_v_blocks_layout_columns_content_type" DEFAULT 'richText',
  	"media_id" integer,
  	"width" numeric,
  	"height" numeric,
  	"video_id" varchar,
  	"rich_text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_layout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_width" boolean DEFAULT false,
  	"direction" "enum__pages_v_blocks_layout_direction" DEFAULT 'row',
  	"justify_content" "enum__pages_v_blocks_layout_justify_content" DEFAULT 'start',
  	"align_items" "enum__pages_v_blocks_layout_align_items" DEFAULT 'stretch',
  	"wrap" boolean DEFAULT false,
  	"gap" "enum__pages_v_blocks_layout_gap" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  ALTER TABLE "pages_blocks_layout_columns" ADD CONSTRAINT "pages_blocks_layout_columns_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout_columns" ADD CONSTRAINT "pages_blocks_layout_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_layout" ADD CONSTRAINT "pages_blocks_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_columns" ADD CONSTRAINT "_pages_v_blocks_layout_columns_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout_columns" ADD CONSTRAINT "_pages_v_blocks_layout_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_layout"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_layout" ADD CONSTRAINT "_pages_v_blocks_layout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_layout_columns_order_idx" ON "pages_blocks_layout_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_layout_columns_parent_id_idx" ON "pages_blocks_layout_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_columns_media_idx" ON "pages_blocks_layout_columns" USING btree ("media_id");
  CREATE INDEX "pages_blocks_layout_order_idx" ON "pages_blocks_layout" USING btree ("_order");
  CREATE INDEX "pages_blocks_layout_parent_id_idx" ON "pages_blocks_layout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_layout_path_idx" ON "pages_blocks_layout" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_layout_columns_order_idx" ON "_pages_v_blocks_layout_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_layout_columns_parent_id_idx" ON "_pages_v_blocks_layout_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_columns_media_idx" ON "_pages_v_blocks_layout_columns" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_layout_order_idx" ON "_pages_v_blocks_layout" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_layout_parent_id_idx" ON "_pages_v_blocks_layout" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_layout_path_idx" ON "_pages_v_blocks_layout" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_layout_columns" CASCADE;
  DROP TABLE "pages_blocks_layout" CASCADE;
  DROP TABLE "_pages_v_blocks_layout_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_layout" CASCADE;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_layout_columns_content_type";
  DROP TYPE "public"."enum_pages_blocks_layout_direction";
  DROP TYPE "public"."enum_pages_blocks_layout_justify_content";
  DROP TYPE "public"."enum_pages_blocks_layout_align_items";
  DROP TYPE "public"."enum_pages_blocks_layout_gap";
  DROP TYPE "public"."enum__pages_v_blocks_layout_columns_content_type";
  DROP TYPE "public"."enum__pages_v_blocks_layout_direction";
  DROP TYPE "public"."enum__pages_v_blocks_layout_justify_content";
  DROP TYPE "public"."enum__pages_v_blocks_layout_align_items";
  DROP TYPE "public"."enum__pages_v_blocks_layout_gap";`)
}
