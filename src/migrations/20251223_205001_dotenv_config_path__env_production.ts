import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_gallery_object_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_blocks_image_gallery_object_fit" AS ENUM('cover', 'contain');
  ALTER TABLE "pages_blocks_image_gallery" ADD COLUMN "object_fit" "enum_pages_blocks_image_gallery_object_fit" DEFAULT 'cover';
  ALTER TABLE "_pages_v_blocks_image_gallery" ADD COLUMN "object_fit" "enum__pages_v_blocks_image_gallery_object_fit" DEFAULT 'cover';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_image_gallery" DROP COLUMN "object_fit";
  ALTER TABLE "_pages_v_blocks_image_gallery" DROP COLUMN "object_fit";
  DROP TYPE "public"."enum_pages_blocks_image_gallery_object_fit";
  DROP TYPE "public"."enum__pages_v_blocks_image_gallery_object_fit";`)
}
