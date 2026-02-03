'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/atoms';

const FOOTER_LINKS = [
  { label: 'Faculties', href: '/faculties' },
  { label: 'About us', href: '/about' },
  { label: 'Contact us', href: '/contact' },
  { label: 'More', href: '/more' },
];

const SOCIAL_LINKS = [
  { Icon: Facebook, href: '#', label: 'Facebook' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Instagram, href: '#', label: 'Instagram' },
  { Icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer className="bg-[#915d03b5] text-[#f7f7f7]">
      <section className="px-4 shadow-lg md:px-8 lg:px-16">
        <motion.div
          ref={ref}
          className="grid gap-8 py-8 md:grid-cols-4 md:grid-rows-1"
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex flex-col items-center md:items-start">
            <Logo showUrdu className="text-[#f7f7f7]" />
          </div>
          <div className="flex flex-col justify-end gap-6 md:col-span-3 md:flex-row md:items-start">
            <ul className="flex flex-wrap justify-center gap-6 md:justify-end">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#f7f7f7] transition-colors hover:text-amber-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-center gap-4 md:justify-end">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-2xl text-[#f7f7f7] transition-colors hover:text-amber-300"
                >
                  <Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="border-t border-amber-800/50 py-4 text-center text-sm text-[#f7f7f7]/90">
          © {new Date().getFullYear()} Jamia Arabia Islamia. All rights reserved.
        </div>
      </section>
    </footer>
  );
}
