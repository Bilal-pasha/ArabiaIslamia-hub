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
      <section className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground md:text-5xl">
            More
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Admissions, scholarships, downloads, and results.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 lg:py-20">
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
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/forms">Scouts Camping Registration Form</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
