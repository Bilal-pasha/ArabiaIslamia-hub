'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Facebook, Youtube, GraduationCap, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/atoms';
import { APP_LINKS } from '@/constants/navigation';
import { SOCIAL_LINKS as SOCIAL_URLS } from '@/constants/social';

const FOOTER_NAV_LINKS = [
  { label: 'Faculties', href: '/faculties' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'More', href: '/more' },
];

const FOOTER_SOCIAL_LINKS = [
  { Icon: Facebook, href: SOCIAL_URLS.facebook, label: 'Facebook' },
  { Icon: Youtube, href: SOCIAL_URLS.youtube, label: 'YouTube' },
];


export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer className="bg-gradient-to-t from-amber-100/50 via-amber-50/90 to-emerald-50/60 border-t border-amber-200/80">
      <section className="mx-auto px-4 py-10 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          ref={ref}
          className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Left: Logo + tagline */}
          <div className="flex flex-col items-center text-center lg:max-w-xs lg:items-start lg:text-left">
            <Logo showUrdu className="text-amber-900" />
            <p className="mt-3 text-sm leading-relaxed text-amber-800/85">
              Where tradition meets innovation, and faith meets knowledge.
            </p>
          </div>

          {/* Right: Link columns */}
          <div className="flex flex-col gap-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-8 lg:flex-1 lg:justify-end lg:gap-x-12 lg:gap-y-0">
            {/* Site */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-800/90">
                Site
              </h3>
              <ul className="flex flex-col gap-2 text-center sm:text-left">
                {FOOTER_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-amber-900/90 transition-colors hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Apps */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800/90">
                <GraduationCap className="h-3.5 w-3.5" />
                Our Apps
              </h3>
              <ul className="flex flex-col gap-2 text-center sm:text-left">
                {APP_LINKS.map((app) => (
                  <li key={app.href + app.text}>
                    <a
                      href={app.href}
                      target="_blank"
                      rel={'noopener noreferrer'}
                      className="inline-flex items-center gap-1.5 text-sm text-amber-900/90 transition-colors hover:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded"
                    >
                      {app.text}
                      <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow us */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-800/90">
                Follow us
              </h3>
              <div className="flex items-center gap-2">
                {FOOTER_SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-lg p-2.5 text-amber-800/90 transition-colors hover:bg-amber-200/70 hover:text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto mt-10 border-t border-amber-200/80 pt-6 text-center text-xs text-amber-700/75">
          © {new Date().getFullYear()} Jamia Arabia Islamia. All rights reserved.
        </div>
      </section>
    </footer>
  );
}
