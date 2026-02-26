'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Button,
} from '@arabiaaislamia/ui';

type Entity = { id: string; name: string };

type EditEntityModalProps = {
  open: boolean;
  item: Entity | null;
  onClose: () => void;
  onSave: (id: string, name: string) => Promise<void>;
  labelKey: string;
  t: (k: string) => string;
};

export function EditEntityModal({
  open,
  item,
  onClose,
  onSave,
  labelKey,
  t,
}: EditEntityModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item || !name.trim()) return;
    await onSave(item.id, name.trim());
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex row-reverse pb-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">{t('books.edit')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t(labelKey)}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} dir="rtl" placeholder={t(labelKey)} required className="h-9" autoFocus />
          </div>
          <div className="pt-2 border-t border-border flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
            <Button type="submit">{t('books.save')}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
