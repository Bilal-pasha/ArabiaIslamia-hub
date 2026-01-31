import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1735295800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('users');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              generationStrategy: 'uuid',
              default: 'gen_random_uuid()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '100',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              length: '255',
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'password',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'avatar',
              type: 'varchar',
              length: '500',
              isNullable: true,
            },
            {
              name: 'role',
              type: 'varchar',
              length: '50',
              default: "'user'",
              isNullable: false,
            },
            {
              name: 'oauth_provider',
              type: 'varchar',
              length: '50',
              isNullable: true,
            },
            {
              name: 'oauth_id',
              type: 'varchar',
              length: '255',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'NOW()',
              isNullable: false,
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'NOW()',
              isNullable: false,
            },
          ],
        }),
        true,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
