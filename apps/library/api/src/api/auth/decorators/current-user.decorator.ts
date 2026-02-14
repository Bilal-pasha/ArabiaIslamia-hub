import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LibraryUser } from '@arabiaaislamia/database';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): LibraryUser =>
    ctx.switchToHttp().getRequest().user,
);
