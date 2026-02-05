'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Button } from '@/client/components/atoms';
import { FacultyCard } from '@/client/components/molecules';

const FACULTIES = [
  {
    title: 'Tahfeez ul Quran',
    description:
      'Dive into the sacred world of Quranic memorization and recitation with our Tahfeez ul Quran faculty, where students embark on a profound journey of preserving the divine word in their hearts.',
    btnValue: 'Learn more',
  },
  {
    title: 'Dars -e- Nizami',
    description:
      'Explore the depths of Islamic knowledge through our Darse Nizami faculty, where tradition meets modernity, and students engage in a comprehensive study of Islamic theology, jurisprudence, and spirituality.',
    btnValue: 'Learn more',
  },
  {
    title: 'Mahad ul Arabia',
    description:
      'Join the legacy of Islamic scholarship at our Mahad ul Arabia faculty, where aspiring scholars delve into advanced Arabic language and literature, equipping themselves to become torchbearers of Islamic wisdom.',
    btnValue: 'Learn more',
  },
  {
    title: 'Schooling System',
    description:
      'Discover an innovative and holistic approach to education within our Schooling System faculty, designed to nurture young minds with a strong foundation in both secular and Islamic studies, fostering well-rounded individuals ready to embrace the future.',
    btnValue: 'Learn more',
  },
];

export function FacultiesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="bg-gradient-to-r from-amber-400 to-amber-100 px-4 py-12 lg:px-32 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          ref={ref}
          className="space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, x: -24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-foreground">
            Discover the infinite possibilities that await you — OUR FACULTIES
          </p>
          <h2 className="font-[Poppins] text-2xl font-bold text-foreground lg:text-[32px]">
            Embrace Global Perspectives: In a rapidly changing world, we equip
            you with the tools to bridge the gap between tradition and
            modernity.
          </h2>
          <Button variant="outline" asChild>
            <Link href="/faculties">See All Faculties</Link>
          </Button>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:justify-start"
          initial={{ opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FACULTIES.map((f) => (
            <FacultyCard
              key={f.title}
              title={f.title}
              description={f.description}
              btnLabel={f.btnValue}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
