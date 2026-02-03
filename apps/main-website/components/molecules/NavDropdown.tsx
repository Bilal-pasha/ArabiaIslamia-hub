'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavLinkItem } from '@/constants/navigation';

interface NavDropdownProps {
  item: NavLinkItem;
}

export function NavDropdown({ item }: NavDropdownProps) {
  const [open, setOpen] = useState(false);

  if (!item.links?.length) {
    return (
      <Link
        href={item.href}
        className="rounded-lg px-4 py-2 text-base font-semibold text-foreground transition-colors hover:text-primary"
      >
        {item.text}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 rounded-lg px-4 py-2 text-base font-semibold text-foreground transition-colors hover:text-primary'
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.text}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-background py-2 shadow-lg">
          {item.links.map((link) => (
            <Link
              key={link.href + link.text}
              href={link.href}
              className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {link.text}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
