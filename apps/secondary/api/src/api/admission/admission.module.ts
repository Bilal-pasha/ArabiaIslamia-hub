import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmissionApplication } from '@arabiaaislamia/database';
import { AdmissionController } from './admission.controller';
import { AdmissionService } from './admission.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdmissionApplication])],
  controllers: [AdmissionController],
  providers: [AdmissionService],
})
export class AdmissionModule {}
