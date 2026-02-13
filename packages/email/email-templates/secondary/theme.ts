/**
 * Secondary school email theme: colors and logo block aligned with the
 * secondary logo (dark blue, light blue, orange/red-orange accents).
 */

import { escapeHtml } from '../shared/escape-html';

/** Default brand name for secondary (Jamia Arabia). */
export const SECONDARY_BRAND_NAME = 'Jamia Arabia';

/** Dark blue – primary brand (header, headings, footer). Matches logo background. */
export const COLOR_PRIMARY = '#1A237E';
/** Darker blue for header gradient. */
export const COLOR_PRIMARY_DARK = '#0D1442';
/** Light blue – accent (CTAs, info-box border). Matches logo accent. */
export const COLOR_ACCENT = '#4FC3F7';
/** Orange – secondary CTA/highlight. Matches logo warm accent. */
export const COLOR_ACCENT_ORANGE = '#FB8C00';
/** Light blue for text on dark blue header (fallback when no logo image). */
export const COLOR_HEADER_TEXT = '#81D4FA';
export const COLOR_WHITE = '#ffffff';
/** Soft blue-grey background for body and info boxes. */
export const COLOR_BG = '#f0f4f8';
export const COLOR_TEXT = '#1e293b';
export const COLOR_TEXT_MUTED = '#64748b';
export const COLOR_ERROR = '#dc2626';
export const COLOR_BORDER = '#e2e8f0';

export interface EmailBrandOptions {
  logoUrl?: string;
  brandName?: string;
}

/**
 * Build the header logo block for secondary emails.
 * Header uses dark blue; logo image or brand name in light blue for contrast.
 */
export function buildSecondaryLogoBlock(options: EmailBrandOptions): string {
  const { logoUrl, brandName = SECONDARY_BRAND_NAME } = options;
  if (logoUrl) {
    return `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(brandName)}" width="140" height="auto" style="display:block;max-width:140px;height:auto; border-radius: 10px;" />`;
  }
  return `<span style="font-size:24px;font-weight:700;color:${COLOR_HEADER_TEXT};letter-spacing:0.02em;">${escapeHtml(brandName)}</span>`;
}
