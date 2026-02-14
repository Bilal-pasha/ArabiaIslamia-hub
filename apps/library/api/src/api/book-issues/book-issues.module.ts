import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, BookIssue } from '@arabiaaislamia/database';
import { BookIssuesController } from './book-issues.controller';
import { BookIssuesService } from './book-issues.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookIssue, Book])],
  controllers: [BookIssuesController],
  providers: [BookIssuesService],
  exports: [BookIssuesService],
})
export class BookIssuesModule {}
