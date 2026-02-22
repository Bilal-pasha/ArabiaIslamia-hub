import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from '@arabiaaislamia/ui';
import { Printer } from 'lucide-react';

type PrintChitsModalProps = {
  open: boolean;
  onClose: () => void;
  category: string;
  onCategoryChange: (v: string) => void;
  shelfNumber: string;
  onShelfNumberChange: (v: string) => void;
  loading: boolean;
  onPrint: () => void;
  t: (k: string) => string;
};

export function PrintChitsModal(props: PrintChitsModalProps) {
  const { open, onClose, category, onCategoryChange, shelfNumber, onShelfNumberChange, loading, onPrint, t } = props;
  const canPrint = category === 'shelf' && shelfNumber.trim().length > 0;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('books.printAllChits')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label>{t('books.printCategory')}</Label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-9 bg-white">
                <SelectValue placeholder={t('books.selectPrintCategory')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="shelf">{t('books.printByShelf')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {category === 'shelf' && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="print-shelf">{t('books.shelfNumber')}</Label>
              <Input id="print-shelf" value={shelfNumber} onChange={(e) => onShelfNumberChange(e.target.value)} placeholder="e.g. A1, 12" dir="auto" className="h-9" />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
            <Button onClick={onPrint} disabled={!canPrint || loading} className="gap-2">
              {loading ? <Spinner className="h-4 w-4" /> : <Printer className="h-4 w-4" aria-hidden />}
              {t('books.printChit')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
