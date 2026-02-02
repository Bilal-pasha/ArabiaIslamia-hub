'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@arabiaaislamia/ui';
import { SecondaryLogo } from '@arabiaaislamia/ui';
import {
  fetchApplication,
  getFileViewUrl,
  type AdmissionApplication,
} from '../../../../services/admission/admission.service';
import { privateRoutes } from '../../../../constants/route';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';

function FileLink({
  label,
  key,
}: {
  label: string;
  key: string | null;
}) {
  const [loading, setLoading] = useState(false);
  if (!key) return null;
  const handleClick = async () => {
    setLoading(true);
    try {
      const url = await getFileViewUrl(key);
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

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [app, setApp] = useState<AdmissionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplication(id)
      .then(setApp)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (error || !app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-destructive">{error || 'Application not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-amber-50/10"
    >
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2744] to-[#1e4a6f] p-1.5 shadow-md">
                <SecondaryLogo width={40} height={40} className="rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">{app.name} — {app.applicationNumber}</h1>
                <p className="text-muted-foreground text-xs">{app.status}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={privateRoutes.applications}>← All Applications</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Name" value={app.name} />
            <Row label="Father&apos;s Name" value={app.fatherName} />
            <Row label="Date of Birth" value={app.dateOfBirth} />
            <Row label="Gender" value={app.gender} />
            <Row label="Phone" value={app.phone} />
            <Row label="Email" value={app.email} />
            <Row label="ID Number" value={app.idNumber} />
            <Row label="Address" value={app.address} />
            <Row label="Permanent Address" value={app.permanentAddress} />
            <Row label="Country" value={app.country} />
            <Row label="State" value={app.state} />
            <Row label="City" value={app.city} />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Name" value={app.guardianName} />
            <Row label="Relation" value={app.guardianRelation} />
            <Row label="Phone" value={app.guardianPhone} />
            <Row label="Email" value={app.guardianEmail} />
            <Row label="Occupation" value={app.guardianOccupation} />
            <Row label="Address" value={app.guardianAddress} />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Required Class" value={app.requiredClass} />
            <Row label="Previous School" value={app.previousSchool} />
            <Row label="Previous Class" value={app.previousClass} />
            <Row label="Previous Grade" value={app.previousGrade} />
            <Row label="Is Hafiz" value={app.isHafiz} />
            <Row label="Accommodation" value={app.accommodationType} />
            <Row label="Madhab" value={app.madhab} />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <FileLink label="Photo" key={app.photoFileKey} />
            <FileLink label="ID / Passport" key={app.idFileKey} />
            <FileLink label="Authority Letter" key={app.authorityLetterFileKey} />
            <FileLink label="Previous Result" key={app.previousResultFileKey} />
          </CardContent>
        </Card>
      </main>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground shrink-0 w-36">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
