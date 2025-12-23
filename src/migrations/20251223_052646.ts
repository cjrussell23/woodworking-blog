import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_gallery_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio" AS ENUM('auto', 'square', 'landscape', 'portrait');
  CREATE TYPE "public"."enum_pages_blocks_image_gallery_gap" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_video_block_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_display_mode" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_grid_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio" AS ENUM('auto', 'square', 'landscape', 'portrait');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_gap" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_video_block_position" AS ENUM('left', 'right');
  ALTER TYPE "public"."enum_pages_blocks_media_block_position" RENAME TO "enum_pages_blocks_image_block_position";
  ALTER TYPE "public"."enum__pages_v_blocks_media_block_position" RENAME TO "enum__pages_v_blocks_image_block_position";
  CREATE TABLE "pages_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"display_mode" "enum_pages_blocks_image_gallery_display_mode" DEFAULT 'grid',
  	"grid_columns" "enum_pages_blocks_image_gallery_grid_columns" DEFAULT '3',
  	"aspect_ratio" "enum_pages_blocks_image_gallery_aspect_ratio" DEFAULT 'auto',
  	"gap" "enum_pages_blocks_image_gallery_gap" DEFAULT 'medium',
  	"enable_lightbox" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"display_inline" boolean DEFAULT false,
  	"position" "enum_pages_blocks_video_block_position" DEFAULT 'left',
  	"width" numeric,
  	"height" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_mode" "enum__pages_v_blocks_image_gallery_display_mode" DEFAULT 'grid',
  	"grid_columns" "enum__pages_v_blocks_image_gallery_grid_columns" DEFAULT '3',
  	"aspect_ratio" "enum__pages_v_blocks_image_gallery_aspect_ratio" DEFAULT 'auto',
  	"gap" "enum__pages_v_blocks_image_gallery_gap" DEFAULT 'medium',
  	"enable_lightbox" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_id" integer,
  	"display_inline" boolean DEFAULT false,
  	"position" "enum__pages_v_blocks_video_block_position" DEFAULT 'left',
  	"width" numeric,
  	"height" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_media_block" RENAME TO "pages_blocks_image_block";
  ALTER TABLE "_pages_v_blocks_media_block" RENAME TO "_pages_v_blocks_image_block";
  ALTER TABLE "pages_blocks_image_block" DROP CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_image_block" DROP CONSTRAINT "pages_blocks_media_block_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_image_block" DROP CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_image_block" DROP CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk";
  
  DROP INDEX "pages_blocks_media_block_order_idx";
  DROP INDEX "pages_blocks_media_block_parent_id_idx";
  DROP INDEX "pages_blocks_media_block_path_idx";
  DROP INDEX "pages_blocks_media_block_media_idx";
  DROP INDEX "_pages_v_blocks_media_block_order_idx";
  DROP INDEX "_pages_v_blocks_media_block_parent_id_idx";
  DROP INDEX "_pages_v_blocks_media_block_path_idx";
  DROP INDEX "_pages_v_blocks_media_block_media_idx";
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery_images" ADD CONSTRAINT "pages_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_gallery" ADD CONSTRAINT "pages_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_block" ADD CONSTRAINT "pages_blocks_video_block_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_block" ADD CONSTRAINT "pages_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" ADD CONSTRAINT "_pages_v_blocks_image_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD CONSTRAINT "_pages_v_blocks_image_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_block" ADD CONSTRAINT "_pages_v_blocks_video_block_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_block" ADD CONSTRAINT "_pages_v_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_gallery_images_order_idx" ON "pages_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_images_parent_id_idx" ON "pages_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_images_image_idx" ON "pages_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_image_gallery_order_idx" ON "pages_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_gallery_parent_id_idx" ON "pages_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_gallery_path_idx" ON "pages_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_block_order_idx" ON "pages_blocks_video_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_block_parent_id_idx" ON "pages_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_block_path_idx" ON "pages_blocks_video_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_block_video_idx" ON "pages_blocks_video_block" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_order_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_parent_id_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_images_image_idx" ON "_pages_v_blocks_image_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_order_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_gallery_parent_id_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_gallery_path_idx" ON "_pages_v_blocks_image_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_block_order_idx" ON "_pages_v_blocks_video_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_block_parent_id_idx" ON "_pages_v_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_block_path_idx" ON "_pages_v_blocks_video_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_block_video_idx" ON "_pages_v_blocks_video_block" USING btree ("video_id");
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image_block" ADD CONSTRAINT "pages_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_block" ADD CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_block_order_idx" ON "pages_blocks_image_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_block_parent_id_idx" ON "pages_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_block_path_idx" ON "pages_blocks_image_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_block_media_idx" ON "pages_blocks_image_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_image_block_order_idx" ON "_pages_v_blocks_image_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_block_parent_id_idx" ON "_pages_v_blocks_image_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_block_path_idx" ON "_pages_v_blocks_image_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_block_media_idx" ON "_pages_v_blocks_image_block" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_image_block_position" RENAME TO "enum_pages_blocks_media_block_position";
  ALTER TYPE "public"."enum__pages_v_blocks_image_block_position" RENAME TO "enum__pages_v_blocks_media_block_position";
  ALTER TABLE "pages_blocks_image_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_video_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video_block" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_image_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_image_gallery" CASCADE;
  DROP TABLE "pages_blocks_video_block" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_image_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_video_block" CASCADE;
  ALTER TABLE "pages_blocks_image_block" RENAME TO "pages_blocks_media_block";
  ALTER TABLE "_pages_v_blocks_image_block" RENAME TO "_pages_v_blocks_media_block";
  ALTER TABLE "pages_blocks_media_block" DROP CONSTRAINT "pages_blocks_image_block_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_media_block" DROP CONSTRAINT "pages_blocks_image_block_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_media_block" DROP CONSTRAINT "_pages_v_blocks_image_block_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_media_block" DROP CONSTRAINT "_pages_v_blocks_image_block_parent_id_fk";
  
  DROP INDEX "pages_blocks_image_block_order_idx";
  DROP INDEX "pages_blocks_image_block_parent_id_idx";
  DROP INDEX "pages_blocks_image_block_path_idx";
  DROP INDEX "pages_blocks_image_block_media_idx";
  DROP INDEX "_pages_v_blocks_image_block_order_idx";
  DROP INDEX "_pages_v_blocks_image_block_parent_id_idx";
  DROP INDEX "_pages_v_blocks_image_block_path_idx";
  DROP INDEX "_pages_v_blocks_image_block_media_idx";
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  DROP TYPE "public"."enum_pages_blocks_image_gallery_display_mode";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_aspect_ratio";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_gap";
  DROP TYPE "public"."enum_pages_blocks_video_block_position";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_display_mode";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_aspect_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_gap";
  DROP TYPE "public"."enum__pages_v_blocks_video_block_position";`)
}
