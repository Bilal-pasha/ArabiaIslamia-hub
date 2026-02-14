import { IsString, IsUUID, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookIssueDto {
  @ApiProperty()
  @IsUUID()
  bookId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  issuedTo: string;

  @ApiProperty()
  @IsDateString()
  dueAt: string;
}
