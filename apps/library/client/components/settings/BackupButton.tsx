'use client';

import { useState } from 'react';
import { Button } from '@arabiaaislamia/ui';
import { Database, Loader2 } from 'lucide-react';
import { backupService } from '@/services';

type Props = { t: (k: string) => string };

export function BackupButton({ t }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleBackup = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await backupService.run();
      setMessage(t('settings.backupSuccess') + ` (${data.key})`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const errMsg = axiosErr.response?.data?.message || axiosErr.message || String(err);
      setMessage(t('settings.backupError') + ': ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleBackup} disabled={loading} variant="outline" size="sm">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Database className="h-4 w-4" />
        )}
        <span className="ml-2">{loading ? t('settings.backupRunning') : t('settings.backupNow')}</span>
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
