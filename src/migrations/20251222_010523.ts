import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_youtube_embed_aspect_ratio" AS ENUM('16:9', '4:3', '1:1', '9:16', '4:5');
  CREATE TYPE "public"."enum_pages_hero_text_color" AS ENUM('default', 'light', 'dark', 'primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_youtube_embed_aspect_ratio" AS ENUM('16:9', '4:3', '1:1', '9:16', '4:5');
  CREATE TYPE "public"."enum__pages_v_version_hero_text_color" AS ENUM('default', 'light', 'dark', 'primary', 'secondary', 'accent');
  CREATE TABLE "pages_blocks_youtube_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" varchar,
  	"title" varchar,
  	"aspect_ratio" "enum_pages_blocks_youtube_embed_aspect_ratio" DEFAULT '16:9',
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"loop" boolean DEFAULT false,
  	"mute" boolean DEFAULT false,
  	"modest_branding" boolean DEFAULT true,
  	"show_related_videos" boolean DEFAULT false,
  	"start_time" numeric,
  	"end_time" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_youtube_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" varchar,
  	"title" varchar,
  	"aspect_ratio" "enum__pages_v_blocks_youtube_embed_aspect_ratio" DEFAULT '16:9',
  	"autoplay" boolean DEFAULT false,
  	"controls" boolean DEFAULT true,
  	"loop" boolean DEFAULT false,
  	"mute" boolean DEFAULT false,
  	"modest_branding" boolean DEFAULT true,
  	"show_related_videos" boolean DEFAULT false,
  	"start_time" numeric,
  	"end_time" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "display_inline" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "width" numeric;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "height" numeric;
  ALTER TABLE "pages" ADD COLUMN "hero_text_color" "enum_pages_hero_text_color" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "display_inline" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "width" numeric;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "height" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_text_color" "enum__pages_v_version_hero_text_color" DEFAULT 'default';
  ALTER TABLE "categories" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_youtube_embed" ADD CONSTRAINT "pages_blocks_youtube_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_youtube_embed" ADD CONSTRAINT "_pages_v_blocks_youtube_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_youtube_embed_order_idx" ON "pages_blocks_youtube_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_youtube_embed_parent_id_idx" ON "pages_blocks_youtube_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_youtube_embed_path_idx" ON "pages_blocks_youtube_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_youtube_embed_order_idx" ON "_pages_v_blocks_youtube_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_youtube_embed_parent_id_idx" ON "_pages_v_blocks_youtube_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_youtube_embed_path_idx" ON "_pages_v_blocks_youtube_embed" USING btree ("_path");
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_youtube_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_youtube_embed" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_youtube_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_youtube_embed" CASCADE;
  ALTER TABLE "categories" DROP CONSTRAINT "categories_image_id_media_id_fk";
  
  DROP INDEX "categories_image_idx";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "display_inline";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "width";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "height";
  ALTER TABLE "pages" DROP COLUMN "hero_text_color";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "display_inline";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "width";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "height";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_text_color";
  ALTER TABLE "categories" DROP COLUMN "image_id";
  DROP TYPE "public"."enum_pages_blocks_youtube_embed_aspect_ratio";
  DROP TYPE "public"."enum_pages_hero_text_color";
  DROP TYPE "public"."enum__pages_v_blocks_youtube_embed_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_version_hero_text_color";`)
}
