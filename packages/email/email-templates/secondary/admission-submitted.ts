/**
 * Admission application received – includes application number.
 * Secondary school template with logo and brand.
 */

import { renderBaseEmailLayout } from '../shared/layout';
import { escapeHtml } from '../shared/escape-html';
import {
  buildSecondaryLogoBlock,
  SECONDARY_BRAND_NAME,
  COLOR_PRIMARY,
  COLOR_ACCENT,
  COLOR_WHITE,
  COLOR_BG,
  COLOR_TEXT,
  COLOR_TEXT_MUTED,
  COLOR_PRIMARY_DARK,
  COLOR_BORDER,
} from './theme';

export interface AdmissionSubmittedTemplateOptions {
  applicantName: string;
  applicationNumber: string;
  logoUrl?: string;
  brandName?: string;
}

const LAYOUT_COLORS = {
  primary: COLOR_PRIMARY,
  primaryDark: COLOR_PRIMARY_DARK,
  bg: COLOR_BG,
  white: COLOR_WHITE,
  text: COLOR_TEXT,
  textMuted: COLOR_TEXT_MUTED,
  border: COLOR_BORDER,
};

export function renderAdmissionSubmittedEmail(options: AdmissionSubmittedTemplateOptions): string {
  const { applicantName, applicationNumber, logoUrl, brandName = SECONDARY_BRAND_NAME } = options;
  const logoBlock = buildSecondaryLogoBlock({ logoUrl, brandName });

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLOR_PRIMARY};">
      Application received
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${COLOR_TEXT_MUTED};">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${COLOR_TEXT};">
      We have received your admission application. Please save your application number for future reference.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background-color:${COLOR_BG};border-left:4px solid ${COLOR_ACCENT};padding:16px 20px;border-radius:0 8px 8px 0;">
          <p style="margin:0;font-size:14px;color:${COLOR_TEXT_MUTED};">Application number</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:${COLOR_PRIMARY};letter-spacing:0.05em;">${escapeHtml(applicationNumber)}</p>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:15px;color:${COLOR_TEXT};">
      We will notify you about the next steps. You can check your application status using this number.
    </p>
  `;

  return renderBaseEmailLayout({
    logoBlock,
    title: 'Application received',
    bodyContent,
    brandName,
    colors: LAYOUT_COLORS,
  });
}
