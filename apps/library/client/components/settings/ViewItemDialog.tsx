'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@arabiaaislamia/ui';

type ViewItem = { type: 'author' | 'category' | 'nashir'; name: string; id: string } | null;

type Props = {
  viewItem: ViewItem;
  onClose: () => void;
  t: (k: string) => string;
};

export function ViewItemDialog({ viewItem, onClose, t }: Props) {
  const titleKey = viewItem?.type === 'author' ? 'settings.authorName' : viewItem?.type === 'category' ? 'settings.categoryName' : 'settings.nashirName';
  return (
    <Dialog open={!!viewItem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
        </DialogHeader>
        {viewItem && (
          <div className="space-y-2 py-2">
            <p className="text-foreground font-medium" dir="rtl">
              {viewItem.name}
            </p>
            <p className="text-muted-foreground text-xs font-mono">{viewItem.id}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
