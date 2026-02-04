'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavLinkItem, NavChildLink } from '@/constants/navigation';

interface NavDropdownProps {
  item: NavLinkItem;
  className?: string;
}

const CLOSE_DELAY_MS = 120;

export function NavDropdown({ item, className }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerClass = cn(
    'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all lg:px-3.5',
    className ?? 'text-foreground transition-colors hover:text-primary'
  );

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleEnter = () => {
    cancelClose();
    setOpen(true);
  };

  const handleLeave = () => {
    scheduleClose();
  };

  if (!item.links?.length) {
    return (
      <Link href={item.href} className={triggerClass}>
        {item.text}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {item.text}
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 w-48 rounded-xl border border-amber-200/90 bg-white/95 pt-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] backdrop-blur-md">
          <div className="py-1.5">
            {(item.links as NavChildLink[]).map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href + link.text}
                  href={link.href}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-amber-950/90 transition-colors hover:bg-amber-100 hover:text-amber-900"
                >
                  {Icon ? <Icon className="h-4 w-4 shrink-0 text-amber-600/90" /> : null}
                  <span>{link.text}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
