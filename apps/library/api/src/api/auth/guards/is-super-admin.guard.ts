import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { LibraryUser } from '@arabiaaislamia/database';

export class IsSuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as LibraryUser | undefined;
    if (!user || user.username !== 'admin') {
      throw new ForbiddenException('Super admin access required');
    }
    return true;
  }
}
