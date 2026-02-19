import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookNashir } from '@arabiaaislamia/database';
import { BookNashirsController } from './book-nashirs.controller';
import { BookNashirsService } from './book-nashirs.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookNashir])],
  controllers: [BookNashirsController],
  providers: [BookNashirsService],
  exports: [BookNashirsService],
})
export class BookNashirsModule { }
