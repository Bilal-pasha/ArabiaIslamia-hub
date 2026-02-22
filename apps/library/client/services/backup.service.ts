import { api } from '@/lib/api';

export interface BackupResult {
  key: string;
  size: number;
}

export const backupService = {
  run: () => api.post<BackupResult>('/api/backup/run'),
};
