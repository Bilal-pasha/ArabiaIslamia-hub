'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Badge,
  DetailPageSkeleton,
  toast,
} from '@arabiaaislamia/ui';
import {
  fetchRenewal,
  updateRenewalStatus,
  type RenewalApplicationDto,
} from '@/services/admission/admission.service';
import { privateRoutes } from '@/constants/route';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

function capitalizeStatus(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function RenewalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [renewal, setRenewal] = useState<RenewalApplicationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const refetch = () => {
    setLoading(true);
    fetchRenewal(id)
      .then(setRenewal)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetch();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await updateRenewalStatus(id, 'approved');
      refetch();
      toast.success('Renewal approved — registration created');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await updateRenewalStatus(id, 'rejected', rejectReason.trim() || undefined);
      setShowRejectInput(false);
      setRejectReason('');
      refetch();
      toast.success('Renewal rejected');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !renewal) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="space-y-6"
      >
        <DetailPageSkeleton />
      </motion.div>
    );
  }

  if (error && !renewal) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="space-y-6"
      >
        <div className="rounded-lg border border-red-400/50 bg-red-500/10 px-4 py-3 text-red-200">
          {error}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={privateRoutes.renewals}>← Back to renewals</Link>
        </Button>
      </motion.div>
    );
  }

  if (!renewal) {
    return null;
  }

  const isPending = renewal.status === 'pending';
  const canAct = isPending && !actionLoading;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={privateRoutes.renewals}>← Back to renewals</Link>
        </Button>
      </div>

      <Card className="secondary-card backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Renewal application</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={getStatusVariant(renewal.status)}>
              {capitalizeStatus(renewal.status)}
            </Badge>
            <span className="text-slate-400 text-sm">
              {new Date(renewal.createdAt).toLocaleString()}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-slate-400 text-sm font-medium">Student</p>
              <p className="text-white">{renewal.student?.name ?? '—'}</p>
              <p className="text-slate-300 text-sm">Roll: {renewal.student?.rollNumber ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Academic session</p>
              <p className="text-white">{renewal.academicSession?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Class</p>
              <p className="text-white">{renewal.class?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">Section</p>
              <p className="text-white">{renewal.section?.name ?? '—'}</p>
            </div>
          </div>
          {(renewal.contactOverride || renewal.addressOverride) && (
            <div className="border-t border-white/10 pt-4 space-y-2">
              <p className="text-slate-400 text-sm font-medium">Overrides</p>
              {renewal.contactOverride && (
                <p className="text-slate-200 text-sm">Contact: {renewal.contactOverride}</p>
              )}
              {renewal.addressOverride && (
                <p className="text-slate-200 text-sm">Address: {renewal.addressOverride}</p>
              )}
            </div>
          )}
          {renewal.statusReason && (
            <div className="border-t border-white/10 pt-4">
              <p className="text-slate-400 text-sm font-medium">Status reason</p>
              <p className="text-slate-200 text-sm">{renewal.statusReason}</p>
            </div>
          )}

          {isPending && (
            <div className="border-t border-white/10 pt-6 flex flex-wrap gap-3">
              <Button
                onClick={handleApprove}
                disabled={!canAct}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </Button>
              {!showRejectInput ? (
                <Button
                  variant="outline"
                  onClick={() => setShowRejectInput(true)}
                  disabled={!canAct}
                >
                  Reject
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="reject-reason" className="sr-only">Reason (optional)</Label>
                    <Input
                      id="reject-reason"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Reason (optional)"
                      className="h-9 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={!canAct}
                  >
                    Confirm reject
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
