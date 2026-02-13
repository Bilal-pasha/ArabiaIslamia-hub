'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  TableSkeleton,
  toast,
} from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { apiClient } from '@/utils/axios-instance';
import { privateRoutes } from '@/constants/route';

interface EmailLogRow {
  id: string;
  to: string;
  recipientName: string | null;
  subject: string;
  status: string;
  errorMessage: string | null;
  context: string | null;
  createdAt: string;
}

export default function EmailLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<EmailLogRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const limit = 20;

  const fetchLogs = () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statusFilter) params.set('status', statusFilter);
    apiClient
      .get<{ data: { logs: EmailLogRow[]; total: number } }>(`/api/email-logs?${params}`)
      .then((res) => {
        setLogs(res.data.data.logs);
        setTotal(res.data.data.total);
      })
      .catch((err) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) router.replace(privateRoutes.dashboard);
        else {
          const msg = err instanceof Error ? err.message : 'Failed to load';
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page, statusFilter]);

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Email logs</h2>
          <p className="text-slate-400 text-sm">All sent and failed emails for debugging.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-md border border-white/20 bg-white/5 text-white px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <Card className="secondary-card border border-white/10 backdrop-blur-xl overflow-hidden">
        {loading ? (
          <TableSkeleton numberOfRows={8} className="border-0" />
        ) : error ? (
          <CardContent className="py-8">
            <p className="text-red-300">{error}</p>
          </CardContent>
        ) : logs.length === 0 ? (
          <CardContent className="py-16 text-center text-slate-400">
            No email logs found.
          </CardContent>
        ) : (
          <>
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white">Logs ({total})</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-slate-200">Date</TableHead>
                    <TableHead className="text-slate-200">To</TableHead>
                    <TableHead className="text-slate-200">Name</TableHead>
                    <TableHead className="text-slate-200">Subject</TableHead>
                    <TableHead className="text-slate-200">Context</TableHead>
                    <TableHead className="text-slate-200">Status</TableHead>
                    <TableHead className="text-slate-200">Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm max-w-[180px] truncate" title={log.to}>
                        {log.to}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm max-w-[120px] truncate">
                        {log.recipientName ?? '—'}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm max-w-[200px] truncate" title={log.subject}>
                        {log.subject}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {log.context ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={log.status === 'success' ? 'approved' : 'rejected'}
                          className="capitalize"
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-red-300 text-xs max-w-[220px] truncate" title={log.errorMessage ?? ''}>
                        {log.errorMessage ?? '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
                <p className="text-slate-400 text-sm">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="border-white/20 text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="border-white/20 text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </motion.div>
  );
}
