/**
 * Invite admin email with set-password link.
 * Secondary school template with logo and brand.
 */

import { renderBaseEmailLayout } from '../shared/layout';
import { escapeHtml } from '../shared/escape-html';
import {
  buildSecondaryLogoBlock,
  SECONDARY_BRAND_NAME,
  COLOR_PRIMARY,
  COLOR_ACCENT_ORANGE,
  COLOR_WHITE,
  COLOR_BG,
  COLOR_TEXT,
  COLOR_TEXT_MUTED,
  COLOR_PRIMARY_DARK,
  COLOR_BORDER,
} from './theme';

export interface InviteAdminSetPasswordTemplateOptions {
  name: string;
  setPasswordUrl: string;
  logoUrl?: string;
  brandName?: string;
  expiresInDays?: number;
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

export function renderInviteAdminSetPasswordEmail(options: InviteAdminSetPasswordTemplateOptions): string {
  const { name, setPasswordUrl, logoUrl, brandName = SECONDARY_BRAND_NAME, expiresInDays = 7 } = options;
  const logoBlock = buildSecondaryLogoBlock({ logoUrl, brandName });

  const bodyContent = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${COLOR_PRIMARY};">
      You're invited, ${escapeHtml(name)}
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${COLOR_TEXT_MUTED};">
      You have been invited to join as an admin. Click the button below to set your password and activate your account.
    </p>
    <p style="margin:0 0 24px;text-align:center;">
      <a href="${escapeHtml(setPasswordUrl)}" style="display:inline-block;background:${COLOR_ACCENT_ORANGE};color:${COLOR_WHITE};padding:14px 28px;text-decoration:none;font-weight:600;border-radius:8px;font-size:16px;">Set your password</a>
    </p>
    <p style="margin:0;font-size:13px;color:${COLOR_TEXT_MUTED};">
      This link expires in ${expiresInDays} days. If you did not expect this email, you can ignore it.
    </p>
  `;

  return renderBaseEmailLayout({
    logoBlock,
    title: 'Set your password',
    bodyContent,
    brandName,
    colors: LAYOUT_COLORS,
  });
}
