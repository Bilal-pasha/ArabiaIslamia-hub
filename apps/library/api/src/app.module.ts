import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { getTypeOrmOptions } from './typeorm-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { BooksModule } from './api/books/books.module';
import { BookIssuesModule } from './api/book-issues/book-issues.module';
import { BookAuthorsModule } from './api/book-authors/book-authors.module';
import { BookCategoriesModule } from './api/book-categories/book-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
      },
    }),
    TypeOrmModule.forRoot(getTypeOrmOptions()),
    AuthModule,
    BooksModule,
    BookIssuesModule,
    BookAuthorsModule,
    BookCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
