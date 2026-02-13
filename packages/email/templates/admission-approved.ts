/**
 * Full admission approval – student created, roll number assigned.
 */

export interface AdmissionApprovedTemplateOptions {
  applicantName: string;
  applicationNumber: string;
  rollNumber: string;
  logoUrl?: string;
  brandName?: string;
}

const DEFAULT_BRAND = 'Jamia Arabia';
const COLOR_PRIMARY = '#0d5c2e';
const COLOR_ACCENT = '#c9a227';
const COLOR_WHITE = '#ffffff';
const COLOR_BG = '#f5f7f5';
const COLOR_TEXT = '#2d3748';
const COLOR_TEXT_MUTED = '#718096';

export function renderAdmissionApprovedEmail(options: AdmissionApprovedTemplateOptions): string {
  const { applicantName, applicationNumber, rollNumber, logoUrl, brandName = DEFAULT_BRAND } = options;

  const logoBlock = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(brandName)}" width="140" height="auto" style="display:block;max-width:140px;height:auto;" />`
    : `<span style="font-size:24px;font-weight:700;color:${COLOR_PRIMARY};letter-spacing:0.02em;">${escapeHtml(brandName)}</span>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admission confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:${COLOR_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:${COLOR_TEXT};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR_BG};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:${COLOR_WHITE};border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg, ${COLOR_PRIMARY} 0%, #0a4a24 100%);padding:32px 40px;text-align:center;">
              ${logoBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLOR_PRIMARY};">
                Admission confirmed
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:${COLOR_TEXT_MUTED};">
                Dear ${escapeHtml(applicantName)},
              </p>
              <p style="margin:0 0 16px;font-size:15px;color:${COLOR_TEXT};">
                Congratulations! Your admission has been confirmed. You are now a student. Please note your roll number below.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td style="background-color:${COLOR_BG};border-left:4px solid ${COLOR_ACCENT};padding:16px 20px;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:14px;color:${COLOR_TEXT_MUTED};">Application</p>
                    <p style="margin:4px 0 0;font-size:16px;font-weight:600;color:${COLOR_TEXT};">${escapeHtml(applicationNumber)}</p>
                    <p style="margin:12px 0 0;font-size:14px;color:${COLOR_TEXT_MUTED};">Roll number</p>
                    <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${COLOR_PRIMARY};letter-spacing:0.05em;">${escapeHtml(rollNumber)}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:15px;color:${COLOR_TEXT};">
                You will receive further instructions regarding classes and reporting. Welcome to ${escapeHtml(brandName)}!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:${COLOR_BG};border-top:1px solid #e8ece8;text-align:center;">
              <p style="margin:0;font-size:13px;color:${COLOR_TEXT_MUTED};">
                Regards,<br /><strong style="color:${COLOR_PRIMARY};">${escapeHtml(brandName)} Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
