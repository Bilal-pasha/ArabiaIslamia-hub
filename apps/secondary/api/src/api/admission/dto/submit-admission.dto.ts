import { IsOptional, IsString } from 'class-validator';

export class SubmitAdmissionDto {
  @IsString()
  name: string;

  @IsString()
  fatherName: string;

  @IsString()
  dateOfBirth: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  permanentAddress?: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  guardianName: string;

  @IsString()
  guardianRelation: string;

  @IsString()
  guardianPhone: string;

  @IsOptional()
  @IsString()
  guardianEmail?: string;

  @IsOptional()
  @IsString()
  guardianOccupation?: string;

  @IsOptional()
  @IsString()
  guardianAddress?: string;

  @IsString()
  requiredClass: string;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @IsString()
  previousClass?: string;

  @IsOptional()
  @IsString()
  previousGrade?: string;

  @IsOptional()
  @IsString()
  isHafiz?: string;

  @IsString()
  accommodationType: string;

  @IsOptional()
  @IsString()
  madhab?: string;

  @IsOptional()
  @IsString()
  photoFile?: string;

  @IsOptional()
  @IsString()
  idFile?: string;

  @IsOptional()
  @IsString()
  authorityLetterFile?: string;

  @IsOptional()
  @IsString()
  previousResultFile?: string;
}
