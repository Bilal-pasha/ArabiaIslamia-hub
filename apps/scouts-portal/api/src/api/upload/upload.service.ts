import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createPresignedPutUrl,
  createPresignedGetUrl,
  generateKey,
  type R2Config,
} from '@arabiaaislamia/storage';

@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) { }

  async getPresignedUrl(
    field: string,
    filename: string,
    contentType?: string,
  ): Promise<{ url: string; key: string }> {
    const r2Config = this.getR2Config();
    if (!r2Config) {
      throw new Error(
        'R2 storage not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY to your .env file. File uploads will store filenames only until R2 is configured.',
      );
    }
    const key = generateKey('scouts', field, filename);
    const resolvedContentType = contentType || 'application/octet-stream';
    return createPresignedPutUrl(r2Config, {
      key,
      contentType: resolvedContentType,
      expiresIn: 3600,
    });
  }

  async getPresignedGetUrl(key: string): Promise<string> {
    const r2Config = this.getR2Config();
    if (!r2Config) {
      throw new Error('R2 storage not configured.');
    }
    return createPresignedGetUrl(r2Config, { key, expiresIn: 3600 });
  }

  private getR2Config(): R2Config | null {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('R2_BUCKET_NAME', 'scouts-files');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return null;
    }

    return {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucket,
    };
  }
}
