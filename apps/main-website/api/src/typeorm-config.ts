import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  createDataSourceOptions,
  CmsAdmin,
  HeroSlide,
  SiteSection,
} from '@arabiaaislamia/database';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const options = createDataSourceOptions('main-website');
  return {
    ...options,
    entities: [CmsAdmin, HeroSlide, SiteSection],
    migrations: [],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
