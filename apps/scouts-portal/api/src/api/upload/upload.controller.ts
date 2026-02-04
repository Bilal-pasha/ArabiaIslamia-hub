import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UploadService } from './upload.service';
import { PresignDto } from './dto/presign.dto';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('presign')
  async presign(@Body() dto: PresignDto) {
    return this.uploadService.getPresignedUrl(dto.field, dto.filename, dto.contentType);
  }

  @Get('presign-get')
  async presignGet(@Query('key') key: string) {
    const url = await this.uploadService.getPresignedGetUrl(key);
    return { url };
  }
}
