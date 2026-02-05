import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';
import { SubmitRenewalDto } from './dto/submit-renewal.dto';
import { UpdateRenewalStatusDto } from './dto/update-renewal-status.dto';
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

  @Get('academic-sessions')
  async getAcademicSessions() {
    return this.admissionService.getAcademicSessions();
  }

  @Get('classes')
  async getClasses() {
    return this.admissionService.getClasses();
  }

  @Get('sections')
  async getSections(@Query('classId') classId?: string) {
    return this.admissionService.getSections(classId);
  }

  @Get('student-by-roll/:rollNumber')
  async findStudentByRoll(@Param('rollNumber') rollNumber: string) {
    const student = await this.admissionService.findStudentByRollNumber(rollNumber);
    if (!student) return null;
    return student;
  }

  @Post('renewal')
  async submitRenewal(@Body() dto: SubmitRenewalDto) {
    return this.admissionService.submitRenewal(dto);
  }

  @Get('renewals')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findAllRenewals() {
    return this.admissionService.findAllRenewals();
  }

  @Get('renewals/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async findOneRenewal(@Param('id') id: string) {
    const renewal = await this.admissionService.findOneRenewal(id);
    if (!renewal) return null;
    return renewal;
  }

  @Patch('renewals/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async updateRenewalStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRenewalStatusDto,
  ) {
    return this.admissionService.updateRenewalStatus(id, dto.status, dto.reason);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  async getStats() {
    return this.admissionService.getStats();
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
