import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOralTestDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  marks?: string;

  @IsBoolean()
  @Type(() => Boolean)
  passed: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
