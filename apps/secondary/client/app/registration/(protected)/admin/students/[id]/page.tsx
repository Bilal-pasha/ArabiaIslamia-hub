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
  toast,
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

function Row({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  if (value == null || value === '') return null;
  const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="flex flex-col sm:flex-row sm:gap-2 gap-0.5 min-w-0">
      <span className="text-slate-400 shrink-0 sm:w-44 text-sm">{label}:</span>
      <span className="text-slate-200 break-words">{display}</span>
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
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
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
        <Button variant="outline" onClick={() => router.back()} className="hover:border-amber-400/50 hover:text-amber-300">Go Back</Button>
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
        <Button variant="outline" size="sm" asChild className="w-fit hover:border-amber-400/50 hover:text-amber-300">
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
            <Row label="Photo (file)" value={student.photo ?? null} />
            <Row label="Roll Number" value={student.rollNumber} />
            <Row label="Created" value={student.createdAt} />
            <Row label="Updated" value={student.updatedAt} />
          </CardContent>
        </Card>

        {app && (
          <>
            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application — Personal</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Application #" value={app.applicationNumber} />
                <Row label="Name" value={app.name} />
                <Row label="Father's Name" value={app.fatherName} />
                <Row label="Date of Birth" value={app.dateOfBirth} />
                <Row label="Gender" value={app.gender} />
                <Row label="Phone" value={app.phone} />
                <Row label="Email" value={app.email} />
                <Row label="ID / Passport / CRC Number" value={app.idNumber} />
              </CardContent>
            </Card>

            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application — Address</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Address" value={app.address} />
                <Row label="Permanent Address" value={app.permanentAddress} />
                <Row label="Country" value={app.country} />
                <Row label="State" value={app.state} />
                <Row label="City" value={app.city} />
                <Row label="Area" value={app.area} />
              </CardContent>
            </Card>

            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application — Guardian</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Guardian Name" value={app.guardianName} />
                <Row label="Relation" value={app.guardianRelation} />
                <Row label="Guardian Phone" value={app.guardianPhone} />
                <Row label="Guardian Email" value={app.guardianEmail} />
                <Row label="Guardian Occupation" value={app.guardianOccupation} />
                <Row label="Guardian Address" value={app.guardianAddress} />
              </CardContent>
            </Card>

            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application — Academic</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Required Class" value={app.class?.name ?? app.requiredClassId ?? '—'} />
                <Row label="Previous School" value={app.previousSchool} />
                <Row label="Previous Class" value={app.previousClass} />
                <Row label="Previous Grade" value={app.previousGrade} />
                <Row label="Language" value={app.language} />
                <Row label="Is Hafiz" value={app.isHafiz} />
                <Row label="Accommodation" value={app.accommodationType} />
              </CardContent>
            </Card>

            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Application — Status & Tests</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm">
                <Row label="Status" value={app.status} />
                <Row label="Status Reason" value={app.statusReason ?? null} />
                <Row label="Quran test passed" value={app.quranTestPassed ?? null} />
                <Row label="Quran test marks" value={app.quranTestMarks ?? null} />
                <Row label="Quran test reason" value={app.quranTestReason ?? null} />
                <Row label="Oral test marks" value={app.oralTestMarks ?? null} />
                <Row label="Oral test passed" value={app.oralTestPassed ?? null} />
                <Row label="Written admit eligible" value={app.writtenAdmitEligible ?? null} />
                <Row label="Written test passed" value={app.writtenTestPassed ?? null} />
                <Row label="Written test marks" value={app.writtenTestMarks ?? null} />
                <Row label="Written test reason" value={app.writtenTestReason ?? null} />
                <Row label="Created" value={app.createdAt} />
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
