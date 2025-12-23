import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_layout" DROP COLUMN "full_width";
  ALTER TABLE "_pages_v_blocks_layout" DROP COLUMN "full_width";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_layout" ADD COLUMN "full_width" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_layout" ADD COLUMN "full_width" boolean DEFAULT false;`)
}
