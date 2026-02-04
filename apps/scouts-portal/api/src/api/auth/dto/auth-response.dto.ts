import { ApiProperty } from '@nestjs/swagger';

export class ScoutsUserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() username: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class AuthResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
  @ApiProperty() data: { user: ScoutsUserResponseDto };
}
