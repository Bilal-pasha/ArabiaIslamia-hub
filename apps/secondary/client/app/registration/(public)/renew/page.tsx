'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SecondaryLogo,
  toast,
} from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes } from '@/constants/route';
import {
  findStudentByRoll,
  fetchAcademicSessions,
  fetchClasses,
  fetchSections,
  submitRenewal,
  type StudentByRollDto,
  type AcademicSessionDto,
  type ClassDto,
  type SectionDto,
} from '@/services/admission/admission.service';

type Step = 'identify' | 'confirm' | 'choose' | 'success';

export default function RenewAdmissionPage() {
  const [step, setStep] = useState<Step>('identify');
  const [rollNumber, setRollNumber] = useState('');
  const [student, setStudent] = useState<StudentByRollDto | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const [sessions, setSessions] = useState<AcademicSessionDto[]>([]);
  const [classes, setClasses] = useState<ClassDto[]>([]);
  const [sections, setSections] = useState<SectionDto[]>([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [contactOverride, setContactOverride] = useState('');
  const [addressOverride, setAddressOverride] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [renewalId, setRenewalId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAcademicSessions(), fetchClasses()])
      .then(([s, c]) => {
        setSessions(s);
        setClasses(c);
      })
      .catch(() => { });
  }, []);

  /** Use first active session, or first session, for submission (hidden from user). */
  const defaultSessionId = sessions.find((s) => s.isActive)?.id ?? sessions[0]?.id ?? '';

  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId('');
      return;
    }
    fetchSections(classId)
      .then(setSections)
      .catch(() => setSections([]));
  }, [classId]);

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setStudent(null);
    const roll = rollNumber.trim();
    if (!roll) return;
    setLookupLoading(true);
    try {
      const s = await findStudentByRoll(roll);
      if (s) {
        setStudent(s);
      } else {
        setLookupError('No student found with this roll number.');
        toast.error('No student found with this roll number.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lookup failed.';
      setLookupError(msg);
      toast.error(msg);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleConfirmAndContinue = () => {
    setContactOverride(student?.contact ?? '');
    setAddressOverride(student?.address ?? '');
    setClassId('');
    setSectionId('');
    setStep('choose');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !defaultSessionId) return;
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const res = await submitRenewal({
        studentId: student.id,
        academicSessionId: defaultSessionId,
        classId,
        sectionId,
        contactOverride: contactOverride.trim() || undefined,
        addressOverride: addressOverride.trim() || undefined,
      });
      setRenewalId(res.id);
      setStep('success');
      toast.success('Renewal application submitted');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="min-h-screen w-full min-w-0 flex items-center justify-center px-4 py-6 sm:p-6 overflow-x-hidden"
      >
        <div className="w-full max-w-md min-w-0">
          <Card className="secondary-card backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="pt-8 pb-8 px-6 sm:px-8 text-center">
              <div className="rounded-full bg-emerald-500/20 border border-emerald-400/30 p-4 w-fit mx-auto mb-6">
                <svg className="size-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="font-serif text-2xl font-semibold text-white mb-2">
                Renewal application submitted
              </CardTitle>
              <p className="text-slate-300 text-sm mb-6">
                You will be notified once it is reviewed. You may note the reference number below if needed.
              </p>
              {renewalId && (
                <p className="font-mono text-sm text-slate-400 mb-6 break-all">
                  Reference: {renewalId}
                </p>
              )}
              <Button asChild size="sm" className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-white font-medium">
                <Link href={publicRoutes.home}>Back to home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen w-full min-w-0 flex items-center justify-center px-4 py-6 sm:p-6 overflow-x-hidden"
    >
      <div className="w-full max-w-lg min-w-0">
        <div className="flex justify-center mb-6">
          <div className="rounded-xl bg-white/10 border border-white/20 p-3">
            <SecondaryLogo width={72} height={72} className="rounded-lg" />
          </div>
        </div>
        <CardTitle className="font-serif text-2xl sm:text-3xl font-semibold text-center text-white mb-2">
          Renew admission
        </CardTitle>
        <p className="text-slate-300 text-sm text-center mb-6">
          Renew your enrollment for the next academic year.
        </p>

        <AnimatePresence mode="wait">
          {step === 'identify' && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={defaultTransition}
            >
              <Card className="secondary-card backdrop-blur-xl border border-white/20 shadow-xl">
                <CardContent className="pt-6 pb-6 px-6">
                  <form onSubmit={handleFind} className="space-y-5">
                    <div>
                      <Label htmlFor="roll" className="mb-2 block text-slate-300 font-medium">
                        Roll number
                      </Label>
                      <Input
                        id="roll"
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="Enter student roll number"
                        required
                        className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-white font-medium"
                      disabled={lookupLoading}
                    >
                      {lookupLoading ? 'Finding...' : 'Find student'}
                    </Button>
                  </form>
                  {lookupError && (
                    <p className="mt-4 text-sm text-red-200 rounded-lg bg-red-500/10 border border-red-400/30 px-3 py-2">
                      {lookupError}
                    </p>
                  )}
                  {student && (
                    <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                      <p className="font-semibold text-white">Student Name: {student.name}</p>
                      {student.guardianName && (
                        <p className="text-slate-400 text-sm">Guardian Name: {student.guardianName}</p>
                      )}
                      {student.lastClassName && (
                        <p className="text-slate-400 text-sm">Previous Class: {student.lastClassName}</p>
                      )}
                      <Button
                        type="button"
                        className="w-full mt-4 h-11 bg-amber-500 hover:bg-amber-400 text-white font-medium"
                        onClick={handleConfirmAndContinue}
                      >
                        Confirm and continue
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'choose' && student && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={defaultTransition}
            >
              <Card className="secondary-card backdrop-blur-xl border border-white/20 shadow-xl">
                <CardContent className="pt-6 pb-6 px-6">
                  {/* Student summary */}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 mb-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">Renewing enrollment for</p>
                    <p className="font-semibold text-white text-lg">{student.name}</p>
                    {student.guardianName && (
                      <p className="text-slate-300 text-sm mt-0.5">Guardian: {student.guardianName}</p>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Previous class (read-only) */}
                    <div>
                      <Label className="mb-2 block text-slate-400 font-medium text-sm">Previous class</Label>
                      <div className="h-11 rounded-md border border-white/20 bg-white/5 px-3 flex items-center text-white font-medium">
                        {student.lastClassName ?? '—'}
                      </div>
                    </div>

                    {/* Requested admission class */}
                    <div>
                      <Label className="mb-2 block text-slate-300 font-medium">Requested admission class</Label>
                      <Select value={classId} onValueChange={setClassId} required>
                        <SelectTrigger className="h-11 bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Select class for next year" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="text-foreground">
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="mb-2 block text-slate-300 font-medium">Section</Label>
                      <Select value={sectionId} onValueChange={setSectionId} required disabled={!classId}>
                        <SelectTrigger className="h-11 bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder={classId ? 'Select section' : 'Select class first'} />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((sec) => (
                            <SelectItem key={sec.id} value={sec.id} className="text-foreground">
                              {sec.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-4">
                      <p className="text-slate-400 text-sm font-medium">Contact details (update if changed)</p>
                      <div>
                        <Label htmlFor="contact" className="mb-2 block text-slate-300 font-medium text-sm">
                          Contact number
                        </Label>
                        <Input
                          id="contact"
                          type="text"
                          value={contactOverride}
                          onChange={(e) => setContactOverride(e.target.value)}
                          placeholder="Phone number"
                          className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address" className="mb-2 block text-slate-300 font-medium text-sm">
                          Address
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          value={addressOverride}
                          onChange={(e) => setAddressOverride(e.target.value)}
                          placeholder="Current address"
                          className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-white font-medium"
                      disabled={submitLoading || !defaultSessionId || !classId || !sectionId}
                    >
                      {submitLoading ? 'Submitting...' : 'Submit renewal'}
                    </Button>
                  </form>

                  {submitError && (
                    <p className="mt-4 text-sm text-red-200 rounded-lg bg-red-500/10 border border-red-400/30 px-3 py-2">
                      {submitError}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 text-slate-400 hover:text-amber-300"
                    onClick={() => setStep('identify')}
                  >
                    ← Change student
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
