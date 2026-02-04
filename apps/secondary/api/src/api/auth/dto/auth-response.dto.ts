import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() email: string;
  @ApiProperty({ nullable: true }) avatar: string | null;
  @ApiProperty() role: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class AuthResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
  @ApiProperty() data: { user: UserResponseDto };
}
