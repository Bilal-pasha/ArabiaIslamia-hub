import { ApiProperty } from '@nestjs/swagger';

export class LibraryUserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() username: string;
  @ApiProperty({ required: false }) isSuperAdmin?: boolean;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class AuthResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
  @ApiProperty() data: { user: LibraryUserResponseDto };
}
