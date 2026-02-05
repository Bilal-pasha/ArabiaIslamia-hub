import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroSlide, SiteSection } from '@arabiaaislamia/database';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [TypeOrmModule.forFeature([HeroSlide, SiteSection])],
  controllers: [CmsController],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
