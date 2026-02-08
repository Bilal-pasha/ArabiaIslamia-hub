'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { fetchStudents, deleteStudent, type Student } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { privateRoutes } from '@/constants/route';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadStudents = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchStudents()
      .then(setStudents)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const handleDeleteClick = (s: Student) => {
    setStudentToDelete(s);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    setDeleting(true);
    try {
      await deleteStudent(studentToDelete.id);
      toast.success('Student deleted.');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      loadStudents();
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
                    <TableHead className="w-[60px] text-right text-slate-200">Actions</TableHead>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white" aria-label="Actions">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-slate-900 border-white/10">
                            <DropdownMenuItem asChild>
                              <Link href={privateRoutes.studentDetail(s.id)} className="flex text-white focus:bg-white/10 items-center gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-300 focus:text-red-200 focus:bg-red-500/20"
                              onSelect={() => handleDeleteClick(s)}
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
            <AlertDialogTitle>Delete student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {studentToDelete?.name} (Roll: {studentToDelete?.rollNumber ?? '—'})
              and all related data: registrations, renewals, fee records, and uploaded files. This cannot be undone.
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
