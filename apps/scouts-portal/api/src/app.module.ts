import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { getTypeOrmOptions } from './typeorm-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { MadrasasModule } from './api/madrasas/madrasas.module';
import { StudentsModule } from './api/students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
      },
    }),
    TypeOrmModule.forRoot(getTypeOrmOptions()),
    AuthModule,
    MadrasasModule,
    StudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
