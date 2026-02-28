import { SITE_URL } from './env';

export const SITE_NAME = 'Jamia Arabia Islamia';
export const SITE_DESCRIPTION =
  'Jamia Arabia Islamia in Scout Colony, Karachi offers Islamic education including Tahfeez ul Quran, Darse Nizami, Mahad ul Arabia, and academic programs focused on traditional and modern learning.';

export const SEO_DEFAULTS = {
  siteName: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  ogImage: `${SITE_URL}/images/Logo.png`,
  locale: 'en_PK',
  twitterHandle: '@jamiaarabiaislamia',
  logo: '/images/Logo.png',
} as const;
