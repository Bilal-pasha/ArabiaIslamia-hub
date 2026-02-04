import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterStudentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activity?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  madrasa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subCamp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tShirtSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  group?: string;
}
