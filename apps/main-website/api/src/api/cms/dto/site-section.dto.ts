import { IsString, IsOptional, IsBoolean, IsInt, IsObject, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSiteSectionDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  page?: string;

  @IsString()
  @MaxLength(50)
  sectionKey: string;

  @IsString()
  @MaxLength(50)
  sectionType: string;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}

export class UpdateSiteSectionDto {
  @IsString()
  @MaxLength(50)
  @IsOptional()
  page?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  sectionKey?: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  sectionType?: string;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
