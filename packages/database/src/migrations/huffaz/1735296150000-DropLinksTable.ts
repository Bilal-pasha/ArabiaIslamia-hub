import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropLinksTable1735296150000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS links CASCADE`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Links table removed - no restore
  }
}
