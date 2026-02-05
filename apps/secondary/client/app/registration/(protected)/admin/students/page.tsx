'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  TableSkeleton,
  toast,
} from '@arabiaaislamia/ui';
import { fetchStudents, type Student } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { privateRoutes } from '@/constants/route';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
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
      <p className="text-slate-400 text-sm">All approved students (converted from applications).</p>
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
        {!loading && !error && students.length === 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10">
            <CardContent className="py-16 text-center text-slate-300">
              No students yet. Fully approve an application to create a student.
            </CardContent>
          </Card>
        )}
        {!loading && !error && students.length > 0 && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10 overflow-hidden w-full min-w-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-slate-200">Roll #</TableHead>
                    <TableHead className="text-slate-200">Name</TableHead>
                    <TableHead className="text-slate-200">Guardian</TableHead>
                    <TableHead className="text-slate-200">Contact</TableHead>
                    <TableHead className="text-slate-200">Created</TableHead>
                    <TableHead className="text-right text-slate-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-mono font-medium text-white">{s.rollNumber ?? '—'}</TableCell>
                      <TableCell className="text-slate-200">{s.name}</TableCell>
                      <TableCell className="text-slate-200">{s.guardianName ?? '—'}</TableCell>
                      <TableCell className="text-slate-200">{s.contact ?? '—'}</TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={privateRoutes.studentDetail(s.id)}>View</Link>
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
