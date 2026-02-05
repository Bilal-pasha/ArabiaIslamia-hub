import { IsString, IsOptional, IsBoolean, IsInt, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHeroSlideDto {
  @IsString()
  @MaxLength(500)
  desktopImageUrl: string;

  @IsString()
  @MaxLength(500)
  mobileImageUrl: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  subtitle?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateHeroSlideDto {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  desktopImageUrl?: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  mobileImageUrl?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  subtitle?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
