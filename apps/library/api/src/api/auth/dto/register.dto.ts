import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
