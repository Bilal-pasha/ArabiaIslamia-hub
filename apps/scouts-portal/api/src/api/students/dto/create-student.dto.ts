import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  madrasaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  madrasaName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  FatherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  TshirtSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  GRNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fees?: string;

  @ApiPropertyOptional()
  @IsOptional()
  feesStatusChart?: unknown;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classSlug?: string;
}
