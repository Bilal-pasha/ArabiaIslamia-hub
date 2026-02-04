import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Madrasa, ScoutsStudent } from '@arabiaaislamia/database';
import { MadrasasController } from './madrasas.controller';
import { MadrasasService } from './madrasas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Madrasa, ScoutsStudent]),
  ],
  controllers: [MadrasasController],
  providers: [MadrasasService],
  exports: [MadrasasService],
})
export class MadrasasModule { }
