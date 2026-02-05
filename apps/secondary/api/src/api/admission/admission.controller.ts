import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateQuranTestDto } from './dto/update-quran-test.dto';
import { UpdateOralTestDto } from './dto/update-oral-test.dto';
import { UpdateWrittenTestDto } from './dto/update-written-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) { }

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findAll() {
    return this.admissionService.findAll();
  }

  @Get('students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findAllStudents() {
    return this.admissionService.findAllStudents();
  }

  @Get('students/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findOneStudent(@Param('id') id: string) {
    const student = await this.admissionService.findOneStudent(id);
    if (!student) return null;
    return student;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findOne(@Param('id') id: string) {
    return this.admissionService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.admissionService.updateStatus(id, dto.status, dto.reason);
  }

  @Patch(':id/quran-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateQuranTest(@Param('id') id: string, @Body() dto: UpdateQuranTestDto) {
    return this.admissionService.updateQuranTest(id, dto.marks, dto.passed, dto.reason);
  }

  @Patch(':id/oral-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateOralTest(@Param('id') id: string, @Body() dto: UpdateOralTestDto) {
    return this.admissionService.updateOralTest(id, dto.marks, dto.passed, dto.reason);
  }

  @Patch(':id/written-admit-eligible')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async setWrittenAdmitEligible(@Param('id') id: string) {
    return this.admissionService.setWrittenAdmitEligible(id);
  }

  @Patch(':id/written-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateWrittenTest(@Param('id') id: string, @Body() dto: UpdateWrittenTestDto) {
    return this.admissionService.updateWrittenTest(id, dto.marks, dto.passed, dto.reason);
  }

  @Post(':id/fully-approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async fullyApprove(@Param('id') id: string) {
    return this.admissionService.fullyApprove(id);
  }
}
