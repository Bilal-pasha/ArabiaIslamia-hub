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
  Input,
  Label,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DetailPageSkeleton,
} from '@arabiaaislamia/ui';
import {
  fetchApplication,
  getFileViewUrl,
  updateStatus,
  updateOralTest,
  type AdmissionApplication,
} from '@/services/admission/admission.service';
import { privateRoutes } from '@/constants/route';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';

function FileLink({
  label,
  fileKey,
}: {
  label: string;
  fileKey: string | null;
}) {
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

function getStatusVariant(status: string): 'pending' | 'approved' | 'rejected' {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [app, setApp] = useState<AdmissionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [oralMarks, setOralMarks] = useState('');
  const [oralPassed, setOralPassed] = useState<string>('');
  const [oralReason, setOralReason] = useState('');
  const [oralSubmitLoading, setOralSubmitLoading] = useState(false);

  const refetch = () => {
    fetchApplication(id)
      .then(setApp)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    refetch();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await updateStatus(id, 'approved');
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      await updateStatus(id, 'rejected', rejectReason.trim());
      setShowRejectInput(false);
      setRejectReason('');
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOralSubmit = async () => {
    const passed = oralPassed === 'yes';
    setOralSubmitLoading(true);
    try {
      await updateOralTest(id, { marks: oralMarks || undefined, passed, reason: oralReason || undefined });
      setOralMarks('');
      setOralPassed('');
      setOralReason('');
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update oral test');
    } finally {
      setOralSubmitLoading(false);
    }
  };

  if (loading && !app) {
    return (
      <div className="min-h-screen w-full min-w-0 flex justify-center p-6">
        <DetailPageSkeleton cards={5} linesPerCard={5} />
      </div>
    );
  }
  if (error && !app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-destructive">{error || 'Application not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  if (!app) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
          <span className="text-slate-300 text-sm">{app.applicationNumber}</span>
          {app.statusReason && (
            <span className="text-xs text-slate-400 truncate max-w-[200px]" title={app.statusReason}>
              {app.statusReason}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" asChild className="w-fit">
          <Link href={privateRoutes.applications}>← All applications</Link>
        </Button>
      </div>

      <div className="mx-auto max-w-4xl w-full min-w-0 space-y-6 overflow-x-hidden">
        {app.status === 'pending' && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10 border-orange-400/30">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button onClick={handleApprove} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-500">
                Approve application
              </Button>
              {!showRejectInput ? (
                <Button variant="destructive" onClick={() => setShowRejectInput(true)} disabled={actionLoading}>
                  Reject
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="max-w-xs bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}>
                      Confirm reject
                    </Button>
                    <Button variant="outline" onClick={() => { setShowRejectInput(false); setRejectReason(''); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {app.status === 'approved' && (
          <Card className="secondary-card backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Oral test</CardTitle>
              <p className="text-sm text-slate-300">Record oral test marks and result.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="oral-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                <Input
                  id="oral-marks"
                  value={oralMarks}
                  onChange={(e) => setOralMarks(e.target.value)}
                  placeholder="e.g. 85"
                  className="max-w-[120px] bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <Label className="mb-1.5 block text-slate-200">Result</Label>
                <Select value={oralPassed} onValueChange={setOralPassed}>
                  <SelectTrigger className="max-w-[180px] bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Passed</SelectItem>
                    <SelectItem value="no">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="oral-reason" className="mb-1.5 block text-slate-200">Remarks (optional)</Label>
                <Input
                  id="oral-reason"
                  value={oralReason}
                  onChange={(e) => setOralReason(e.target.value)}
                  placeholder="Optional notes"
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                />
              </div>
              <Button onClick={handleOralSubmit} disabled={!oralPassed || oralSubmitLoading} className="bg-orange-500 hover:bg-orange-600">
                {oralSubmitLoading ? 'Saving...' : 'Save oral test result'}
              </Button>
              {(app.oralTestPassed !== null || app.oralTestMarks) && (
                <p className="text-sm text-slate-400">
                  Current: {app.oralTestMarks ?? '—'} · {app.oralTestPassed === true ? 'Passed' : app.oralTestPassed === false ? 'Failed' : 'Not recorded'}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="secondary-card backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Name" value={app.name} />
            <Row label="Father's Name" value={app.fatherName} />
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
            <Row label="Area" value={app.area} />
            <Row label="Language" value={app.language} />
          </CardContent>
        </Card>

        <Card className="secondary-card backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Guardian Information</CardTitle>
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

        <Card className="secondary-card backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <Row label="Required Class" value={app.requiredClass} />
            <Row label="Previous School" value={app.previousSchool} />
            <Row label="Previous Class" value={app.previousClass} />
            <Row label="Previous Grade" value={app.previousGrade} />
            <Row label="Is Hafiz" value={app.isHafiz} />
            <Row label="Accommodation" value={app.accommodationType} />
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
      </div>
    </motion.div>
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
