import { IsString, IsOptional } from 'class-validator';

export class PresignDto {
  @IsString()
  field: string;

  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
