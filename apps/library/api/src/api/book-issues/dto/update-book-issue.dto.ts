import { IsString, IsUUID, IsDateString, MaxLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookIssueDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  bookId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  issuedTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
