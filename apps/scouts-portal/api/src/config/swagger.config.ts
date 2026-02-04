import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Scouts Portal API')
  .setDescription('API for Scouts Portal')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
