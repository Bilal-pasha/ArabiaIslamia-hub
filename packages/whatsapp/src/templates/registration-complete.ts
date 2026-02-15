export interface RegistrationCompleteParams {
  applicantName: string;
  applicationNumber: string;
  brandName?: string;
}

/**
 * Plain-text body for "registration complete" WhatsApp message.
 * For production with approved WhatsApp templates, use contentSid + contentVariables instead.
 */
export function getRegistrationCompleteMessage(params: RegistrationCompleteParams): string {
  const brand = params.brandName ?? 'Jamia Arabia';
  return (
    `Assalamu Alaikum ${params.applicantName},\n\n` +
    `Your registration has been received successfully.\n\n` +
    `Application number: *${params.applicationNumber}*\n\n` +
    `Please save this number for future reference. We will contact you for further steps.\n\n` +
    `Jazakallah Khair,\n${brand}`
  );
}
