import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CmsAdmin } from '@arabiaaislamia/database';

export const CurrentAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CmsAdmin =>
    ctx.switchToHttp().getRequest().user,
);
