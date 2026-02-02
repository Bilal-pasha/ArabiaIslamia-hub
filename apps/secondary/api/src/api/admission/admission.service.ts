import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmissionApplication } from '@arabiaaislamia/database';
import { SubmitAdmissionDto } from './dto/submit-admission.dto';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(AdmissionApplication)
    private readonly repo: Repository<AdmissionApplication>,
  ) {}

  async submit(dto: SubmitAdmissionDto) {
    const applicationNumber = this.generateApplicationNumber();
    const application = this.repo.create({
      applicationNumber,
      name: dto.name,
      fatherName: dto.fatherName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      email: dto.email,
      idNumber: dto.idNumber || null,
      address: dto.address,
      permanentAddress: dto.permanentAddress || null,
      country: dto.country,
      state: dto.state || null,
      city: dto.city || null,
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
      madhab: dto.madhab || null,
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

  async findOne(id: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByApplicationNumber(applicationNumber: string): Promise<AdmissionApplication | null> {
    return this.repo.findOne({ where: { applicationNumber } });
  }

  private generateApplicationNumber(): string {
    return `ARB-${Date.now().toString(36).toUpperCase()}`;
  }
}
