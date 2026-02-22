'use client';

import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Spinner } from '@arabiaaislamia/ui';
import { Printer, Search } from 'lucide-react';
import type { PrintFormat } from '@/hooks/use-print-chit-page';

const FORMAT_OPTIONS: { value: PrintFormat; labelKey: string }[] = [{ value: 'a4-16', labelKey: 'books.printFormatA4_16' }];

type Props = {
  shelfNumber: string;
  onShelfChange: (v: string) => void;
  printFormat: PrintFormat;
  onFormatChange: (v: PrintFormat) => void;
  onLoad: () => void;
  onPrint: () => void;
  loading: boolean;
  hasBooks: boolean;
  t: (k: string) => string;
};

export function PrintChitToolbar(p: Props) {
  const { shelfNumber, onShelfChange, printFormat, onFormatChange, onLoad, onPrint, loading, hasBooks, t } = p;
  return (
    <div className="no-print flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end rounded-xl border border-emerald-200/60 bg-white p-5 shadow-lg shadow-emerald-900/5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="shelf">{t('books.shelfNumber')}</Label>
        <Input
          id="shelf"
          value={shelfNumber}
          onChange={(e) => onShelfChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onLoad()}
          placeholder="e.g. A1, 12"
          className="w-full sm:w-40"
          dir="auto"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t('books.printFormat')}</Label>
        <Select value={printFormat} onValueChange={(v) => onFormatChange(v as PrintFormat)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onLoad} disabled={loading} className="gap-2">
          {loading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" aria-hidden />}
          {t('books.loadBooks')}
        </Button>
        <Button onClick={onPrint} disabled={!hasBooks} variant="default" className="gap-2">
          <Printer className="h-4 w-4" aria-hidden />
          {t('books.printChit')}
        </Button>
      </div>
    </div>
  );
}
