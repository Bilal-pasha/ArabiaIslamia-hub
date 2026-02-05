export class AdminResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthResponseDto {
  success: boolean;
  message: string;
  data: { user: AdminResponseDto };
}
