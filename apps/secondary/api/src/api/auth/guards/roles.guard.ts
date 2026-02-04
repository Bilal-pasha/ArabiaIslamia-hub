import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@arabiaaislamia/database';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles?.length) return true;
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    if (!user?.role) throw new ForbiddenException('Access denied');
    if (requiredRoles.includes(user.role)) return true;
    throw new ForbiddenException('Insufficient permissions');
  }
}
