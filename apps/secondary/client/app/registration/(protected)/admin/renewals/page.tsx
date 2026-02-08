'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
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
import { fetchRenewals, type RenewalApplicationDto } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes, privateRoutes } from '@/constants/route';
import { Eye } from 'lucide-react';

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

function capitalizeStatus(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function AdminRenewalsPage() {
  const [renewals, setRenewals] = useState<RenewalApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRenewals()
      .then(setRenewals)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-slate-400 text-sm">View and manage renewal applications.</p>
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href={publicRoutes.renew}>← Public renewal form</Link>
        </Button>
      </div>
      <div className="mx-auto w-full min-w-0">
        {loading && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10 overflow-hidden w-full min-w-0">
            <TableSkeleton numberOfRows={8} />
          </Card>
        )}
        {error && (
          <div className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </div>
        )}
        {!loading && !error && renewals.length === 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10">
            <CardContent className="py-16 text-center text-slate-300">
              No renewal applications yet.
            </CardContent>
          </Card>
        )}
        {!loading && !error && renewals.length > 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10 overflow-hidden w-full min-w-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-slate-200">Student</TableHead>
                    <TableHead className="text-slate-200">Roll #</TableHead>
                    <TableHead className="text-slate-200">Session</TableHead>
                    <TableHead className="text-slate-200">Class</TableHead>
                    <TableHead className="text-slate-200">Section</TableHead>
                    <TableHead className="text-slate-200">Status</TableHead>
                    <TableHead className="text-slate-200">Created</TableHead>
                    <TableHead className="text-right text-slate-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewals.map((r) => (
                    <TableRow key={r.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{r.student?.name ?? '—'}</TableCell>
                      <TableCell className="font-mono text-slate-200">{r.student?.rollNumber ?? '—'}</TableCell>
                      <TableCell className="text-slate-200">{r.academicSession?.name ?? '—'}</TableCell>
                      <TableCell className="text-slate-200">{r.class?.name ?? '—'}</TableCell>
                      <TableCell className="text-slate-200">{r.section?.name ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(r.status)}>{capitalizeStatus(r.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={privateRoutes.renewalDetail(r.id)} className="flex text-white focus:bg-white/10 focus:text-white items-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
