import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Library API')
  .setDescription('API for Library (books and issues)')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
