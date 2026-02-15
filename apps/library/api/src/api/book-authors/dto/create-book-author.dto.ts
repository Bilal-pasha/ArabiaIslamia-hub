import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookAuthorDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;
}
