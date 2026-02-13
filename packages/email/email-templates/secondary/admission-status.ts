/**
 * Admission application status update (e.g. approved / rejected).
 * Secondary school template with logo and brand.
 */

import { renderBaseEmailLayout } from '../shared/layout';
import { escapeHtml } from '../shared/escape-html';
import {
  buildSecondaryLogoBlock,
  SECONDARY_BRAND_NAME,
  COLOR_PRIMARY,
  COLOR_WHITE,
  COLOR_BG,
  COLOR_TEXT,
  COLOR_TEXT_MUTED,
  COLOR_PRIMARY_DARK,
  COLOR_BORDER,
  COLOR_ERROR,
} from './theme';

export interface AdmissionStatusTemplateOptions {
  applicantName: string;
  applicationNumber: string;
  status: 'approved' | 'rejected';
  reason?: string;
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

export function renderAdmissionStatusEmail(options: AdmissionStatusTemplateOptions): string {
  const { applicantName, applicationNumber, status, reason, logoUrl, brandName = SECONDARY_BRAND_NAME } = options;
  const logoBlock = buildSecondaryLogoBlock({ logoUrl, brandName });
  const statusLabel = status === 'approved' ? 'approved' : 'rejected';
  const statusColor = status === 'approved' ? COLOR_PRIMARY : COLOR_ERROR;

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${statusColor};">
      Application ${statusLabel}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${COLOR_TEXT_MUTED};">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${COLOR_TEXT};">
      Your admission application (${escapeHtml(applicationNumber)}) has been <strong>${statusLabel}</strong>.
    </p>
    ${reason ? `<p style="margin:16px 0 0;font-size:15px;color:${COLOR_TEXT_MUTED};">${escapeHtml(reason)}</p>` : ''}
    <p style="margin:24px 0 0;font-size:15px;color:${COLOR_TEXT};">
      ${status === 'approved' ? 'You will receive further communication about the next steps (tests, etc.).' : 'If you have questions, please contact the administration.'}
    </p>
  `;

  return renderBaseEmailLayout({
    logoBlock,
    title: `Application ${statusLabel}`,
    bodyContent,
    brandName,
    colors: LAYOUT_COLORS,
  });
}
