import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionApplication } from '@arabiaaislamia/database';
import { AuthModule } from '../auth/auth.module';
import { AdmissionController } from './admission.controller';
import { AdmissionService } from './admission.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdmissionApplication]), AuthModule],
  controllers: [AdmissionController],
  providers: [AdmissionService],
})
export class AdmissionModule {}
