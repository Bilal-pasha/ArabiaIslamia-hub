import { IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitRenewalDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  academicSessionId: string;

  @IsUUID()
  classId: string;

  @IsUUID()
  sectionId: string;

  @IsOptional()
  @IsString()
  contactOverride?: string;

  @IsOptional()
  @IsString()
  addressOverride?: string;
}
