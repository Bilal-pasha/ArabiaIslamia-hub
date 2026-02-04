import { IsString, IsNumber, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMadrasaDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  madrasaName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  madrasaAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  totalStudents?: number;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPersonName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cellNumber?: string;
}
