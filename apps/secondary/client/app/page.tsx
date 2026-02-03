'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SecondaryLogo, Button } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { externalUrls } from '@/constants/route';

export default function SecondaryHubPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0f2744] to-[#1e4a6f] text-white"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(77,163,199,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(232,93,44,0.1)_0%,_transparent_50%)]" />
        <div className="relative flex flex-col items-center justify-between mx-auto min-h-screen p-12">
          <motion.div variants={fadeInUp} transition={defaultTransition} className="text-center gap-4 my-4 flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur p-4 shadow-xl">
              <SecondaryLogo width={120} height={120} className="rounded-xl" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Arabia Islamia
            </h1>
            <p className="text-xl text-slate-300 max-w-xl mx-auto">
              Secondary Education — Admissions & Administration
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            transition={{ ...defaultTransition, delay: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-fit mx-auto"
          >
            <Link href={externalUrls.registration}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col items-center p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:border-orange-400/50 transition-all duration-300 cursor-pointer"
              >
                <div className="size-14 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <svg className="size-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">Online Admission</h2>
                <p className="text-slate-400 text-sm text-center">Apply for admission to Secondary Education</p>
                <span className="mt-4 text-orange-400 text-sm font-medium group-hover:underline">
                  Start Application →
                </span>
              </motion.div>
            </Link>

            <Link href={externalUrls.status}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col items-center p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer"
              >
                <div className="size-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  <svg className="size-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">View My Application Status</h2>
                <p className="text-slate-400 text-sm text-center">Check status with your application number</p>
                <span className="mt-4 text-emerald-400 text-sm font-medium group-hover:underline">
                  Check Status →
                </span>
              </motion.div>
            </Link>

            <Link href={externalUrls.applications}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col items-center p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 cursor-pointer"
              >
                <div className="size-14 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4 group-hover:bg-sky-500/30 transition-colors">
                  <svg className="size-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">View Applications</h2>
                <p className="text-slate-400 text-sm text-center">Admin access to view and manage applications</p>
                <span className="mt-4 text-sky-400 text-sm font-medium group-hover:underline">
                  Open Admin →
                </span>
              </motion.div>
            </Link>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            transition={{ ...defaultTransition, delay: 0.25 }}
            className="text-center text-slate-500 text-sm"
          >
            Arabia Islamia © {new Date().getFullYear()}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
