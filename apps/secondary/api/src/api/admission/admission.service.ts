import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmissionApplication, Student } from '@arabiaaislamia/database';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(AdmissionApplication)
    private readonly repo: Repository<AdmissionApplication>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) { }

  async submit(dto: SubmitAdmissionDto) {
    const applicationNumber = this.generateApplicationNumber();
    const application = this.repo.create({
      applicationNumber,
      name: dto.name,
      fatherName: dto.fatherName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      email: dto.email ?? '',
      idNumber: dto.idNumber || null,
      address: dto.address,
      permanentAddress: dto.permanentAddress || null,
      country: dto.country,
      state: dto.state || null,
      city: dto.city || null,
      area: dto.area || null,
      language: dto.language || null,
      guardianName: dto.guardianName,
      guardianRelation: dto.guardianRelation,
      guardianPhone: dto.guardianPhone,
      guardianEmail: dto.guardianEmail || null,
      guardianOccupation: dto.guardianOccupation || null,
      guardianAddress: dto.guardianAddress || null,
      requiredClass: dto.requiredClass,
      previousSchool: dto.previousSchool || null,
      previousClass: dto.previousClass || null,
      previousGrade: dto.previousGrade || null,
      isHafiz: dto.isHafiz || null,
      accommodationType: dto.accommodationType,
      photoFileKey: dto.photoFile || null,
      idFileKey: dto.idFile || null,
      authorityLetterFileKey: dto.authorityLetterFile || null,
      previousResultFileKey: dto.previousResultFile || null,
      status: 'pending',
    });
    await this.repo.save(application);
    return { applicationNumber, id: application.id };
  }

  async findAll(): Promise<AdmissionApplication[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findAllStudents(): Promise<Student[]> {
    return this.studentRepo.find({
      relations: ['admissionApplication'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneStudent(id: string): Promise<Student | null> {
    return this.studentRepo.findOne({
      where: { id },
      relations: ['admissionApplication'],
    });
  }

  async findOne(id: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByApplicationNumber(applicationNumber: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { applicationNumber } });
  }

  async updateStatus(
    id: string,
    status: string,
    reason?: string,
  ): Promise<AdmissionApplication> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    app.status = status;
    app.statusReason = reason ?? null;
    await this.repo.save(app);
    return app;
  }

  async updateQuranTest(
    id: string,
    marks: string | undefined,
    passed: boolean,
    reason?: string,
  ): Promise<AdmissionApplication> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    app.quranTestMarks = marks ?? null;
    app.quranTestPassed = passed;
    app.quranTestReason = reason ?? null;
    if (!passed) {
      app.status = 'quran_test_failed';
      app.statusReason = reason ?? 'Quran test failed';
    }
    await this.repo.save(app);
    return app;
  }

  async updateOralTest(
    id: string,
    marks: string | undefined,
    passed: boolean,
    reason?: string,
  ): Promise<AdmissionApplication> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    app.oralTestMarks = marks ?? null;
    app.oralTestPassed = passed;
    await this.repo.save(app);
    return app;
  }

  async setWrittenAdmitEligible(id: string): Promise<AdmissionApplication> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    app.writtenAdmitEligible = true;
    await this.repo.save(app);
    return app;
  }

  async updateWrittenTest(
    id: string,
    marks: string | undefined,
    passed: boolean,
    reason?: string,
  ): Promise<AdmissionApplication> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    app.writtenTestMarks = marks ?? null;
    app.writtenTestPassed = passed;
    app.writtenTestReason = reason ?? null;
    await this.repo.save(app);
    return app;
  }

  async fullyApprove(id: string): Promise<{ application: AdmissionApplication; student: Student }> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    if (app.status === 'student') throw new BadRequestException('Application already converted to student');
    if (app.quranTestPassed !== true || app.oralTestPassed !== true || app.writtenTestPassed !== true) {
      throw new BadRequestException('Quran, oral and written tests must be passed before full approval');
    }

    const student = this.studentRepo.create({
      name: app.name,
      dateOfBirth: app.dateOfBirth ? new Date(app.dateOfBirth) : null,
      gender: app.gender || null,
      guardianName: app.guardianName || null,
      contact: app.phone || null,
      address: app.address || null,
      photo: app.photoFileKey || null,
      rollNumber: app.applicationNumber,
      admissionApplicationId: app.id,
    });
    await this.studentRepo.save(student);

    app.status = 'student';
    app.statusReason = null;
    await this.repo.save(app);

    return { application: app, student };
  }

  private generateApplicationNumber(): string {
    return `ARB-${Date.now().toString(36).toUpperCase()}`;
  }
}
