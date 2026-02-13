/**
 * Admission step email (Quran / Oral / Written test) with optional admit card link.
 * Secondary school template with logo and brand.
 */

import { renderBaseEmailLayout } from '../shared/layout';
import { escapeHtml } from '../shared/escape-html';
import {
  buildSecondaryLogoBlock,
  SECONDARY_BRAND_NAME,
  COLOR_PRIMARY,
  COLOR_ACCENT,
  COLOR_ACCENT_ORANGE,
  COLOR_WHITE,
  COLOR_BG,
  COLOR_TEXT,
  COLOR_TEXT_MUTED,
  COLOR_PRIMARY_DARK,
  COLOR_BORDER,
} from './theme';

export interface AdmissionStepAdmitTemplateOptions {
  applicantName: string;
  applicationNumber: string;
  stepName: string;
  stepDescription: string;
  admitCardUrl?: string;
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

export function renderAdmissionStepAdmitEmail(options: AdmissionStepAdmitTemplateOptions): string {
  const { applicantName, applicationNumber, stepName, stepDescription, admitCardUrl, logoUrl, brandName = SECONDARY_BRAND_NAME } = options;
  const logoBlock = buildSecondaryLogoBlock({ logoUrl, brandName });

  const admitBlock = admitCardUrl
    ? `
    <p style="margin:24px 0 16px;font-size:15px;color:${COLOR_TEXT};">
      Download your admit card using the link below. Bring a printed copy and valid ID on the day of the test.
    </p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="${escapeHtml(admitCardUrl)}" style="display:inline-block;background:${COLOR_ACCENT_ORANGE};color:${COLOR_WHITE};padding:14px 28px;text-decoration:none;font-weight:600;border-radius:8px;font-size:16px;">Download admit card</a>
    </p>`
    : '';

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLOR_PRIMARY};">
      ${escapeHtml(stepName)}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${COLOR_TEXT_MUTED};">
      Dear ${escapeHtml(applicantName)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;color:${COLOR_TEXT};">
      ${escapeHtml(stepDescription)}
    </p>
    <p style="margin:0;font-size:14px;color:${COLOR_TEXT_MUTED};">
      Application number: <strong>${escapeHtml(applicationNumber)}</strong>
    </p>
    ${admitBlock}
    <p style="margin:24px 0 0;font-size:15px;color:${COLOR_TEXT};">
      If you have any questions, please contact the administration.
    </p>
  `;

  return renderBaseEmailLayout({
    logoBlock,
    title: stepName,
    bodyContent,
    brandName,
    colors: LAYOUT_COLORS,
  });
}
