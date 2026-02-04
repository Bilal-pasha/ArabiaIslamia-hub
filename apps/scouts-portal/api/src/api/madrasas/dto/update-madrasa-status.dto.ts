import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMadrasaStatusDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  status: string;
}
