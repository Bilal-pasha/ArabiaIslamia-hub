import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}
