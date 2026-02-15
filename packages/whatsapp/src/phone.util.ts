/**
 * Normalize a phone number for Twilio WhatsApp (E.164-like).
 * Strips spaces, dashes, parentheses; ensures a leading + and country code.
 */
export function normalizePhoneForWhatsApp(
  raw: string,
  defaultCountryCode: string = '971'
): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const digitsOnly = raw.replace(/\D/g, '');
  if (digitsOnly.length < 8) return null;

  let withPlus: string;
  if (raw.trim().startsWith('+')) {
    withPlus = '+' + digitsOnly;
  } else {
    const code = defaultCountryCode.replace(/\D/g, '');
    withPlus = '+' + (digitsOnly.startsWith(code) ? digitsOnly : code + digitsOnly);
  }

  return withPlus.length >= 10 ? withPlus : null;
}
