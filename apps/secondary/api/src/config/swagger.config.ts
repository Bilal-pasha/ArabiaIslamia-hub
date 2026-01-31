import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Secondary API')
  .setDescription('API for Huffaz project')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
