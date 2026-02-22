import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BackupService } from './backup.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsSuperAdminGuard } from '../auth/guards/is-super-admin.guard';

@ApiTags('backup')
@Controller('api/backup')
@UseGuards(JwtAuthGuard, IsSuperAdminGuard)
export class BackupController {
  constructor(private readonly backup: BackupService) {}

  @Post('run')
  @ApiOperation({ summary: 'Run database backup to R2 (super admin only)' })
  async run() {
    return this.backup.runBackup();
  }
}
