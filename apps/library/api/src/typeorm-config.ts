import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  createDataSourceOptions,
  LibraryUser,
  Book,
  BookIssue,
  BookAuthor,
  BookCategory,
  BookNashir,
} from '@arabiaaislamia/database';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const options = createDataSourceOptions('library');
  return {
    ...options,
    entities: [LibraryUser, Book, BookIssue, BookAuthor, BookCategory, BookNashir],
    migrations: [],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
