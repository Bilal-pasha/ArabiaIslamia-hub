'use client';

import { useCallback, useEffect, useState } from 'react';
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
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@arabiaaislamia/ui';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { fetchApplications, deleteApplication, type AdmissionApplication } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes, privateRoutes } from '@/constants/route';

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved' || status === 'student') return 'approved';
  if (status === 'rejected' || status === 'quran_test_failed') return 'rejected';
  return 'pending';
}

function capitalizeStatus(s: string): string {
  if (!s) return s;
  const lower = s.replace(/_/g, ' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1).toLowerCase();
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AdmissionApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadApplications = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchApplications()
      .then(setApplications)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleDeleteClick = (app: AdmissionApplication) => {
    setAppToDelete(app);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    setDeleting(true);
    try {
      await deleteApplication(appToDelete.id);
      toast.success('Application deleted.');
      setDeleteDialogOpen(false);
      setAppToDelete(null);
      loadApplications();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-slate-400 text-sm">View and manage admission applications.</p>
        <Button variant="outline" size="sm" asChild className="w-fit hover:border-amber-400/50 hover:text-amber-300">
          <Link href={publicRoutes.form}>← Public form</Link>
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
        {!loading && !error && applications.length === 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10">
            <CardContent className="py-16 text-center text-slate-300">
              No applications yet.
            </CardContent>
          </Card>
        )}
        {!loading && !error && applications.length > 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10 overflow-hidden w-full min-w-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-slate-200">Application #</TableHead>
                    <TableHead className="text-slate-200">Name</TableHead>
                    <TableHead className="text-slate-200">Class</TableHead>
                    <TableHead className="text-slate-200">Status</TableHead>
                    <TableHead className="text-slate-200">Created</TableHead>
                    <TableHead className="w-[60px] text-right text-slate-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-mono font-medium text-white">{app.applicationNumber}</TableCell>
                      <TableCell className="text-slate-200">{app.name}</TableCell>
                      <TableCell className="text-slate-200">{app.class?.name ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(app.status)}>{capitalizeStatus(app.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white" aria-label="Actions">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-slate-900 border-white/10">
                            <DropdownMenuItem asChild>
                              <Link href={privateRoutes.applicationDetail(app.id)} className="flex text-white focus:bg-white/10 items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-300 focus:text-red-200 focus:bg-red-500/20"
                              onSelect={() => handleDeleteClick(app)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the application for {appToDelete?.name} ({appToDelete?.applicationNumber})
              and all attached files. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
