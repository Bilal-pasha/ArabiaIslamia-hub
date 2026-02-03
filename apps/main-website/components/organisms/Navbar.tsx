'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/atoms';
import { NavLink, NavDropdown } from '@/components/molecules';
import { Button } from '@/components/atoms';
import { NAV_DATA } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-gradient-to-r from-amber-400 to-amber-100 px-4 py-2 shadow-lg md:px-6 lg:px-16">
      <button
        type="button"
        className="flex p-2 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <div className="flex items-center pb-1">
        <Logo className="w-[70%] sm:w-full" />
      </div>

      <ul className="hidden items-center gap-1 md:flex lg:gap-2">
        {NAV_DATA.map((item) => (
          <li key={item.text}>
            {item.links?.length ? (
              <NavDropdown item={item} />
            ) : (
              <NavLink href={item.href}>{item.text}</NavLink>
            )}
          </li>
        ))}
      </ul>

      <div className="hidden items-center gap-2 md:flex">
        <Button variant="outline" size="sm" asChild>
          <Link href="/contact">Sign in</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/contact">Sign up</Link>
        </Button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-x-0 top-[72px] z-40 h-[calc(100vh-72px)] overflow-y-auto bg-gradient-to-b from-amber-100 to-amber-50 transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col gap-2 p-6">
          {NAV_DATA.map((item) =>
            item.links?.length ? (
              <div key={item.text} className="space-y-1">
                <span className="block px-4 py-2 text-sm font-semibold text-muted-foreground">
                  {item.text}
                </span>
                {item.links.map((link) => (
                  <Link
                    key={link.href + link.text}
                    href={link.href}
                    className="block rounded-lg border border-amber-300 px-4 py-3 font-medium text-foreground hover:bg-amber-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href={item.href}
                className="rounded-lg border border-amber-300 px-4 py-3 font-semibold text-foreground hover:bg-amber-200"
                onClick={() => setMobileOpen(false)}
              >
                {item.text}
              </Link>
            )
          )}
          <div className="mt-6 flex flex-col gap-2 border-t border-amber-200 pt-6">
            <Button variant="outline" asChild>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild>
              <Link href="/contact" onClick={() => setMobileOpen(false)}>
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
