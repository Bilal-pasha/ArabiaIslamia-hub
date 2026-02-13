import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLog } from '@arabiaaislamia/database';
import { EmailModule } from '../../common/email.module';
import { EmailLogService } from './email-log.service';
import { EmailLogsController } from './email-logs.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLog]),
    EmailModule,
  ],
  controllers: [EmailLogsController],
  providers: [EmailLogService],
  exports: [EmailLogService],
})
export class EmailLogsModule { }
