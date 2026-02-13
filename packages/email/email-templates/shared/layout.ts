/**
 * Shared base layout for branded emails: header with logo, content area, footer.
 * Uses inline styles for broad email client support.
 */

import { escapeHtml } from './escape-html';

export interface BaseLayoutColors {
  primary: string;
  primaryDark: string;
  bg: string;
  white: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface BaseLayoutOptions {
  /** Pre-rendered logo block (img or text). */
  logoBlock: string;
  /** Page title (e.g. for <title> and accessibility). */
  title: string;
  /** Inner HTML for the main content area. */
  bodyContent: string;
  /** Brand name for footer. */
  brandName: string;
  colors: BaseLayoutColors;
}

export function renderBaseEmailLayout(options: BaseLayoutOptions): string {
  const { logoBlock, title, bodyContent, brandName, colors } = options;
  const {
    primary,
    primaryDark,
    bg,
    white,
    text,
    textMuted,
    border,
  } = colors;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:${text};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:${white};border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%);padding:32px 40px;text-align:center;">
              ${logoBlock}
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;background-color:${bg};border-top:1px solid ${border};text-align:center;">
              <p style="margin:0;font-size:13px;color:${textMuted};">
                Regards,<br /><strong style="color:${primary};">${escapeHtml(brandName)} Team</strong>
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
