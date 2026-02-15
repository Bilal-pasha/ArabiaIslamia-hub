import twilio from 'twilio';
import { WhatsAppConfig } from './whatsapp.config';
import { normalizePhoneForWhatsApp } from './phone.util';
import { getRegistrationCompleteMessage } from './templates/registration-complete';

export interface SendTextOptions {
  /** Recipient phone in E.164 or raw; will be normalized if possible */
  to: string;
  /** Message body (plain text). For template messages use sendWithTemplate. */
  body: string;
}

export interface SendTemplateOptions {
  to: string;
  contentSid: string;
  contentVariables: Record<string, string>;
}

/**
 * Single, reusable WhatsApp service backed by Twilio.
 * Use one instance per application (e.g. provided via Nest useFactory or similar).
 */
export class WhatsAppService {
  private readonly client: twilio.Twilio;
  private readonly from: string;
  private readonly defaultCountryCode: string;

  constructor(private readonly config: WhatsAppConfig) {
    this.client = twilio(config.accountSid, config.authToken);
    this.from = config.whatsappFrom;
    this.defaultCountryCode = config.defaultCountryCode ?? '971';
  }

  /**
   * Whether the service is configured (has credentials and from number).
   * When false, send methods no-op instead of calling Twilio.
   */
  isConfigured(): boolean {
    return Boolean(
      this.config.accountSid &&
      this.config.authToken &&
      this.config.whatsappFrom &&
      this.config.whatsappFrom.startsWith('whatsapp:')
    );
  }

  /**
   * Normalize phone to E.164 and WhatsApp format (whatsapp:+...).
   * Returns null if invalid or too short.
   */
  normalizeToWhatsApp(rawPhone: string): string | null {
    const normalized = normalizePhoneForWhatsApp(rawPhone, this.defaultCountryCode);
    return normalized ? `whatsapp:${normalized}` : null;
  }

  /**
   * Send a plain text WhatsApp message.
   * No-op if service is not configured or phone cannot be normalized.
   */
  async sendText(options: SendTextOptions): Promise<{ sent: boolean; sid?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { sent: false, error: 'WhatsApp service not configured' };
    }

    const to = this.normalizeToWhatsApp(options.to);
    if (!to) {
      return { sent: false, error: 'Invalid or missing phone number' };
    }

    try {
      const message = await this.client.messages.create({
        from: this.from,
        to,
        body: options.body,
      });
      return { sent: true, sid: message.sid };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { sent: false, error: errorMessage };
    }
  }

  /**
   * Send using an approved WhatsApp template (Content Template Builder).
   * Use for production when the first message must be template-based.
   */
  async sendWithTemplate(options: SendTemplateOptions): Promise<{ sent: boolean; sid?: string; error?: string }> {
    if (!this.isConfigured()) {
      return { sent: false, error: 'WhatsApp service not configured' };
    }

    const to = this.normalizeToWhatsApp(options.to);
    if (!to) {
      return { sent: false, error: 'Invalid or missing phone number' };
    }

    try {
      const message = await this.client.messages.create({
        from: this.from,
        to,
        contentSid: options.contentSid,
        contentVariables: JSON.stringify(options.contentVariables),
      });
      return { sent: true, sid: message.sid };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { sent: false, error: errorMessage };
    }
  }

  /**
   * Send the "registration complete" message (template body).
   * Prefer student/guardian phone; no-op if phone missing or send fails (does not throw).
   */
  async sendRegistrationComplete(
    toPhone: string,
    params: { applicationNumber: string; applicantName: string; brandName?: string }
  ): Promise<{ sent: boolean; sid?: string; error?: string }> {
    const body = getRegistrationCompleteMessage({
      applicantName: params.applicantName,
      applicationNumber: params.applicationNumber,
      brandName: params.brandName,
    });
    return this.sendText({ to: toPhone, body });
  }
}
