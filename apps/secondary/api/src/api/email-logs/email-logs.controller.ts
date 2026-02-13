import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { EmailLogService, EmailLogsQuery } from './email-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/email-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
export class EmailLogsController {
  constructor(private readonly emailLogService: EmailLogService) { }

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('context') context?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    const query: EmailLogsQuery = {
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      context,
      fromDate,
      toDate,
    };
    const { logs, total } = await this.emailLogService.findAll(query);
    return {
      success: true,
      data: {
        logs,
        total,
      },
    };
  }
}
