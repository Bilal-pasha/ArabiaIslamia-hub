'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { StepIndicator } from '@/components/step-indicator';
import { AdmissionHeader } from '@/components/admission-header';
import { InstructionsAlert } from '@/components/instructions-alert';
import { AdmissionSuccess } from '@/components/admission-success';
import { SubmissionOverlay } from '@/components/registration/submission-overlay';
import { RegistrationFormCard } from '@/components/registration/registration-form-card';
import { useRegistrationForm } from '@/hooks';

export default function AdmissionFormPage() {
  const {
    formRef,
    step,
    data,
    errors,
    files,
    isSubmitting,
    submitted,
    applicationNumber,
    update,
    onFileSelect,
    next,
    prev,
    handleSubmit,
    requestSubmit,
  } = useRegistrationForm();

  if (submitted) {
    return <AdmissionSuccess applicationNumber={applicationNumber} />;
  }

  return (
    <>
      <AnimatePresence>
        {isSubmitting && <SubmissionOverlay />}
      </AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={defaultTransition}
        className="min-h-screen w-full min-w-0 overflow-x-hidden"
      >
        <AdmissionHeader />
        <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 max-w-4xl w-full min-w-0">
          <InstructionsAlert />
          <div className="mb-6 sm:mb-8">
            <StepIndicator currentStep={step} />
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="pb-24 sm:pb-8">
            <RegistrationFormCard
              step={step}
              data={data}
              errors={errors}
              files={files}
              isSubmitting={isSubmitting}
              onUpdate={update}
              onFileSelect={onFileSelect}
              onPrev={prev}
              onNext={next}
              onSubmit={requestSubmit}
            />
          </form>
        </main>
      </motion.div>
    </>
  );
}
