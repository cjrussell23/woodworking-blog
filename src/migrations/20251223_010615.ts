import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_hero_image_position" AS ENUM('top', 'top-right', 'top-left', 'center', 'center-right', 'center-left', 'bottom', 'bottom-right', 'bottom-left');
  CREATE TYPE "public"."enum__posts_v_version_hero_image_position" AS ENUM('top', 'top-right', 'top-left', 'center', 'center-right', 'center-left', 'bottom', 'bottom-right', 'bottom-left');
  ALTER TABLE "posts" ADD COLUMN "hero_image_position" "enum_posts_hero_image_position" DEFAULT 'center';
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_image_position" "enum__posts_v_version_hero_image_position" DEFAULT 'center';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts" DROP COLUMN "hero_image_position";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_image_position";
  DROP TYPE "public"."enum_posts_hero_image_position";
  DROP TYPE "public"."enum__posts_v_version_hero_image_position";`)
}
