import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase' })
  @Matches(/[a-z]/, { message: 'Password must contain lowercase' })
  @Matches(/[0-9]/, { message: 'Password must contain number' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain special char' })
  password: string;
}
