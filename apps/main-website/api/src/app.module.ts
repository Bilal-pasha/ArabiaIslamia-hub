import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmOptions } from './typeorm-config';
import { AuthModule } from './api/auth/auth.module';
import { CmsModule } from './api/cms/cms.module';
import { UploadModule } from './api/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot(getTypeOrmOptions()),
    AuthModule,
    CmsModule,
    UploadModule,
  ],
})
export class AppModule {}
