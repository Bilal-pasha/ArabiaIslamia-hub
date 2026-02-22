import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { spawn } from 'child_process';
import { createReadStream, createWriteStream, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';
import { tmpdir } from 'os';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { putObject, type R2Config } from '@arabiaaislamia/storage';
import { getDatabaseName } from '@arabiaaislamia/database';

const BACKUP_PREFIX = 'library_db_backup';

@Injectable()
export class BackupService {
  constructor(private readonly config: ConfigService) {}

  private getR2Config(): R2Config | null {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    const bucket = this.config.get<string>('R2_BUCKET_NAME', 'arabiaislamia');
    if (!accountId || !accessKeyId || !secretAccessKey) return null;
    return { accountId, accessKeyId, secretAccessKey, bucket };
  }

  async runBackup(): Promise<{ key: string; size: number }> {
    const r2Config = this.getR2Config();
    if (!r2Config) {
      throw new Error('R2 storage not configured for backups. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.');
    }

    const dbHost = this.config.get<string>('DB_HOST', 'localhost');
    const dbPort = this.config.get<string>('DB_PORT', '5432');
    const dbUser = this.config.get<string>('POSTGRES_USER', 'postgres');
    const dbPassword = this.config.get<string>('POSTGRES_PASSWORD', '');
    const dbName = getDatabaseName('library');

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const key = `${BACKUP_PREFIX}/library_db_${dateStr}_${timeStr}.sql.gz`;

    const tmpSql = join(tmpdir(), `library_db_${Date.now()}.sql`);
    const tmpGz = tmpSql + '.gz';

    try {
      await new Promise<void>((resolve, reject) => {
        const env = { ...process.env, PGPASSWORD: dbPassword };
        const out = createWriteStream(tmpSql);
        const pgDump = spawn('pg_dump', ['-h', dbHost, '-p', dbPort, '-U', dbUser, '-d', dbName], { env });
        pgDump.stdout.pipe(out);
        pgDump.stderr.on('data', (d) => console.error('[pg_dump]', d.toString()));
        pgDump.on('close', (code) => {
          if (code !== 0) reject(new Error(`pg_dump exited with code ${code}`));
        });
        pgDump.on('error', reject);
        out.on('finish', resolve);
        out.on('error', reject);
      });

      await pipeline(createReadStream(tmpSql), createGzip(), createWriteStream(tmpGz));

      const buffer = await readFile(tmpGz);
      await putObject(r2Config, {
        key,
        body: buffer,
        contentType: 'application/gzip',
      });

      return { key, size: buffer.length };
    } finally {
      try {
        unlinkSync(tmpSql);
      } catch {
        // ignore
      }
      try {
        unlinkSync(tmpGz);
      } catch {
        // ignore
      }
    }
  }

  @Cron('0 2 * * 6')
  async handleWeeklyBackup(): Promise<void> {
    try {
      const result = await this.runBackup();
      console.log(`[Backup] Weekly backup completed: ${result.key} (${result.size} bytes)`);
    } catch (e) {
      console.error('[Backup] Weekly backup failed:', e);
    }
  }
}
