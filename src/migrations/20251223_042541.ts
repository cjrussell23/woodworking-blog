import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_image_position" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_position" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right');
  CREATE TYPE "public"."enum_posts_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_posts_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_posts_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_posts_hero_text_color" AS ENUM('default', 'light', 'dark', 'primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__posts_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__posts_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__posts_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__posts_v_version_hero_text_color" AS ENUM('default', 'light', 'dark', 'primary', 'secondary', 'accent');
  CREATE TABLE "posts_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_posts_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_posts_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_posts_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__posts_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__posts_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  ALTER TABLE "posts" RENAME COLUMN "hero_image_id" TO "hero_media_id";
  ALTER TABLE "_posts_v" RENAME COLUMN "version_hero_image_id" TO "version_hero_media_id";
  ALTER TABLE "posts" DROP CONSTRAINT "posts_hero_image_id_media_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk";
  
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DATA TYPE text;
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DEFAULT 'center'::text;
  DROP TYPE "public"."enum_posts_hero_image_position";
  CREATE TYPE "public"."enum_posts_hero_image_position" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right');
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DEFAULT 'center'::"public"."enum_posts_hero_image_position";
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DATA TYPE "public"."enum_posts_hero_image_position" USING "hero_image_position"::"public"."enum_posts_hero_image_position";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE text;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center'::text;
  DROP TYPE "public"."enum__posts_v_version_hero_image_position";
  CREATE TYPE "public"."enum__posts_v_version_hero_image_position" AS ENUM('top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center'::"public"."enum__posts_v_version_hero_image_position";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE "public"."enum__posts_v_version_hero_image_position" USING "version_hero_image_position"::"public"."enum__posts_v_version_hero_image_position";
  DROP INDEX "posts_hero_image_idx";
  DROP INDEX "_posts_v_version_version_hero_image_idx";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'mediumImpact';
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'mediumImpact';
  ALTER TABLE "pages" ADD COLUMN "hero_image_position" "enum_pages_hero_image_position" DEFAULT 'center';
  ALTER TABLE "pages" ADD COLUMN "hero_blur_enabled" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "hero_blur_strength" numeric DEFAULT 2;
  ALTER TABLE "pages" ADD COLUMN "hero_overlay_color" varchar DEFAULT 'black';
  ALTER TABLE "pages" ADD COLUMN "hero_overlay_opacity" numeric DEFAULT 0.4;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_position" "enum__pages_v_version_hero_image_position" DEFAULT 'center';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_blur_enabled" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_blur_strength" numeric DEFAULT 2;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_overlay_color" varchar DEFAULT 'black';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_overlay_opacity" numeric DEFAULT 0.4;
  ALTER TABLE "posts" ADD COLUMN "hero_type" "enum_posts_hero_type" DEFAULT 'mediumImpact';
  ALTER TABLE "posts" ADD COLUMN "hero_text_color" "enum_posts_hero_text_color" DEFAULT 'default';
  ALTER TABLE "posts" ADD COLUMN "hero_title" varchar;
  ALTER TABLE "posts" ADD COLUMN "hero_subtitle" varchar;
  ALTER TABLE "posts" ADD COLUMN "hero_blur_enabled" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "hero_blur_strength" numeric DEFAULT 2;
  ALTER TABLE "posts" ADD COLUMN "hero_overlay_color" varchar DEFAULT 'black';
  ALTER TABLE "posts" ADD COLUMN "hero_overlay_opacity" numeric DEFAULT 0.4;
  ALTER TABLE "posts_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_type" "enum__posts_v_version_hero_type" DEFAULT 'mediumImpact';
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_text_color" "enum__posts_v_version_hero_text_color" DEFAULT 'default';
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_subtitle" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_blur_enabled" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_blur_strength" numeric DEFAULT 2;
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_overlay_color" varchar DEFAULT 'black';
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_overlay_opacity" numeric DEFAULT 0.4;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "posts_hero_links" ADD CONSTRAINT "posts_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_hero_links" ADD CONSTRAINT "_posts_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_hero_links_order_idx" ON "posts_hero_links" USING btree ("_order");
  CREATE INDEX "posts_hero_links_parent_id_idx" ON "posts_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_hero_links_order_idx" ON "_posts_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_posts_v_version_hero_links_parent_id_idx" ON "_posts_v_version_hero_links" USING btree ("_parent_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_hero_hero_media_idx" ON "posts" USING btree ("hero_media_id");
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id");
  CREATE INDEX "_posts_v_version_hero_version_hero_media_idx" ON "_posts_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_hero_links" CASCADE;
  DROP TABLE "_posts_v_version_hero_links" CASCADE;
  ALTER TABLE "posts" RENAME COLUMN "hero_media_id" TO "hero_image_id";
  ALTER TABLE "_posts_v" RENAME COLUMN "version_hero_media_id" TO "version_hero_image_id";
  ALTER TABLE "posts" DROP CONSTRAINT "posts_hero_media_id_media_id_fk";
  
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_pages_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_hero_media_id_media_id_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_pages_fk";
  
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DATA TYPE text;
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DEFAULT 'center'::text;
  DROP TYPE "public"."enum_posts_hero_image_position";
  CREATE TYPE "public"."enum_posts_hero_image_position" AS ENUM('top', 'top-right', 'top-left', 'center', 'center-right', 'center-left', 'bottom', 'bottom-right', 'bottom-left');
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DEFAULT 'center'::"public"."enum_posts_hero_image_position";
  ALTER TABLE "posts" ALTER COLUMN "hero_image_position" SET DATA TYPE "public"."enum_posts_hero_image_position" USING "hero_image_position"::"public"."enum_posts_hero_image_position";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE text;
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center'::text;
  DROP TYPE "public"."enum__posts_v_version_hero_image_position";
  CREATE TYPE "public"."enum__posts_v_version_hero_image_position" AS ENUM('top', 'top-right', 'top-left', 'center', 'center-right', 'center-left', 'bottom', 'bottom-right', 'bottom-left');
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DEFAULT 'center'::"public"."enum__posts_v_version_hero_image_position";
  ALTER TABLE "_posts_v" ALTER COLUMN "version_hero_image_position" SET DATA TYPE "public"."enum__posts_v_version_hero_image_position" USING "version_hero_image_position"::"public"."enum__posts_v_version_hero_image_position";
  DROP INDEX "posts_hero_hero_media_idx";
  DROP INDEX "posts_rels_pages_id_idx";
  DROP INDEX "_posts_v_version_hero_version_hero_media_idx";
  DROP INDEX "_posts_v_rels_pages_id_idx";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact';
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact';
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  ALTER TABLE "pages" DROP COLUMN "hero_image_position";
  ALTER TABLE "pages" DROP COLUMN "hero_blur_enabled";
  ALTER TABLE "pages" DROP COLUMN "hero_blur_strength";
  ALTER TABLE "pages" DROP COLUMN "hero_overlay_color";
  ALTER TABLE "pages" DROP COLUMN "hero_overlay_opacity";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_position";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_blur_enabled";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_blur_strength";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_overlay_color";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_overlay_opacity";
  ALTER TABLE "posts" DROP COLUMN "hero_type";
  ALTER TABLE "posts" DROP COLUMN "hero_text_color";
  ALTER TABLE "posts" DROP COLUMN "hero_title";
  ALTER TABLE "posts" DROP COLUMN "hero_subtitle";
  ALTER TABLE "posts" DROP COLUMN "hero_blur_enabled";
  ALTER TABLE "posts" DROP COLUMN "hero_blur_strength";
  ALTER TABLE "posts" DROP COLUMN "hero_overlay_color";
  ALTER TABLE "posts" DROP COLUMN "hero_overlay_opacity";
  ALTER TABLE "posts_rels" DROP COLUMN "pages_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_type";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_text_color";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_subtitle";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_blur_enabled";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_blur_strength";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_overlay_color";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_overlay_opacity";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "pages_id";
  DROP TYPE "public"."enum_pages_hero_image_position";
  DROP TYPE "public"."enum__pages_v_version_hero_image_position";
  DROP TYPE "public"."enum_posts_hero_links_link_type";
  DROP TYPE "public"."enum_posts_hero_links_link_appearance";
  DROP TYPE "public"."enum_posts_hero_type";
  DROP TYPE "public"."enum_posts_hero_text_color";
  DROP TYPE "public"."enum__posts_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__posts_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__posts_v_version_hero_type";
  DROP TYPE "public"."enum__posts_v_version_hero_text_color";`)
}
