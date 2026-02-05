'use client';

import { motion } from 'framer-motion';
import { StatCard } from '@/client/components/molecules';

const STATS = [
  { value: 1500, label: 'Total Pass outs' },
  { value: 1500, label: 'Total Students' },
  { value: 4, label: 'Total Faculties' },
  { value: 80, label: 'Total Teachers' },
  { value: 50, label: 'Total Staff' },
  { value: 1200, label: 'Total Alumni' },
];

export function StatisticSection() {
  return (
    <section className="section-statistics flex min-h-[80vh] items-center justify-center py-8 md:my-0 md:py-12">
      <div className="w-full bg-white/40 px-4 py-8 md:px-32 md:py-12">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <h2 className="font-[Roboto] text-3xl font-semibold text-foreground md:pb-4 md:text-5xl">
              Statistic Glance at{' '}
              <span className="mx-2 bg-amber-500 text-white">Jamia Arabia Islamia</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
