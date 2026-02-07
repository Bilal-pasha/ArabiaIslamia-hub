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
  toast,
} from '@arabiaaislamia/ui';
import {
  fetchApplication,
  getFileViewUrl,
  updateStatus,
  updateQuranTest,
  updateOralTest,
  updateWrittenTest,
  setWrittenAdmitEligible,
  fullyApprove,
  type AdmissionApplication,
} from '@/services/admission/admission.service';
import { privateRoutes } from '@/constants/route';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { Printer } from 'lucide-react';

function capitalizeStatus(s: string): string {
  if (!s) return s;
  const lower = s.replace(/_/g, ' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1).toLowerCase();
}

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
  if (status === 'approved' || status === 'student') return 'approved';
  if (status === 'rejected' || status === 'quran_test_failed') return 'rejected';
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
  const [quranMarks, setQuranMarks] = useState('');
  const [quranPassed, setQuranPassed] = useState<string>('');
  const [quranReason, setQuranReason] = useState('');
  const [quranSubmitLoading, setQuranSubmitLoading] = useState(false);
  const [oralMarks, setOralMarks] = useState('');
  const [oralPassed, setOralPassed] = useState<string>('');
  const [oralReason, setOralReason] = useState('');
  const [oralSubmitLoading, setOralSubmitLoading] = useState(false);
  const [writtenMarks, setWrittenMarks] = useState('');
  const [writtenPassed, setWrittenPassed] = useState<string>('');
  const [writtenReason, setWrittenReason] = useState('');
  const [writtenSubmitLoading, setWrittenSubmitLoading] = useState(false);
  const [writtenEligibleLoading, setWrittenEligibleLoading] = useState(false);
  const [fullyApproveLoading, setFullyApproveLoading] = useState(false);
  const [editQuran, setEditQuran] = useState(false);
  const [editOral, setEditOral] = useState(false);
  const [editWritten, setEditWritten] = useState(false);

  const refetch = () => {
    fetchApplication(id)
      .then(setApp)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : 'Failed to load';
        setError(msg);
        toast.error(msg);
      })
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
      toast.success('Application approved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setActionLoading(true);
    try {
      await updateStatus(id, 'rejected', reason);
      setShowRejectInput(false);
      setRejectReason('');
      refetch();
      toast.success('Application rejected');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update';
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const startEditQuran = () => {
    setQuranMarks(app?.quranTestMarks ?? '');
    setQuranPassed(app?.quranTestPassed === true ? 'yes' : app?.quranTestPassed === false ? 'no' : '');
    setQuranReason(app?.quranTestReason ?? '');
    setEditQuran(true);
  };
  const startEditOral = () => {
    setOralMarks(app?.oralTestMarks ?? '');
    setOralPassed(app?.oralTestPassed === true ? 'yes' : app?.oralTestPassed === false ? 'no' : '');
    setOralReason('');
    setEditOral(true);
  };
  const startEditWritten = () => {
    setWrittenMarks(app?.writtenTestMarks ?? '');
    setWrittenPassed(app?.writtenTestPassed === true ? 'yes' : app?.writtenTestPassed === false ? 'no' : '');
    setWrittenReason(app?.writtenTestReason ?? '');
    setEditWritten(true);
  };

  const handleQuranSubmit = async () => {
    const passed = quranPassed === 'yes';
    setQuranSubmitLoading(true);
    try {
      await updateQuranTest(id, { marks: quranMarks || undefined, passed, reason: quranReason || undefined });
      setQuranMarks('');
      setQuranPassed('');
      setQuranReason('');
      setEditQuran(false);
      refetch();
      toast.success('Quran test result saved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update Quran test';
      setError(msg);
      toast.error(msg);
    } finally {
      setQuranSubmitLoading(false);
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
      setEditOral(false);
      refetch();
      toast.success('Oral test result saved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update oral test';
      setError(msg);
      toast.error(msg);
    } finally {
      setOralSubmitLoading(false);
    }
  };

  const handleWrittenEligible = async () => {
    setWrittenEligibleLoading(true);
    try {
      await setWrittenAdmitEligible(id);
      refetch();
      toast.success('Written admit eligibility set');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to set written eligible';
      setError(msg);
      toast.error(msg);
    } finally {
      setWrittenEligibleLoading(false);
    }
  };

  const handleWrittenSubmit = async () => {
    const passed = writtenPassed === 'yes';
    setWrittenSubmitLoading(true);
    try {
      await updateWrittenTest(id, { marks: writtenMarks || undefined, passed, reason: writtenReason || undefined });
      setWrittenMarks('');
      setWrittenPassed('');
      setWrittenReason('');
      setEditWritten(false);
      refetch();
      toast.success('Written test result saved');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update written test';
      setError(msg);
      toast.error(msg);
    } finally {
      setWrittenSubmitLoading(false);
    }
  };

  const handleFullyApprove = async () => {
    setFullyApproveLoading(true);
    try {
      await fullyApprove(id);
      refetch();
      toast.success('Admission complete — student created');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fully approve';
      setError(msg);
      toast.error(msg);
    } finally {
      setFullyApproveLoading(false);
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
        <Button variant="outline" onClick={() => router.back()} className="hover:border-amber-400/50 hover:text-amber-300">Go Back</Button>
      </div>
    );
  }
  if (!app) return null;

  const handlePrint = () => window.print();

  return (
    <>
      {/* Screen content — hidden when printing */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="space-y-6 print:hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={getStatusVariant(app.status)}>{capitalizeStatus(app.status)}</Badge>
            <span className="text-slate-300 text-sm">{app.applicationNumber}</span>
            {app.statusReason && (
              <span className="text-xs text-slate-400 truncate max-w-[200px]" title={app.statusReason}>
                {app.statusReason}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="w-fit inline-flex items-center gap-2 hover:border-amber-400/50 hover:text-amber-300">
              <Printer className="size-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" asChild className="w-fit hover:border-amber-400/50 hover:text-amber-300">
              <Link href={privateRoutes.applications}>← All applications</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-4xl w-full min-w-0 space-y-6 overflow-x-hidden">
          {/* Reject application — available anytime (except already rejected or student) */}
          {app.status !== 'rejected' && app.status !== 'student' && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10 border-red-400/20">
              <CardHeader>
                <CardTitle className="text-white">Reject application</CardTitle>
                <p className="text-sm text-slate-300">You can reject this application at any time. A reason is required.</p>
              </CardHeader>
              <CardContent>
                {!showRejectInput ? (
                  <Button variant="destructive" onClick={() => setShowRejectInput(true)} disabled={actionLoading}>
                    Reject application
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2 max-w-md">
                    <Label htmlFor="reject-reason" className="text-slate-200">Reason for rejection (required)</Label>
                    <Input
                      id="reject-reason"
                      placeholder="Enter reason for rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                    />
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim() || actionLoading}>
                        {actionLoading ? 'Rejecting...' : 'Confirm reject'}
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

          {/* Test results summary — show all submitted results + edit */}
          <Card className="secondary-card backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Test results</CardTitle>
              <p className="text-sm text-slate-300">Submitted results. Use Edit to change any result.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quran test */}
              <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-200">Quran test</span>
                  {app.quranTestPassed !== null && app.quranTestPassed !== undefined ? (
                    <span className="text-sm text-slate-300">
                      Marks: {app.quranTestMarks ?? '—'} · {app.quranTestPassed ? 'Passed' : 'Failed'}
                      {app.quranTestReason && ` · ${app.quranTestReason}`}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">Not recorded</span>
                  )}
                  {app.quranTestPassed !== null && app.quranTestPassed !== undefined && !editQuran && (
                    <Button variant="outline" size="sm" onClick={startEditQuran}>Edit</Button>
                  )}
                </div>
                {editQuran && (
                  <div className="mt-4 space-y-4 rounded-lg bg-white/5 p-4">
                    <div>
                      <Label htmlFor="edit-quran-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                      <Input id="edit-quran-marks" value={quranMarks} onChange={(e) => setQuranMarks(e.target.value)} placeholder="e.g. 85" className="max-w-[120px] bg-white/5 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-slate-200">Result</Label>
                      <Select value={quranPassed} onValueChange={setQuranPassed}>
                        <SelectTrigger className="max-w-[180px] bg-white/5 border-white/20 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Passed</SelectItem>
                          <SelectItem value="no">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-quran-reason" className="mb-1.5 block text-slate-200">Remarks (optional)</Label>
                      <Input id="edit-quran-reason" value={quranReason} onChange={(e) => setQuranReason(e.target.value)} placeholder="Optional" className="bg-white/5 border-white/20 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleQuranSubmit} disabled={!quranPassed || quranSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">Save</Button>
                      <Button variant="outline" onClick={() => setEditQuran(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              {/* Oral test */}
              <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-200">Oral test</span>
                  {app.oralTestPassed !== null && app.oralTestPassed !== undefined ? (
                    <span className="text-sm text-slate-300">Marks: {app.oralTestMarks ?? '—'} · {app.oralTestPassed ? 'Passed' : 'Failed'}</span>
                  ) : (
                    <span className="text-sm text-slate-500">Not recorded</span>
                  )}
                  {app.oralTestPassed !== null && app.oralTestPassed !== undefined && !editOral && (
                    <Button variant="outline" size="sm" onClick={startEditOral}>Edit</Button>
                  )}
                </div>
                {editOral && (
                  <div className="mt-4 space-y-4 rounded-lg bg-white/5 p-4">
                    <div>
                      <Label htmlFor="edit-oral-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                      <Input id="edit-oral-marks" value={oralMarks} onChange={(e) => setOralMarks(e.target.value)} placeholder="e.g. 85" className="max-w-[120px] bg-white/5 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-slate-200">Result</Label>
                      <Select value={oralPassed} onValueChange={setOralPassed}>
                        <SelectTrigger className="max-w-[180px] bg-white/5 border-white/20 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Passed</SelectItem>
                          <SelectItem value="no">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleOralSubmit} disabled={!oralPassed || oralSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">Save</Button>
                      <Button variant="outline" onClick={() => setEditOral(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              {/* Written test */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-200">Written test</span>
                  {app.writtenTestPassed !== null && app.writtenTestPassed !== undefined ? (
                    <span className="text-sm text-slate-300">
                      Marks: {app.writtenTestMarks ?? '—'} · {app.writtenTestPassed ? 'Passed' : 'Failed'}
                      {app.writtenTestReason && ` · ${app.writtenTestReason}`}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">Not recorded</span>
                  )}
                  {app.writtenTestPassed !== null && app.writtenTestPassed !== undefined && !editWritten && (
                    <Button variant="outline" size="sm" onClick={startEditWritten}>Edit</Button>
                  )}
                </div>
                {editWritten && (
                  <div className="mt-4 space-y-4 rounded-lg bg-white/5 p-4">
                    <div>
                      <Label htmlFor="edit-written-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                      <Input id="edit-written-marks" value={writtenMarks} onChange={(e) => setWrittenMarks(e.target.value)} placeholder="e.g. 85" className="max-w-[120px] bg-white/5 border-white/20 text-white" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block text-slate-200">Result</Label>
                      <Select value={writtenPassed} onValueChange={setWrittenPassed}>
                        <SelectTrigger className="max-w-[180px] bg-white/5 border-white/20 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Passed</SelectItem>
                          <SelectItem value="no">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edit-written-reason" className="mb-1.5 block text-slate-200">Remarks (optional)</Label>
                      <Input id="edit-written-reason" value={writtenReason} onChange={(e) => setWrittenReason(e.target.value)} placeholder="Optional" className="bg-white/5 border-white/20 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleWrittenSubmit} disabled={!writtenPassed || writtenSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">Save</Button>
                      <Button variant="outline" onClick={() => setEditWritten(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {app.status === 'pending' && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10 border-orange-400/30">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
                <p className="text-sm text-slate-300">Approve to move to test stage. To reject, use Reject application above.</p>
              </CardHeader>
              <CardContent>
                <Button onClick={handleApprove} disabled={actionLoading} className="bg-emerald-600 hover:bg-emerald-500">
                  Approve application
                </Button>
              </CardContent>
            </Card>
          )}

          {app.status === 'quran_test_failed' && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10 border-destructive/30">
              <CardHeader>
                <CardTitle className="text-white">Quran test — Failed</CardTitle>
                <p className="text-sm text-slate-300">{app.statusReason ?? 'Applicant did not pass the Quran test.'}</p>
              </CardHeader>
            </Card>
          )}

          {app.status === 'approved' && app.quranTestPassed === null && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quran test</CardTitle>
                <p className="text-sm text-slate-300">Record Quran test marks and result. If failed, application will show as failed.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="quran-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                  <Input
                    id="quran-marks"
                    value={quranMarks}
                    onChange={(e) => setQuranMarks(e.target.value)}
                    placeholder="e.g. 85"
                    className="max-w-[120px] bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-slate-200">Result</Label>
                  <Select value={quranPassed} onValueChange={setQuranPassed}>
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
                  <Label htmlFor="quran-reason" className="mb-1.5 block text-slate-200">Remarks (optional)</Label>
                  <Input
                    id="quran-reason"
                    value={quranReason}
                    onChange={(e) => setQuranReason(e.target.value)}
                    placeholder="Optional notes or fail reason"
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button onClick={handleQuranSubmit} disabled={!quranPassed || quranSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
                  {quranSubmitLoading ? 'Saving...' : 'Save Quran test result'}
                </Button>
              </CardContent>
            </Card>
          )}

          {app.status === 'approved' && app.quranTestPassed === true && app.oralTestPassed === null && (
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
                <Button onClick={handleOralSubmit} disabled={!oralPassed || oralSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
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

          {app.status === 'approved' && app.oralTestPassed === true && !app.writtenAdmitEligible && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Written test</CardTitle>
                <p className="text-sm text-slate-300">Mark applicant eligible to take the written test, then record written test result below.</p>
              </CardHeader>
              <CardContent>
                <Button onClick={handleWrittenEligible} disabled={writtenEligibleLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
                  {writtenEligibleLoading ? 'Saving...' : 'Mark written test eligible'}
                </Button>
              </CardContent>
            </Card>
          )}

          {app.status === 'approved' && app.writtenAdmitEligible && app.writtenTestPassed === null && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Written test result</CardTitle>
                <p className="text-sm text-slate-300">Record written test marks and result.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="written-marks" className="mb-1.5 block text-slate-200">Marks (optional)</Label>
                  <Input
                    id="written-marks"
                    value={writtenMarks}
                    onChange={(e) => setWrittenMarks(e.target.value)}
                    placeholder="e.g. 85"
                    className="max-w-[120px] bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-slate-200">Result</Label>
                  <Select value={writtenPassed} onValueChange={setWrittenPassed}>
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
                  <Label htmlFor="written-reason" className="mb-1.5 block text-slate-200">Remarks (optional)</Label>
                  <Input
                    id="written-reason"
                    value={writtenReason}
                    onChange={(e) => setWrittenReason(e.target.value)}
                    placeholder="Optional notes"
                    className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button onClick={handleWrittenSubmit} disabled={!writtenPassed || writtenSubmitLoading} className="bg-amber-500 hover:bg-amber-400 text-amber-950">
                  {writtenSubmitLoading ? 'Saving...' : 'Save written test result'}
                </Button>
                {(app.writtenTestPassed !== null || app.writtenTestMarks) && (
                  <p className="text-sm text-slate-400">
                    Current: {app.writtenTestMarks ?? '—'} · {app.writtenTestPassed === true ? 'Passed' : app.writtenTestPassed === false ? 'Failed' : 'Not recorded'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {app.status === 'approved' && app.writtenTestPassed === true && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white">Final approval</CardTitle>
                <p className="text-sm text-slate-300">All tests passed. Convert this application into a student record.</p>
              </CardHeader>
              <CardContent>
                <Button onClick={handleFullyApprove} disabled={fullyApproveLoading} className="bg-emerald-600 hover:bg-emerald-500">
                  {fullyApproveLoading ? 'Processing...' : 'Fully approve & create student'}
                </Button>
              </CardContent>
            </Card>
          )}

          {app.status === 'student' && (
            <Card className="secondary-card backdrop-blur-xl border border-white/10 border-emerald-500/30">
              <CardHeader>
                <CardTitle className="text-white">Student</CardTitle>
                <p className="text-sm text-slate-300">This application has been converted to a student. View in Students.</p>
              </CardHeader>
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
              <Row label="Required Class" value={app.class?.name ?? '—'} />
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

      {/* Print-only: application detail in clean format */}
      <div id="application-print" className="hidden print:block print:bg-white print:text-black print:p-8 print:max-w-4xl print:mx-auto">
        <div className="print:mb-8">
          <h1 className="print:text-2xl print:font-bold print:mb-1">Admission Application</h1>
          <p className="print:text-sm print:text-gray-600">Arabia Islamia — Secondary Education</p>
          <p className="print:text-sm print:mt-2 print:font-mono">{app.applicationNumber}</p>
          <p className="print:text-sm print:mt-1">
            Status: <span className="print:font-medium">{capitalizeStatus(app.status)}</span>
            {app.statusReason && ` · ${app.statusReason}`}
          </p>
        </div>

        <section className="print:mb-6 print:border-b print:border-gray-300 print:pb-4">
          <h2 className="print:text-lg print:font-semibold print:mb-3">Personal Information</h2>
          <table className="print:w-full print:text-sm">
            <tbody>
              <PrintRow label="Name" value={app.name} />
              <PrintRow label="Father's Name" value={app.fatherName} />
              <PrintRow label="Date of Birth" value={app.dateOfBirth} />
              <PrintRow label="Gender" value={app.gender} />
              <PrintRow label="Phone" value={app.phone} />
              <PrintRow label="Email" value={app.email} />
              <PrintRow label="ID / Passport / CRC" value={app.idNumber} />
              <PrintRow label="Address" value={app.address} />
              <PrintRow label="Permanent Address" value={app.permanentAddress} />
              <PrintRow label="Country" value={app.country} />
              <PrintRow label="State / Province" value={app.state} />
              <PrintRow label="City" value={app.city} />
              <PrintRow label="Area" value={app.area} />
              <PrintRow label="Language" value={app.language} />
            </tbody>
          </table>
        </section>

        <section className="print:mb-6 print:border-b print:border-gray-300 print:pb-4">
          <h2 className="print:text-lg print:font-semibold print:mb-3">Guardian Information</h2>
          <table className="print:w-full print:text-sm">
            <tbody>
              <PrintRow label="Name" value={app.guardianName} />
              <PrintRow label="Relation" value={app.guardianRelation} />
              <PrintRow label="Phone" value={app.guardianPhone} />
              <PrintRow label="Email" value={app.guardianEmail} />
              <PrintRow label="Occupation" value={app.guardianOccupation} />
              <PrintRow label="Address" value={app.guardianAddress} />
            </tbody>
          </table>
        </section>

        <section className="print:mb-6 print:border-b print:border-gray-300 print:pb-4">
          <h2 className="print:text-lg print:font-semibold print:mb-3">Academic Information</h2>
          <table className="print:w-full print:text-sm">
            <tbody>
              <PrintRow label="Required Class" value={app.class?.name ?? '—'} />
              <PrintRow label="Previous School" value={app.previousSchool} />
              <PrintRow label="Previous Class" value={app.previousClass} />
              <PrintRow label="Previous Grade" value={app.previousGrade} />
              <PrintRow label="Is Hafiz" value={app.isHafiz} />
              <PrintRow label="Accommodation" value={app.accommodationType} />
            </tbody>
          </table>
        </section>

        <section className="print:mb-6 print:border-b print:border-gray-300 print:pb-4">
          <h2 className="print:text-lg print:font-semibold print:mb-3">Test Results</h2>
          <table className="print:w-full print:text-sm">
            <tbody>
              <tr>
                <td className="print:py-1 print:pr-4 print:align-top print:w-32 print:text-gray-600">Quran test</td>
                <td className="print:py-1">
                  {app.quranTestPassed !== null && app.quranTestPassed !== undefined
                    ? `Marks: ${app.quranTestMarks ?? '—'} · ${app.quranTestPassed ? 'Passed' : 'Failed'}${app.quranTestReason ? ` · ${app.quranTestReason}` : ''}`
                    : 'Not recorded'}
                </td>
              </tr>
              <tr>
                <td className="print:py-1 print:pr-4 print:align-top print:text-gray-600">Oral test</td>
                <td className="print:py-1">
                  {app.oralTestPassed !== null && app.oralTestPassed !== undefined
                    ? `Marks: ${app.oralTestMarks ?? '—'} · ${app.oralTestPassed ? 'Passed' : 'Failed'}`
                    : 'Not recorded'}
                </td>
              </tr>
              <tr>
                <td className="print:py-1 print:pr-4 print:align-top print:text-gray-600">Written test</td>
                <td className="print:py-1">
                  {app.writtenTestPassed !== null && app.writtenTestPassed !== undefined
                    ? `Marks: ${app.writtenTestMarks ?? '—'} · ${app.writtenTestPassed ? 'Passed' : 'Failed'}${app.writtenTestReason ? ` · ${app.writtenTestReason}` : ''}`
                    : 'Not recorded'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="print:mb-6">
          <h2 className="print:text-lg print:font-semibold print:mb-3">Documents</h2>
          <ul className="print:text-sm print:list-disc print:pl-5">
            <li>Photo: {app.photoFileKey ? 'Attached' : '—'}</li>
            <li>ID / Passport / CRC: {app.idFileKey ? 'Attached' : '—'}</li>
            <li>Authority Letter: {app.authorityLetterFileKey ? 'Attached' : '—'}</li>
            <li>Previous Result: {app.previousResultFileKey ? 'Attached' : '—'}</li>
          </ul>
        </section>

        <p className="print:text-xs print:text-gray-500 print:mt-8">Printed on {new Date().toLocaleString()}</p>
      </div>
    </>
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

function PrintRow({ label, value }: { label: string; value: string | null }) {
  if (value == null || value === '') return null;
  return (
    <tr>
      <td className="print:py-1 print:pr-4 print:align-top print:w-40 print:text-gray-600">{label}</td>
      <td className="print:py-1 print:break-words">{value}</td>
    </tr>
  );
}
