import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AdmissionApplication,
  Student,
  AcademicSession,
  Class,
  Section,
  RenewalApplication,
  Registration,
} from '@arabiaaislamia/database';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';
import { SubmitRenewalDto } from './dto/submit-renewal.dto';

export interface StudentByRollDto {
  id: string;
  name: string;
  rollNumber: string | null;
  guardianName: string | null;
  lastSessionName?: string;
  lastClassName?: string;
}

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(AdmissionApplication)
    private readonly repo: Repository<AdmissionApplication>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(AcademicSession)
    private readonly academicSessionRepo: Repository<AcademicSession>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(RenewalApplication)
    private readonly renewalRepo: Repository<RenewalApplication>,
    @InjectRepository(Registration)
    private readonly registrationRepo: Repository<Registration>,
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

  async getAcademicSessions(): Promise<AcademicSession[]> {
    return this.academicSessionRepo.find({
      order: { startDate: 'DESC' },
    });
  }

  async getClasses(): Promise<Class[]> {
    return this.classRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async getSections(classId?: string): Promise<Section[]> {
    if (classId) {
      return this.sectionRepo.find({
        where: { classId },
        order: { sortOrder: 'ASC', name: 'ASC' },
      });
    }
    return this.sectionRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findStudentByRollNumber(rollNumber: string): Promise<StudentByRollDto | null> {
    const student = await this.studentRepo.findOne({
      where: { rollNumber },
      relations: ['registrations', 'registrations.academicSession', 'registrations.class'],
    });
    if (!student) return null;
    const sorted = [...(student.registrations || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latest = sorted[0];
    return {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      guardianName: student.guardianName,
      lastSessionName: latest?.academicSession?.name,
      lastClassName: latest?.class?.name,
    };
  }

  async submitRenewal(dto: SubmitRenewalDto): Promise<{ id: string; message: string }> {
    const student = await this.studentRepo.findOne({ where: { id: dto.studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const [session, cls, section] = await Promise.all([
      this.academicSessionRepo.findOne({ where: { id: dto.academicSessionId } }),
      this.classRepo.findOne({ where: { id: dto.classId } }),
      this.sectionRepo.findOne({ where: { id: dto.sectionId } }),
    ]);
    if (!session) throw new BadRequestException('Academic session not found');
    if (!cls) throw new BadRequestException('Class not found');
    if (!section) throw new BadRequestException('Section not found');
    if (section.classId !== dto.classId) {
      throw new BadRequestException('Section does not belong to the selected class');
    }

    const existingRegistration = await this.registrationRepo.findOne({
      where: { studentId: dto.studentId, academicSessionId: dto.academicSessionId },
    });
    if (existingRegistration) {
      throw new BadRequestException('Student is already enrolled in this academic session');
    }

    const renewal = this.renewalRepo.create({
      studentId: dto.studentId,
      academicSessionId: dto.academicSessionId,
      classId: dto.classId,
      sectionId: dto.sectionId,
      contactOverride: dto.contactOverride ?? null,
      addressOverride: dto.addressOverride ?? null,
      status: 'pending',
    });
    await this.renewalRepo.save(renewal);
    return { id: renewal.id, message: 'Renewal application submitted successfully' };
  }

  async findAllRenewals(): Promise<RenewalApplication[]> {
    return this.renewalRepo.find({
      relations: ['student', 'academicSession', 'class', 'section'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneRenewal(id: string): Promise<RenewalApplication | null> {
    return this.renewalRepo.findOne({
      where: { id },
      relations: ['student', 'academicSession', 'class', 'section'],
    });
  }

  async updateRenewalStatus(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Promise<RenewalApplication> {
    const renewal = await this.renewalRepo.findOne({
      where: { id },
      relations: ['student'],
    });
    if (!renewal) throw new NotFoundException('Renewal application not found');

    if (status === 'approved') {
      const existing = await this.registrationRepo.findOne({
        where: {
          studentId: renewal.studentId,
          academicSessionId: renewal.academicSessionId,
        },
      });
      if (existing) {
        throw new BadRequestException('Student is already registered for this session');
      }
      const registration = this.registrationRepo.create({
        studentId: renewal.studentId,
        academicSessionId: renewal.academicSessionId,
        classId: renewal.classId,
        sectionId: renewal.sectionId,
        enrolledAt: new Date(),
        rollNumber: renewal.student?.rollNumber ?? null,
      });
      await this.registrationRepo.save(registration);
    }

    renewal.status = status;
    renewal.statusReason = reason ?? null;
    await this.renewalRepo.save(renewal);
    return renewal;
  }

  private generateApplicationNumber(): string {
    return `ARB-${Date.now().toString(36).toUpperCase()}`;
  }
}
