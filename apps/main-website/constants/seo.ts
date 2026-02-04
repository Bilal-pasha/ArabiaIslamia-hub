import { SITE_URL } from './env';

export const SITE_NAME = 'Jamia Arabia Islamia';
export const SITE_DESCRIPTION =
  'Jamia Arabia Islamia – Where tradition meets innovation. Islamic education, Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia, and Scouts Colony at Scout Colony, Karachi.';

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ogImage: `${SITE_URL}/images/Logo.png`,
  locale: 'en_PK',
  twitterHandle: '@jamiaarabiaislamia',
} as const;
