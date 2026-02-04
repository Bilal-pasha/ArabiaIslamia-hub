import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  createDataSourceOptions,
  ScoutsUser,
  Madrasa,
  ScoutsStudent,
} from '@arabiaaislamia/database';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const options = createDataSourceOptions('scouts-portal');
  return {
    ...options,
    entities: [ScoutsUser, Madrasa, ScoutsStudent],
    migrations: [],
    synchronize: process.env.NODE_ENV !== 'production',
  };
}
