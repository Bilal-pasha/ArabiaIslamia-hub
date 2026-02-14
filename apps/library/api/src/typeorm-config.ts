import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  createDataSourceOptions,
  LibraryUser,
  Book,
  BookIssue,
} from '@arabiaaislamia/database';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const options = createDataSourceOptions('library');
  return {
    ...options,
    entities: [LibraryUser, Book, BookIssue],
    migrations: [],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
