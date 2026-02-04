import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSchoolTables1735296200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. classes
    await queryRunner.createTable(
      new Table({
        name: 'classes',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 2. sections
    await queryRunner.createTable(
      new Table({
        name: 'sections',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'class_id', type: 'uuid' },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('sections', new TableForeignKey({ columnNames: ['class_id'], referencedTableName: 'classes', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));

    // 3. academic_sessions
    await queryRunner.createTable(
      new Table({
        name: 'academic_sessions',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'start_date', type: 'date' },
          { name: 'end_date', type: 'date' },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 4. subjects
    await queryRunner.createTable(
      new Table({
        name: 'subjects',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'code', type: 'varchar', length: '20', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 5. parents
    await queryRunner.createTable(
      new Table({
        name: 'parents',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'contact', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '255', isNullable: true },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'relation', type: 'varchar', length: '50', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('parents', new TableForeignKey({ columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'SET NULL' }));

    // 6. students
    await queryRunner.createTable(
      new Table({
        name: 'students',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'parent_id', type: 'uuid', isNullable: true },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'date_of_birth', type: 'date', isNullable: true },
          { name: 'gender', type: 'varchar', length: '20', isNullable: true },
          { name: 'guardian_name', type: 'varchar', length: '100', isNullable: true },
          { name: 'contact', type: 'varchar', length: '20', isNullable: true },
          { name: 'address', type: 'varchar', length: '255', isNullable: true },
          { name: 'photo', type: 'varchar', length: '500', isNullable: true },
          { name: 'roll_number', type: 'varchar', length: '50', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('students', new TableForeignKey({ columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'SET NULL' }));
    await queryRunner.createForeignKey('students', new TableForeignKey({ columnNames: ['parent_id'], referencedTableName: 'parents', referencedColumnNames: ['id'], onDelete: 'SET NULL' }));

    // 7. teachers
    await queryRunner.createTable(
      new Table({
        name: 'teachers',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'subject_id', type: 'uuid', isNullable: true },
          { name: 'name', type: 'varchar', length: '150' },
          { name: 'contact', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('teachers', new TableForeignKey({ columnNames: ['user_id'], referencedTableName: 'users', referencedColumnNames: ['id'], onDelete: 'SET NULL' }));
    await queryRunner.createForeignKey('teachers', new TableForeignKey({ columnNames: ['subject_id'], referencedTableName: 'subjects', referencedColumnNames: ['id'], onDelete: 'SET NULL' }));

    // 8. registrations
    await queryRunner.createTable(
      new Table({
        name: 'registrations',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'student_id', type: 'uuid' },
          { name: 'class_id', type: 'uuid' },
          { name: 'section_id', type: 'uuid' },
          { name: 'academic_session_id', type: 'uuid' },
          { name: 'enrolled_at', type: 'date' },
          { name: 'roll_number', type: 'varchar', length: '50', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('registrations', new TableForeignKey({ columnNames: ['student_id'], referencedTableName: 'students', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('registrations', new TableForeignKey({ columnNames: ['class_id'], referencedTableName: 'classes', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('registrations', new TableForeignKey({ columnNames: ['section_id'], referencedTableName: 'sections', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('registrations', new TableForeignKey({ columnNames: ['academic_session_id'], referencedTableName: 'academic_sessions', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));

    // 9. attendance
    await queryRunner.createTable(
      new Table({
        name: 'attendance',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'registration_id', type: 'uuid' },
          { name: 'academic_session_id', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'status', type: 'varchar', length: '20' },
          { name: 'remarks', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('attendance', new TableForeignKey({ columnNames: ['registration_id'], referencedTableName: 'registrations', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('attendance', new TableForeignKey({ columnNames: ['academic_session_id'], referencedTableName: 'academic_sessions', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));

    // 10. fee_types
    await queryRunner.createTable(
      new Table({
        name: 'fee_types',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'code', type: 'varchar', length: '50', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );

    // 11. fee_structure
    await queryRunner.createTable(
      new Table({
        name: 'fee_structure',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'class_id', type: 'uuid' },
          { name: 'fee_type_id', type: 'uuid' },
          { name: 'academic_session_id', type: 'uuid' },
          { name: 'amount', type: 'decimal', precision: 12, scale: 2 },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('fee_structure', new TableForeignKey({ columnNames: ['class_id'], referencedTableName: 'classes', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('fee_structure', new TableForeignKey({ columnNames: ['fee_type_id'], referencedTableName: 'fee_types', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('fee_structure', new TableForeignKey({ columnNames: ['academic_session_id'], referencedTableName: 'academic_sessions', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));

    // 12. fee_payments
    await queryRunner.createTable(
      new Table({
        name: 'fee_payments',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'gen_random_uuid()' },
          { name: 'student_id', type: 'uuid' },
          { name: 'fee_type_id', type: 'uuid' },
          { name: 'academic_session_id', type: 'uuid' },
          { name: 'amount', type: 'decimal', precision: 12, scale: 2 },
          { name: 'paid_at', type: 'date' },
          { name: 'status', type: 'varchar', length: '20', default: "'paid'" },
          { name: 'reference', type: 'varchar', length: '255', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
      true,
    );
    await queryRunner.createForeignKey('fee_payments', new TableForeignKey({ columnNames: ['student_id'], referencedTableName: 'students', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('fee_payments', new TableForeignKey({ columnNames: ['fee_type_id'], referencedTableName: 'fee_types', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
    await queryRunner.createForeignKey('fee_payments', new TableForeignKey({ columnNames: ['academic_session_id'], referencedTableName: 'academic_sessions', referencedColumnNames: ['id'], onDelete: 'CASCADE' }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = ['fee_payments', 'fee_structure', 'fee_types', 'attendance', 'registrations', 'teachers', 'students', 'parents', 'subjects', 'academic_sessions', 'sections', 'classes'];
    for (const table of tables) {
      await queryRunner.dropTable(table, true);
    }
  }
}
