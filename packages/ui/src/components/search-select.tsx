'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { Input } from './input';
import { Button } from './button';

export type SearchSelectOption = { value: string; label: string };

export interface SearchSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchSelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  required?: boolean;
  emptyMessage?: string;
  /** Optional id for the trigger for aria */
  id?: string;
}

export function SearchSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
  triggerClassName,
  disabled,
  required,
  emptyMessage = 'No results',
  id,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? '';

  const filtered = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  React.useEffect(() => {
    if (!open) return;
    setSearch('');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <Button
        type="button"
        id={id}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'search-select-listbox' : undefined}
        disabled={disabled}
        className={cn(
          'h-9 w-full justify-between font-normal whitespace-nowrap [&>span]:line-clamp-1',
          triggerClassName
        )}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={displayLabel ? 'text-foreground' : 'text-muted-foreground'} dir="auto">
          {displayLabel || placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div
          id="search-select-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 w-full min-w-[8rem] overflow-hidden rounded-md border border-border bg-white text-popover-foreground shadow-lg"
        >
          <div className="border-b border-border p-1.5">
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
              }}
              placeholder={placeholder}
              className="h-8 text-sm"
              dir="auto"
            />
          </div>
          <div className="max-h-48 overflow-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">{emptyMessage}</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  className={cn(
                    'w-full cursor-pointer rounded-sm py-2 px-2 text-right text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                    opt.value === value && 'bg-accent text-accent-foreground'
                  )}
                  dir="auto"
                  onClick={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
