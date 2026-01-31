import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@arabiaaislamia/database';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user,
);
