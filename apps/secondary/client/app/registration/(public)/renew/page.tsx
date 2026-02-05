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
  const [sessionId, setSessionId] = useState('');
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
      }
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Lookup failed.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleConfirmAndContinue = () => {
    setStep('choose');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const res = await submitRenewal({
        studentId: student.id,
        academicSessionId: sessionId,
        classId,
        sectionId,
        contactOverride: contactOverride.trim() || undefined,
        addressOverride: addressOverride.trim() || undefined,
      });
      setRenewalId(res.id);
      setStep('success');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
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
              <Button asChild variant="outline" size="sm" className="w-full">
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
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href={publicRoutes.home} className="gap-2 inline-flex items-center text-sm font-medium text-slate-300 hover:text-white">
            <svg className="size-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </Button>
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
                    <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                      <p className="font-medium text-white">{student.name}</p>
                      <p className="text-slate-400 text-sm">
                        Guardian: {student.guardianName ?? '—'}
                      </p>
                      {(student.lastSessionName || student.lastClassName) && (
                        <p className="text-slate-400 text-sm">
                          Last: {[student.lastSessionName, student.lastClassName].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <Button
                        type="button"
                        className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-white"
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
                  <p className="text-slate-300 text-sm mb-4">
                    Enrolling: <span className="font-medium text-white">{student.name}</span>
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-slate-300 font-medium">Academic session</Label>
                      <Select value={sessionId} onValueChange={setSessionId} required>
                        <SelectTrigger className="h-11 bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map((s) => (
                            <SelectItem key={s.id} value={s.id} className="text-foreground">
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-2 block text-slate-300 font-medium">Class</Label>
                      <Select value={classId} onValueChange={setClassId} required>
                        <SelectTrigger className="h-11 bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Select class" />
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
                          <SelectValue placeholder="Select section" />
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
                    <div>
                      <Label htmlFor="contact" className="mb-2 block text-slate-300 font-medium">
                        Contact (optional)
                      </Label>
                      <Input
                        id="contact"
                        type="text"
                        value={contactOverride}
                        onChange={(e) => setContactOverride(e.target.value)}
                        placeholder="Updated phone"
                        className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="mb-2 block text-slate-300 font-medium">
                        Address (optional)
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={addressOverride}
                        onChange={(e) => setAddressOverride(e.target.value)}
                        placeholder="Updated address"
                        className="h-11 bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-white font-medium"
                      disabled={submitLoading || !sessionId || !classId || !sectionId}
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
                    className="w-full mt-4 text-slate-400"
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
