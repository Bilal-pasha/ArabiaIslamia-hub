'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ExternalLink, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/atoms';
import { NavLink, NavDropdown } from '@/components/molecules';
import { NAV_DATA, APP_LINKS } from '@/constants/navigation';
import type { NavChildLink } from '@/constants/navigation';
import { cn } from '@/lib/utils';

const CLOSE_DELAY_MS = 120;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isExternal = (href: string) => href.startsWith('http');

  const appsHandleEnter = () => {
    if (appsCloseTimeoutRef.current) {
      clearTimeout(appsCloseTimeoutRef.current);
      appsCloseTimeoutRef.current = null;
    }
    setAppsOpen(true);
  };

  const appsHandleLeave = () => {
    appsCloseTimeoutRef.current = setTimeout(() => setAppsOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full',
        'bg-page',
        'backdrop-blur-sm',
        'border-b border-amber-200',
        'shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)]',
        'px-3 py-1.5 sm:px-4 md:px-6 lg:px-12'
      )}
    >
      <div className="mx-auto flex px-8 md:px-12 items-center justify-between gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-amber-900 transition-all hover:bg-amber-200/80 hover:text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-8 w-8" />}
        </button>

        {/* Logo */}
        <div className="flex min-w-0 flex-1 justify-end md:justify-start">
          <Logo className="w-20 shrink-0 drop-shadow-sm sm:w-24 md:w-20" />
        </div>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-0.5 md:flex lg:gap-0.5">
          {NAV_DATA.map((item) => (
            <li key={item.text}>
              {item.links?.length ? (
                <NavDropdown item={item} className="text-amber-900 !cursor-pointer hover:bg-amber-200/80 hover:text-amber-950" />
              ) : (
                <NavLink href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-200/80 hover:text-amber-950 lg:px-3.5">
                  {item.text}
                </NavLink>
              )}
            </li>
          ))}
          {/* Our Apps dropdown */}
          <li>
            <div
              className="relative"
              onMouseEnter={appsHandleEnter}
              onMouseLeave={appsHandleLeave}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-amber-900 transition-all hover:bg-amber-200/80 hover:text-amber-950 lg:px-3.5"
                aria-expanded={appsOpen}
                aria-haspopup="true"
              >
                <GraduationCap className="h-3.5 w-3.5 text-amber-700" />
                Our Apps
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', appsOpen && 'rotate-180')} />
              </button>
              {appsOpen && (
                <div className="absolute right-0 top-full z-50 w-52 rounded-xl border border-amber-200/90 bg-white/95 pt-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] backdrop-blur-md">
                  <div className="py-1.5">
                    {APP_LINKS.map((app) => (
                      <a
                        key={app.href + app.text}
                        href={app.href}
                        target={isExternal(app.href) ? '_blank' : undefined}
                        rel={isExternal(app.href) ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-amber-950/90 transition-colors hover:bg-amber-100 hover:text-amber-900"
                      >
                        <GraduationCap className="h-4 w-4 shrink-0 text-amber-600/90" />
                        <span className="flex-1">{app.text}</span>
                        {isExternal(app.href) && <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>

        <div className="hidden w-8 md:block md:w-0" aria-hidden />
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className={cn(
            'absolute inset-0 bg-amber-950/40 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto',
            'bg-gradient-to-br from-amber-50 via-white to-amber-50/80 shadow-2xl',
            'transition-transform duration-300 ease-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col gap-1 p-4 pt-16">
            {NAV_DATA.map((item) =>
              item.links?.length ? (
                <div key={item.text} className="space-y-0.5">
                  <span className="block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700/90">
                    {item.text}
                  </span>
                  {(item.links as NavChildLink[]).map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href + link.text}
                        href={link.href}
                        className="flex items-center gap-2.5 rounded-xl border border-amber-200/80 bg-white px-4 py-2.5 text-sm font-medium text-amber-950/90 shadow-sm transition-colors hover:bg-amber-100/90 active:bg-amber-200/60"
                        onClick={() => setMobileOpen(false)}
                      >
                        {Icon ? <Icon className="h-4 w-4 shrink-0 text-amber-600" /> : null}
                        <span>{link.text}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link
                  key={item.text}
                  href={item.href}
                  className="block rounded-xl border border-amber-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-amber-950/90 shadow-sm transition-colors hover:bg-amber-100/90 active:bg-amber-200/60"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.text}
                </Link>
              )
            )}

            <div className="mt-4 space-y-0.5 border-t border-amber-200/80 pt-4">
              <span className="block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700/90">
                Our Applications
              </span>
              {APP_LINKS.map((app) => (
                <a
                  key={app.href + app.text}
                  href={app.href}
                  target={isExternal(app.href) ? '_blank' : undefined}
                  rel={isExternal(app.href) ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-2 rounded-xl border border-amber-300/80 bg-amber-50/90 px-4 py-2.5 text-sm font-medium text-amber-950/90 shadow-sm transition-colors hover:bg-amber-100 active:bg-amber-200/60"
                  onClick={() => setMobileOpen(false)}
                >
                  <GraduationCap className="h-4 w-4 shrink-0 text-amber-600" />
                  <span className="flex-1">{app.text}</span>
                  {isExternal(app.href) && <ExternalLink className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
