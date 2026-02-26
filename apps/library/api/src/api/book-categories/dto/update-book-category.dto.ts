import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookCategoryDto {
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name: string;
}
