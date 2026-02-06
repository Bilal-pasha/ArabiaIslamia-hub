import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export interface PresignParams {
  key: string;
  contentType: string;
  expiresIn?: number;
}

export interface PresignResult {
  url: string;
  key: string;
}

function createR2Client(config: R2Config): S3Client {
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;
  return new S3Client({
    region: 'auto',
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    requestChecksumCalculation: 'WHEN_REQUIRED',
  });
}

export interface PresignGetParams {
  key: string;
  expiresIn?: number;
}

export function createPresignedGetUrl(config: R2Config, params: PresignGetParams): Promise<string> {
  const client = createR2Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: params.key,
  });
  return getSignedUrl(client, command, { expiresIn: params.expiresIn ?? 3600 });
}

export function createPresignedPutUrl(config: R2Config, params: PresignParams): Promise<PresignResult> {
  const client = createR2Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(client, command, { expiresIn: params.expiresIn ?? 3600 }).then((url) => ({
    url,
    key: params.key,
  }));
}

export function generateKey(prefix: string, field: string, filename: string): string {
  const ext = filename.includes('.') ? filename.split('.').pop() ?? 'bin' : 'bin';
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
  return `${prefix}/${field}-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
}

export async function deleteObject(config: R2Config, key: string): Promise<void> {
  const client = createR2Client(config);
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    }),
  );
}
