import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@jamiaarabiaislamia.com';
const ADMIN_NAME = 'CMS Admin';
/** Default password: change after first login. */
const ADMIN_PLAIN_PASSWORD = 'Admin123!';

export class SeedCmsAdmin1738700001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.query(
      `SELECT 1 FROM cms_admins WHERE email = $1 LIMIT 1`,
      [ADMIN_EMAIL],
    );
    if (Array.isArray(existing) && existing.length > 0) return;

    const hash = await bcrypt.hash(ADMIN_PLAIN_PASSWORD, 10);
    await queryRunner.query(
      `INSERT INTO cms_admins (id, name, email, password, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())`,
      [ADMIN_NAME, ADMIN_EMAIL, hash],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM cms_admins WHERE email = $1`, [
      ADMIN_EMAIL,
    ]);
  }
}
