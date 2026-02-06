import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { PresignDto } from './dto/presign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post('presign')
  @UseGuards(JwtAuthGuard)
  async presign(@Body() dto: PresignDto) {
    return this.uploadService.getPresignedUrl(
      dto.field,
      dto.filename,
      dto.contentType,
    );
  }

  @Get('presign-get')
  @UseGuards(JwtAuthGuard)
  async presignGet(@Query('key') key: string) {
    const url = await this.uploadService.getPresignedGetUrl(key);
    return { url };
  }
}
