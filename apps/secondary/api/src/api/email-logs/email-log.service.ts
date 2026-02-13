import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailLog } from '@arabiaaislamia/database';
import { EmailService } from '@arabiaaislamia/email';

export interface SendAndLogOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  recipientName?: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailLogsQuery {
  page?: number;
  limit?: number;
  status?: string;
  context?: string;
  fromDate?: string;
  toDate?: string;
}

@Injectable()
export class EmailLogService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(EmailLog)
    private readonly repo: Repository<EmailLog>,
  ) { }

  async sendAndLog(options: SendAndLogOptions): Promise<void> {
    const toStr = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    try {
      await this.emailService.sendMail({
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      await this.repo.insert({
        to: toStr,
        recipientName: options.recipientName ?? null,
        subject: options.subject,
        status: 'success',
        errorMessage: null,
        context: options.context ?? null,
        metadata: options.metadata ?? null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      await this.repo.insert({
        to: toStr,
        recipientName: options.recipientName ?? null,
        subject: options.subject,
        status: 'failed',
        errorMessage,
        context: options.context ?? null,
        metadata: options.metadata ?? null,
      });
      throw err;
    }
  }

  async findAll(query: EmailLogsQuery): Promise<{ logs: EmailLog[]; total: number }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('log').orderBy('log.createdAt', 'DESC');

    if (query.status) {
      qb.andWhere('log.status = :status', { status: query.status });
    }
    if (query.context) {
      qb.andWhere('log.context = :context', { context: query.context });
    }
    if (query.fromDate) {
      qb.andWhere('log.createdAt >= :fromDate', { fromDate: query.fromDate });
    }
    if (query.toDate) {
      qb.andWhere('log.createdAt <= :toDate', { toDate: query.toDate });
    }

    const [logs, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { logs, total };
  }
}
