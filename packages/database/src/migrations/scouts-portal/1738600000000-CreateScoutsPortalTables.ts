import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateScoutsPortalTables1738600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'scouts_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
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

    await queryRunner.createTable(
      new Table({
        name: 'madrasas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'madrasa_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'madrasa_address',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'total_students',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'contact_person_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'cell_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'Pending'",
            isNullable: false,
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

    await queryRunner.createForeignKey(
      'madrasas',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'scouts_users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'scouts_students',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'madrasa_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'madrasa_name',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'student_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'father_name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'age_group',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'grade',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'tshirt_size',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'Pending'",
            isNullable: false,
          },
          {
            name: 'file_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'activity',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'group',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'camp',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'sub_camp',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'report',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'gr_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'fees',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'fees_status_chart',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'class_slug',
            type: 'varchar',
            length: '100',
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

    await queryRunner.createForeignKey(
      'scouts_students',
      new TableForeignKey({
        columnNames: ['madrasa_id'],
        referencedTableName: 'madrasas',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('scouts_students', true);
    await queryRunner.dropTable('madrasas', true);
    await queryRunner.dropTable('scouts_users', true);
  }
}
