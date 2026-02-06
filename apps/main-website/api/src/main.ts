import {
  NestFactory,
} from '@nestjs/core';
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT', 8000);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[] = []) =>
        new BadRequestException({
          message: 'Validation failed',
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints ? Object.values(e.constraints) : [],
          })),
        }),
    }),
  );

  app.use(cookieParser());

  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  const prodOrigins = corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim()).filter(Boolean)
    : [];
  const allowedOrigins = isProd
    ? prodOrigins.length > 0
      ? prodOrigins
      : true
    : [...devOrigins, ...prodOrigins];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  await app.listen(port, '0.0.0.0');
  console.log(`Main website API running on port ${port}`);
}

void bootstrap();
