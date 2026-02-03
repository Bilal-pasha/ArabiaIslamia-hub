'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Button,
  SecondaryLogo,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@arabiaaislamia/ui';
import { fetchApplications, type AdmissionApplication } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes, privateRoutes } from '@/constants/route';

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen"
    >
      <header className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10 p-1.5 shadow-lg">
                <SecondaryLogo width={40} height={40} className="rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Admission Applications</h1>
                <p className="text-slate-300 text-xs">Secondary — Admin</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild className="border-white/20 text-slate-200 hover:bg-white/10 hover:text-white">
              <Link href={publicRoutes.form}>← Back to Form</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="size-10 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          </div>
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
          <Card className="secondary-card backdrop-blur-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-slate-200">Application #</TableHead>
                  <TableHead className="text-slate-200">Name</TableHead>
                  <TableHead className="text-slate-200">Class</TableHead>
                  <TableHead className="text-slate-200">Status</TableHead>
                  <TableHead className="text-slate-200">Created</TableHead>
                  <TableHead className="text-right text-slate-200">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-mono font-medium text-white">{app.applicationNumber}</TableCell>
                    <TableCell className="text-slate-200">{app.name}</TableCell>
                    <TableCell className="text-slate-200">{app.requiredClass}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="border-white/20 text-slate-200 hover:bg-white/10 hover:text-white">
                        <Link href={privateRoutes.applicationDetail(app.id)}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </motion.div>
  );
}
