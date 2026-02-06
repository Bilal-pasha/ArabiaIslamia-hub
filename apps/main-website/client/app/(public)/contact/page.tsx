'use client';

import { motion } from 'framer-motion';
import { DonateFormSection } from '@/components/organisms';

export default function ContactPage() {
  return (
    <>
      <section className="bg-pattern-lite flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground md:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get in touch with Jamia Arabia Islamia. We would love to hear from
            you.
          </p>
        </motion.div>
      </section>
      <DonateFormSection />
    </>
  );
}
