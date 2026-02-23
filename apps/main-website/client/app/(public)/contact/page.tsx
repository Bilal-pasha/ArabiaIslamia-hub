'use client';

import { motion } from 'framer-motion';
import { DonateFormSection } from '@/components/organisms';

export default function ContactPage() {
  return (
    <>
      <section className="section-about-hero flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          className="max-w-4xl space-y-4 lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className=" text-2xl font-bold md:text-4xl lg:text-6xl">
            Contact us
          </h1>
          <p className="text-base md:text-lg">
            Get in touch with Jamia Arabia Islamia. We would love to hear from you.
          </p>
        </motion.div>
      </section>
      <DonateFormSection />
    </>
  );
}
