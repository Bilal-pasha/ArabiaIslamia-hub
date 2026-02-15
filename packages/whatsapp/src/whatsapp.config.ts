/**
 * Configuration for the Twilio WhatsApp client.
 * Use TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in env
 * or pass explicitly when instantiating the service.
 */
export interface WhatsAppConfig {
  /** Twilio Account SID */
  accountSid: string;
  /** Twilio Auth Token */
  authToken: string;
  /**
   * WhatsApp sender identifier (e.g. "whatsapp:+14155238886" for sandbox
   * or your Twilio WhatsApp Business number in production).
   */
  whatsappFrom: string;
  /**
   * Default country code for phone normalization when number has no leading + (e.g. "971" for UAE).
   * Optional; if omitted, numbers without + are left as-is (may fail for Twilio).
   */
  defaultCountryCode?: string;
}

/**
 * Build config from process.env. Used when the host app does not inject config.
 */
export function getDefaultWhatsAppConfig(): WhatsAppConfig {
  return {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM ?? '',
    defaultCountryCode: process.env.TWILIO_DEFAULT_COUNTRY_CODE ?? '971',
  };
}
