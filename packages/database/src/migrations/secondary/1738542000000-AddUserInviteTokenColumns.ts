import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserInviteTokenColumns1738542000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'invite_token',
        type: 'varchar',
        length: '64',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'invite_token_expires_at',
        type: 'timestamp',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'invite_token_expires_at');
    await queryRunner.dropColumn('users', 'invite_token');
  }
}
