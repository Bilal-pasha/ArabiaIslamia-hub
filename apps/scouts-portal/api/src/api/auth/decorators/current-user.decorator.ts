import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ScoutsUser } from '@arabiaaislamia/database';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ScoutsUser =>
    ctx.switchToHttp().getRequest().user,
);
