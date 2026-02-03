'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';

export function WhiteSection() {
  return (
    <section className="bg-pattern-lite bg-[#fffcfc] px-4 py-12 text-foreground lg:px-32 lg:py-20">
      <motion.div
        className="mx-auto max-w-4xl space-y-8 text-center lg:space-y-12"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="font-[Roboto] text-3xl font-semibold lg:text-5xl">
          Unlock the Gateway to Wisdom and Enlightenment at Jamia Arabia Islamia
        </h2>
        <blockquote className="text-xl italic text-slate-700 lg:text-2xl">
          Welcome to a world where tradition meets innovation, and faith meets
          knowledge. At{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-amber-400 px-1 py-0.5 text-white">
              Jamia Arabia Islamia
            </span>
          </span>
          , we are not just an institution; we are a timeless journey of
          discovery, enlightenment, and transformation.
        </blockquote>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/faculties">Faculties</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
