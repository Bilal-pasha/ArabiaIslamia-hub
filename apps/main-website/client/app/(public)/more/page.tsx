'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';

const MORE_SECTIONS = [
  { id: 'admissions', title: 'Admissions', description: 'Information about admissions process and requirements.' },
  { id: 'scholarships', title: 'Scholarships', description: 'Scholarship opportunities for deserving students.' },
  { id: 'downloads', title: 'Downloads', description: 'Forms, prospectus, and other downloadable resources.' },
  { id: 'results', title: 'Results', description: 'Examination results and announcements.' },
];

export default function MorePage() {
  return (
    <>
      <section className="section-about-hero flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-white">
        <motion.div
          className="max-w-4xl space-y-4 lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-[Roboto] text-2xl font-bold md:text-4xl lg:text-6xl">
            More
          </h1>
          <p className="text-base md:text-lg">
            More information about our university.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto md:container px-4 py-12 lg:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {MORE_SECTIONS.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h2 className="text-xl font-semibold text-foreground">
                {section.title}
              </h2>
              <p className="mt-2 text-muted-foreground">{section.description}</p>
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href={`/more#${section.id}`}>Learn more</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
