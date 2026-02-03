import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateOralTestDto } from './dto/update-oral-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post('submit')
  async submit(@Body() dto: SubmitAdmissionDto) {
    return this.admissionService.submit(dto);
  }

  @Get('by-number/:applicationNumber')
  async findByNumber(@Param('applicationNumber') applicationNumber: string) {
    const app = await this.admissionService.findByApplicationNumber(applicationNumber);
    if (!app) return null;
    return app;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.admissionService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.admissionService.updateStatus(id, dto.status, dto.reason);
  }

  @Patch(':id/oral-test')
  @UseGuards(JwtAuthGuard)
  async updateOralTest(@Param('id') id: string, @Body() dto: UpdateOralTestDto) {
    return this.admissionService.updateOralTest(id, dto.marks, dto.passed, dto.reason);
  }

  @Patch(':id/written-admit-eligible')
  @UseGuards(JwtAuthGuard)
  async setWrittenAdmitEligible(@Param('id') id: string) {
    return this.admissionService.setWrittenAdmitEligible(id);
  }
}
