import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsAppService, getDefaultWhatsAppConfig } from '@arabiaaislamia/whatsapp';

@Global()
@Module({
  providers: [
    {
      provide: WhatsAppService,
      useFactory: (config: ConfigService): WhatsAppService => {
        const accountSid = config.get<string>('TWILIO_ACCOUNT_SID') ?? getDefaultWhatsAppConfig().accountSid;
        const authToken = config.get<string>('TWILIO_AUTH_TOKEN') ?? getDefaultWhatsAppConfig().authToken;
        const whatsappFrom = config.get<string>('TWILIO_WHATSAPP_FROM') ?? getDefaultWhatsAppConfig().whatsappFrom;
        const defaultCountryCode = config.get<string>('TWILIO_DEFAULT_COUNTRY_CODE') ?? getDefaultWhatsAppConfig().defaultCountryCode;
        return new WhatsAppService({
          accountSid,
          authToken,
          whatsappFrom,
          defaultCountryCode,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [WhatsAppService],
})
export class WhatsAppModule { }
