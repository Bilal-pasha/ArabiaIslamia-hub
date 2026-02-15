import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {
  AdmissionApplication,
  Student,
  AcademicSession,
  Class,
  Section,
  RenewalApplication,
  Registration,
} from '@arabiaaislamia/database';
import {
  renderAdmissionSubmittedEmail,
  renderAdmissionStatusEmail,
  renderAdmissionApprovedEmail,
  renderAdmissionStepAdmitEmail,
} from '@arabiaaislamia/email';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';
import { SubmitRenewalDto } from './dto/submit-renewal.dto';
import { UploadService } from '../upload/upload.service';
import { EmailLogService } from '../email-logs/email-log.service';
import { WhatsAppService } from '@arabiaaislamia/whatsapp';

export interface StudentByRollDto {
  id: string;
  name: string;
  rollNumber: string | null;
  guardianName: string | null;
  contact: string | null;
  address: string | null;
  lastSessionName?: string;
  lastClassName?: string;
}

/** Plain DTOs for reference data to avoid circular refs when serializing to JSON */
export interface AcademicSessionDto {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface ClassDto {
  id: string;
  name: string;
  sortOrder: number;
}

export interface SectionDto {
  id: string;
  name: string;
  classId: string;
  sortOrder: number;
}

/** Plain DTO for renewal list/detail to avoid circular refs when serializing to JSON */
export interface RenewalDto {
  id: string;
  studentId: string;
  academicSessionId: string;
  classId: string;
  sectionId: string;
  contactOverride: string | null;
  addressOverride: string | null;
  status: string;
  statusReason: string | null;
  createdAt: Date;
  student?: { id: string; name: string; rollNumber: string | null };
  academicSession?: { id: string; name: string };
  class?: { id: string; name: string };
  section?: { id: string; name: string };
}

const BRAND_NAME = 'Jamia Arabia';

function dedupeEmails(emails: (string | null | undefined)[]): string[] {
  const set = new Set<string>();
  for (const e of emails) {
    if (e && e.trim()) set.add(e.trim().toLowerCase());
  }
  return Array.from(set);
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
    private readonly uploadService: UploadService,
    private readonly emailLogService: EmailLogService,
    private readonly configService: ConfigService,
    private readonly whatsAppService: WhatsAppService,
  ) { }

  async submit(dto: SubmitAdmissionDto) {
    const cls = await this.classRepo.findOne({ where: { id: dto.requiredClassId } });
    if (!cls) throw new BadRequestException('Invalid class');

    const applicationNumber = this.generateApplicationNumber();
    const payload: DeepPartial<AdmissionApplication> = {
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
    };
    const application = this.repo.create(payload);
    // FK column; TypeORM entity type may expose relation name only
    (application as { requiredClassId?: string }).requiredClassId = dto.requiredClassId;
    await this.repo.save(application);

    const recipients = dedupeEmails([dto.email, dto.guardianEmail]);
    if (recipients.length > 0) {
      try {
        const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');
        const html = renderAdmissionSubmittedEmail({
          applicantName: dto.name,
          applicationNumber,
          logoUrl: logoUrl || undefined,
          brandName: BRAND_NAME,
        });
        const text = `Dear ${dto.name},\n\nWe have received your admission application. Your application number is: ${applicationNumber}.\n\nRegards,\n${BRAND_NAME} Team`;
        for (const to of recipients) {
          await this.emailLogService.sendAndLog({
            to,
            subject: `Application received – ${applicationNumber}`,
            html,
            text,
            recipientName: dto.name,
            context: 'admission_submitted',
            metadata: { applicationNumber, applicationId: application.id },
          });
        }
      } catch (err) {
        console.error('Error sending admission submitted email', err);
      }
    }

    // WhatsApp: send registration complete to guardian (or student) phone
    const phoneToUse = dto.guardianPhone?.trim() || dto.phone?.trim();
    if (phoneToUse) {
      try {
        const result = await this.whatsAppService.sendRegistrationComplete(phoneToUse, {
          applicationNumber,
          applicantName: dto.name,
          brandName: BRAND_NAME,
        });
        if (!result.sent && result.error) {
          console.error('WhatsApp registration message not sent:', result.error);
        }
      } catch (err) {
        console.error('Error sending admission WhatsApp', err);
      }
    }

    return { applicationNumber, id: application.id };
  }

  async findAll(): Promise<AdmissionApplication[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      relations: ['class'],
    });
  }

  async findAllStudents(): Promise<Student[]> {
    return this.studentRepo.find({
      relations: ['admissionApplication', 'admissionApplication.class'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneStudent(id: string): Promise<Student | null> {
    return this.studentRepo.findOne({
      where: { id },
      relations: ['admissionApplication', 'admissionApplication.class'],
    });
  }

  async findOne(id: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { id }, relations: ['class'] });
  }

  async findByApplicationNumber(applicationNumber: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { applicationNumber }, relations: ['class'] });
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

    const statusNorm = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : null;
    if (statusNorm) {
      const recipients = dedupeEmails([app.email, app.guardianEmail]);
      if (recipients.length > 0) {
        try {
          const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');
          const html = renderAdmissionStatusEmail({
            applicantName: app.name,
            applicationNumber: app.applicationNumber,
            status: statusNorm,
            reason: app.statusReason ?? undefined,
            logoUrl: logoUrl || undefined,
            brandName: BRAND_NAME,
          });
          for (const to of recipients) {
            await this.emailLogService.sendAndLog({
              to,
              subject: `Application ${statusNorm} – ${app.applicationNumber}`,
              html,
              recipientName: app.name,
              context: 'admission_status',
              metadata: { applicationId: app.id, status },
            });
          }
        } catch (err) {
          console.error('Error sending admission status email', err);
        }
      }
    }
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

    const recipients = dedupeEmails([app.email, app.guardianEmail]);
    if (recipients.length > 0) {
      try {
        const baseUrl = this.getBaseUrl();
        const admitCardUrl = `${baseUrl}/registration/admit-card?applicationId=${encodeURIComponent(app.id)}&type=written`;
        const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');
        const html = renderAdmissionStepAdmitEmail({
          applicantName: app.name,
          applicationNumber: app.applicationNumber,
          stepName: 'Written test – admit card',
          stepDescription: 'You are eligible for the written test. Please download your admit card using the link below and bring it with you.',
          admitCardUrl,
          logoUrl: logoUrl || undefined,
          brandName: BRAND_NAME,
        });
        for (const to of recipients) {
          await this.emailLogService.sendAndLog({
            to,
            subject: `Written test admit card – ${app.applicationNumber}`,
            html,
            recipientName: app.name,
            context: 'admission_written_admit',
            metadata: { applicationId: app.id },
          });
        }
      } catch (err) {
        console.error('Error sending written admit email', err);
      }
    }
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

    const recipients = dedupeEmails([app.email, app.guardianEmail]);
    if (recipients.length > 0) {
      try {
        const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');
        const html = renderAdmissionApprovedEmail({
          applicantName: app.name,
          applicationNumber: app.applicationNumber,
          rollNumber: student.rollNumber ?? app.applicationNumber,
          logoUrl: logoUrl || undefined,
          brandName: BRAND_NAME,
        });
        for (const to of recipients) {
          await this.emailLogService.sendAndLog({
            to,
            subject: `Admission confirmed – ${app.applicationNumber}`,
            html,
            recipientName: app.name,
            context: 'admission_approved',
            metadata: { applicationId: app.id, studentId: student.id },
          });
        }
      } catch (err) {
        console.error('Error sending admission approved email', err);
      }
    }
    return { application: app, student };
  }

  private getBaseUrl(): string {
    return this.configService.get<string>('NEXT_PUBLIC_SECONDARY_APP_URL');
  }

  async getAcademicSessions(): Promise<AcademicSessionDto[]> {
    const list = await this.academicSessionRepo.find({
      order: { startDate: 'DESC' },
    });
    return list.map((s) => ({
      id: s.id,
      name: s.name,
      startDate: s.startDate,
      endDate: s.endDate,
      isActive: s.isActive,
    }));
  }

  async getClasses(): Promise<ClassDto[]> {
    const list = await this.classRepo.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      sortOrder: c.sortOrder,
    }));
  }

  async getSections(classId?: string): Promise<SectionDto[]> {
    const list = classId
      ? await this.sectionRepo.find({
        where: { classId },
        order: { sortOrder: 'ASC', name: 'ASC' },
      })
      : await this.sectionRepo.find({
        order: { sortOrder: 'ASC', name: 'ASC' },
      });
    return list.map((s) => ({
      id: s.id,
      name: s.name,
      classId: s.classId,
      sortOrder: s.sortOrder,
    }));
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
    let lastClassName: string | undefined = latest?.class?.name;
    if (latest?.classId && !lastClassName) {
      const cls = await this.classRepo.findOne({ where: { id: latest.classId }, select: ['name'] });
      lastClassName = cls?.name;
    }
    return {
      id: student.id,
      name: student.name,
      rollNumber: student.rollNumber,
      guardianName: student.guardianName,
      contact: student.contact,
      address: student.address,
      lastSessionName: latest?.academicSession?.name,
      lastClassName,
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

  async findAllRenewals(): Promise<RenewalDto[]> {
    const list = await this.renewalRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.student', 'student')
      .leftJoinAndSelect('r.academicSession', 'academicSession')
      .leftJoin('r.class', 'class')
      .addSelect(['class.id', 'class.name'])
      .leftJoin('r.section', 'section')
      .addSelect(['section.id', 'section.name'])
      .orderBy('r.createdAt', 'DESC')
      .getMany();
    return list.map((r) => this.toRenewalDto(r));
  }

  async findOneRenewal(id: string): Promise<RenewalDto | null> {
    const renewal = await this.renewalRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.student', 'student')
      .leftJoinAndSelect('r.academicSession', 'academicSession')
      .leftJoin('r.class', 'class')
      .addSelect(['class.id', 'class.name'])
      .leftJoin('r.section', 'section')
      .addSelect(['section.id', 'section.name'])
      .where('r.id = :id', { id })
      .getOne();
    return renewal ? this.toRenewalDto(renewal) : null;
  }

  private toRenewalDto(r: RenewalApplication): RenewalDto {
    return {
      id: r.id,
      studentId: r.studentId,
      academicSessionId: r.academicSessionId,
      classId: r.classId,
      sectionId: r.sectionId,
      contactOverride: r.contactOverride,
      addressOverride: r.addressOverride,
      status: r.status,
      statusReason: r.statusReason,
      createdAt: r.createdAt,
      student: r.student
        ? { id: r.student.id, name: r.student.name, rollNumber: r.student.rollNumber }
        : undefined,
      academicSession: r.academicSession
        ? { id: r.academicSession.id, name: r.academicSession.name }
        : undefined,
      class: r.class ? { id: r.class.id, name: r.class.name } : undefined,
      section: r.section ? { id: r.section.id, name: r.section.name } : undefined,
    };
  }

  async updateRenewalStatus(
    id: string,
    status: 'approved' | 'rejected',
    reason?: string,
  ): Promise<RenewalDto> {
    const renewal = await this.renewalRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.student', 'student')
      .leftJoinAndSelect('r.academicSession', 'academicSession')
      .leftJoin('r.class', 'class')
      .addSelect(['class.id', 'class.name'])
      .leftJoin('r.section', 'section')
      .addSelect(['section.id', 'section.name'])
      .where('r.id = :id', { id })
      .getOne();
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
    return this.toRenewalDto(renewal);
  }

  async deleteApplication(id: string): Promise<void> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    const fileKeys = [
      app.photoFileKey,
      app.idFileKey,
      app.authorityLetterFileKey,
      app.previousResultFileKey,
    ].filter((k): k is string => !!k && k.trim() !== '');
    for (const key of fileKeys) {
      await this.uploadService.deleteObject(key);
    }
    await this.repo.remove(app);
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    if (student.photo && student.photo.trim()) {
      await this.uploadService.deleteObject(student.photo);
    }
    await this.studentRepo.remove(student);
  }

  async getStats(): Promise<{
    applications: { total: number; pending: number; approved: number; rejected: number; student: number };
    renewals: { total: number; pending: number; approved: number; rejected: number };
    students: number;
  }> {
    const [applications, renewals, studentsCount] = await Promise.all([
      this.repo.find({ select: ['status'] }),
      this.renewalRepo.find({ select: ['status'] }),
      this.studentRepo.count(),
    ]);
    const appByStatus = { pending: 0, approved: 0, rejected: 0, student: 0 };
    for (const a of applications) {
      if (a.status === 'pending') appByStatus.pending++;
      else if (a.status === 'approved') appByStatus.approved++;
      else if (a.status === 'rejected' || a.status === 'quran_test_failed') appByStatus.rejected++;
      else if (a.status === 'student') appByStatus.student++;
    }
    const renByStatus = { pending: 0, approved: 0, rejected: 0 };
    for (const r of renewals) {
      if (r.status === 'pending') renByStatus.pending++;
      else if (r.status === 'approved') renByStatus.approved++;
      else renByStatus.rejected++;
    }
    return {
      applications: {
        total: applications.length,
        ...appByStatus,
      },
      renewals: {
        total: renewals.length,
        ...renByStatus,
      },
      students: studentsCount,
    };
  }

  private generateApplicationNumber(): string {
    return `ARB-${Date.now().toString(36).toUpperCase()}`;
  }
}
