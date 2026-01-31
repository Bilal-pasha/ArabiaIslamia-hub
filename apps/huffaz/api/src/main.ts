import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT', 8001);

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

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
  app.enableCors({ origin: true, credentials: true });

  await app.listen(port, '0.0.0.0');
  app.get(Logger).log(`Huffaz API running on port ${port}`, 'Bootstrap');
}

void bootstrap();
