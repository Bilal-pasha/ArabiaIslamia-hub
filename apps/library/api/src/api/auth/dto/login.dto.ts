import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  password: string;
}
