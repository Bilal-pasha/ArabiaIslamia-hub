/**
 * Normalize a phone number for Twilio WhatsApp (E.164).
 * - Strips spaces, dashes, parentheses.
 * - If number has no leading +: prepends defaultCountryCode and strips a leading 0
 *   (e.g. 03478542982 with code 92 → +923478542982 for Pakistan).
 * Set TWILIO_DEFAULT_COUNTRY_CODE=92 for Pakistan, 971 for UAE, etc.
 */
export function normalizePhoneForWhatsApp(
  raw: string,
  defaultCountryCode: string = '971'
): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly.length < 8) return null;

  const code = defaultCountryCode.replace(/\D/g, '');
  let withPlus: string;

  if (raw.trim().startsWith('+')) {
    withPlus = '+' + digitsOnly;
  } else if (digitsOnly.startsWith(code)) {
    withPlus = '+' + digitsOnly;
  } else {
    // Prepend country code; strip leading 0 so 03478542982 + 92 → +923478542982
    const withoutLeadingZero = digitsOnly.replace(/^0+/, '');
    withPlus = '+' + code + withoutLeadingZero;
  }

  return withPlus.length >= 10 ? withPlus : null;
}
