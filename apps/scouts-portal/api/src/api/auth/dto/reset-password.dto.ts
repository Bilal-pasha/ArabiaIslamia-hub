import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}
