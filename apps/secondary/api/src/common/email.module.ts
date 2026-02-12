import { Module } from '@nestjs/common';
import { EmailService, defaultEmailConfig } from '@arabiaaislamia/email';

@Module({
  providers: [
    {
      provide: EmailService,
      useFactory: (): EmailService => new EmailService(defaultEmailConfig),
    },
  ],
  exports: [EmailService],
})
export class EmailModule { }
