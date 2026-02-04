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
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-slate-400 text-sm">View and manage admission applications.</p>
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href={publicRoutes.form}>← Public form</Link>
        </Button>
      </div>
      <div className="mx-auto">
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
                        <Button variant="outline" size="sm" asChild>
                          <Link href={privateRoutes.applicationDetail(app.id)}>View</Link>
                        </Button>
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
