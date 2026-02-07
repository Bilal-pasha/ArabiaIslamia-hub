'use client';

import { motion } from 'framer-motion';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { AdmissionHeader } from '@/components/admission-header';
import { InstructionsAlert } from '@/components/instructions-alert';
import { RegistrationStepper } from '@/components/stepper/stepper';

export default function AdmissionFormPage() {
  return (
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
          <RegistrationStepper />
        </div>
      </main>
    </motion.div>
  );
}
