'use client';

import { motion } from 'framer-motion';

const FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScfMbPGg_atGPGADla6ZaTPGuCoZLTr8n9C4uvwftCohVWmzg/viewform?embedded=true';

export default function FormsPage() {
  return (
    <>
      <section className="flex flex-col items-center justify-center bg-white px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-foreground md:text-4xl">
            Registration for Inter Madaris Scouts Camping 2023
          </h1>
          <p className="mt-3 text-base text-muted-foreground md:text-xl">
            Organized by{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-amber-400 px-1 py-0.5 text-white">
                Jamia Arabia Islamia
              </span>
            </span>
          </p>
        </motion.div>
      </section>
      <div className="w-full px-4 py-8">
        <iframe
          src={FORM_EMBED_URL}
          width="100%"
          height="1200"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="Scouts Camping Registration Form"
          className="min-h-[800px] rounded-lg border border-border"
        >
          Loading…
        </iframe>
      </div>
    </>
  );
}
