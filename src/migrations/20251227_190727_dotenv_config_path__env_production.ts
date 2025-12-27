import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_height" AS ENUM('xsmall', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__pages_v_version_hero_height" AS ENUM('xsmall', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum_posts_hero_height" AS ENUM('xsmall', 'small', 'medium', 'large', 'xlarge');
  CREATE TYPE "public"."enum__posts_v_version_hero_height" AS ENUM('xsmall', 'small', 'medium', 'large', 'xlarge');
  ALTER TABLE "pages" ADD COLUMN "hero_height" "enum_pages_hero_height" DEFAULT 'medium';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_height" "enum__pages_v_version_hero_height" DEFAULT 'medium';
  ALTER TABLE "posts" ADD COLUMN "hero_height" "enum_posts_hero_height" DEFAULT 'medium';
  ALTER TABLE "_posts_v" ADD COLUMN "version_hero_height" "enum__posts_v_version_hero_height" DEFAULT 'medium';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_height";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_height";
  ALTER TABLE "posts" DROP COLUMN "hero_height";
  ALTER TABLE "_posts_v" DROP COLUMN "version_hero_height";
  DROP TYPE "public"."enum_pages_hero_height";
  DROP TYPE "public"."enum__pages_v_version_hero_height";
  DROP TYPE "public"."enum_posts_hero_height";
  DROP TYPE "public"."enum__posts_v_version_hero_height";`)
}
