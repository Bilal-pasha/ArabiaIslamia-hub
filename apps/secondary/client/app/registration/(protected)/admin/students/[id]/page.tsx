'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  DetailPageSkeleton,
} from '@arabiaaislamia/ui';
import { fetchStudent, getFileViewUrl, type Student } from '@/services/admission/admission.service';
import { privateRoutes } from '@/constants/route';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';

function FileLink({ label, fileKey }: { label: string; fileKey: string | null }) {
  const [loading, setLoading] = useState(false);
  if (!fileKey) return null;
  const handleClick = async () => {
    setLoading(true);
    try {
      const url = await getFileViewUrl(fileKey);
      window.open(url, '_blank');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? 'Opening...' : `View ${label}`}
    </Button>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 gap-0.5 min-w-0">
      <span className="text-slate-400 shrink-0 sm:w-36 text-sm">{label}:</span>
      <span className="text-slate-200 break-words">{value}</span>
    </div>
  );
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudent(id)
      .then(setStudent)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !student) {
    return (
      <div className="min-h-screen w-full min-w-0 flex justify-center p-6">
        <DetailPageSkeleton cards={5} linesPerCard={5} />
      </div>
    );
  }
  if (error && !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-destructive">{error || 'Student not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  if (!student) return null;

  const app = student.admissionApplication;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-slate-300 text-sm font-mono">{student.rollNumber ?? student.id}</span>
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href={privateRoutes.students}>← All students</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl w-full min-w-0 space-y-6 overflow-x-hidden">
        <Card className="secondary-card backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Student</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Name" value={student.name} />
            <Row label="Date of Birth" value={student.dateOfBirth} />
            <Row label="Gender" value={student.gender} />
            <Row label="Guardian" value={student.guardianName} />
            <Row label="Contact" value={student.contact} />
            <Row label="Address" value={student.address} />
          </CardContent>
        </Card>

        {app && (
          <>
            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application (from admission)</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Application #" value={app.applicationNumber} />
                <Row label="Name" value={app.name} />
                <Row label="Father's Name" value={app.fatherName} />
                <Row label="Phone" value={app.phone} />
                <Row label="Email" value={app.email} />
                <Row label="Country" value={app.country} />
                <Row label="State" value={app.state} />
                <Row label="City" value={app.city} />
                <Row label="Required Class" value={app.requiredClass} />
              </CardContent>
            </Card>

            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Documents</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <FileLink label="Photo" fileKey={app.photoFileKey} />
                <FileLink label="ID / Passport / CRC" fileKey={app.idFileKey} />
                <FileLink label="Authority Letter" fileKey={app.authorityLetterFileKey} />
                <FileLink label="Previous Result" fileKey={app.previousResultFileKey} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </motion.div>
  );
}
