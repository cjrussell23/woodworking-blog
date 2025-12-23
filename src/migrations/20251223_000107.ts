import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_media_block_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_media_block_position" AS ENUM('left', 'right');
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "position" "enum_pages_blocks_media_block_position" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "position" "enum__pages_v_blocks_media_block_position" DEFAULT 'left';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" DROP COLUMN "position";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "position";
  DROP TYPE "public"."enum_pages_blocks_media_block_position";
  DROP TYPE "public"."enum__pages_v_blocks_media_block_position";`)
}
